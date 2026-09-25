package com.codebangers.backend.payment.controller;

import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.payment.dto.CheckoutSessionResponse;
import com.codebangers.backend.payment.dto.CreateCheckoutSessionRequest;
import com.codebangers.backend.payment.dto.PaymentStatusUpdateRequest;
import com.codebangers.backend.payment.security.StripeWebhookValidator;
import com.codebangers.backend.payment.service.PaymentService;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;
    private final UserService userService;
    private final StripeWebhookValidator stripeWebhookValidator;
    private final ObjectMapper objectMapper;
    private final String stripeWebhookSecret;

    public PaymentController(
            PaymentService paymentService,
            StripeWebhookValidator stripeWebhookValidator,
            ObjectMapper objectMapper,
            @Value("${stripe.webhook.secret:}") String stripeWebhookSecret) {
        this(paymentService, null, stripeWebhookValidator, objectMapper, stripeWebhookSecret);
    }

    @Autowired
    public PaymentController(
            PaymentService paymentService,
            UserService userService,
            StripeWebhookValidator stripeWebhookValidator,
            ObjectMapper objectMapper,
            @Value("${stripe.webhook.secret:}") String stripeWebhookSecret) {
        this.paymentService = paymentService;
        this.userService = userService;
        this.stripeWebhookValidator = stripeWebhookValidator;
        this.objectMapper = objectMapper;
        this.stripeWebhookSecret = stripeWebhookSecret;
    }

    /**
     * Modification manuelle du statut de paiement par un Administrateur (RBAC Zero Trust).
     * Accepte l'UUID de l'utilisateur ou son adresse email.
     */
    @RequestMapping(value = "/user/{userIdentifier}/status", method = {RequestMethod.PATCH, RequestMethod.PUT, RequestMethod.POST})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatusManually(
            @PathVariable String userIdentifier,
            @Valid @RequestBody PaymentStatusUpdateRequest request) {
        try {
            List<Enrollment> updatedEnrollments = paymentService.processPaymentStatusUpdate(userIdentifier, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Statut de paiement mis à jour avec succès.",
                    "status", request.getPaymentStatus(),
                    "enrollmentsCount", updatedEnrollments.size()
            ));
        } catch (com.codebangers.backend.config.exception.ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erreur lors de la mise à jour : " + e.getMessage()));
        }
    }

    /**
     * Création d'une Checkout Session Stripe hébergée.
     * Endpoint sécurisé réservé aux utilisateurs authentifiés avec JWT.
     */
    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(
            @Valid @RequestBody CreateCheckoutSessionRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentification requise pour initier un achat."));
        }

        if (userService == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Service utilisateur non disponible."));
        }

        String email = jwt.getSubject();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new com.codebangers.backend.config.exception.ResourceNotFoundException("User", email));

        try {
            CheckoutSessionResponse response = paymentService.createCheckoutSession(user, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (com.codebangers.backend.config.exception.ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Erreur lors de la création de checkout session pour {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Échec de l'initialisation du paiement: " + e.getMessage()));
        }
    }

    /**
     * Webhook Stripe récepteur d'événements automatisés (Stripe Webhook Handler).
     * Accessible publiquement par les serveurs Stripe avec validation HMAC SHA-256 cryptographique.
     */
    @PostMapping(value = {"/webhook", "/webhook/stripe"}, consumes = "application/json")
    public ResponseEntity<?> handleStripeWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(value = "Stripe-Signature", required = false) String stripeSignature) {

        // Validation HMAC obligatoire si le secret webhook est configuré
        if (stripeWebhookSecret != null && !stripeWebhookSecret.isBlank()) {
            if (stripeSignature == null || stripeSignature.isBlank()) {
                log.warn("Tentative d'appel webhook Stripe sans header Stripe-Signature.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Missing Stripe-Signature header."));
            }

            boolean isValid = stripeWebhookValidator.isValidSignature(rawPayload, stripeSignature, stripeWebhookSecret);
            if (!isValid) {
                log.warn("Signature Stripe Webhook invalide ou tentative de rejeu rejetée.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid webhook signature or expired timestamp."));
            }
        } else {
            log.warn("⚠️ [SECURITY WARNING] STRIPE_WEBHOOK_SECRET non configuré. Validation HMAC ignorée (dev).");
        }

        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            String eventType = root.path("type").asText("");
            JsonNode dataObject = root.path("data").path("object");

            String customerEmail = null;
            String transactionId = null;
            String courseId = null;
            String userId = null;

            if (!dataObject.isMissingNode()) {
                customerEmail = dataObject.path("customer_email").asText(null);
                if (customerEmail == null && dataObject.has("customer_details")) {
                    customerEmail = dataObject.path("customer_details").path("email").asText(null);
                }
                if (customerEmail == null && dataObject.has("billing_details")) {
                    customerEmail = dataObject.path("billing_details").path("email").asText(null);
                }
                transactionId = dataObject.path("id").asText(null);

                JsonNode metadata = dataObject.path("metadata");
                if (!metadata.isMissingNode()) {
                    courseId = metadata.path("courseId").asText(null);
                    userId = metadata.path("userId").asText(null);
                    if (customerEmail == null) {
                        customerEmail = metadata.path("userEmail").asText(null);
                    }
                }
            }

            if ((customerEmail != null && !customerEmail.isBlank()) || (userId != null && !userId.isBlank())) {
                if (courseId != null || userId != null) {
                    paymentService.processStripeWebhookEvent(customerEmail, eventType, transactionId, courseId, userId);
                } else {
                    paymentService.processStripeWebhookEvent(customerEmail, eventType, transactionId);
                }
            }

            return ResponseEntity.ok(Map.of("received", true));
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            log.error("JSON malformé reçu sur le webhook Stripe: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Malformed JSON payload: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Erreur lors du traitement de l'événement Stripe: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Webhook processing failed: " + e.getMessage()));
        }
    }

    /**
     * Endpoint sécurisé de confirmation et réconciliation synchrone d'une session Stripe Checkout.
     * Permet au frontend (success.html ou cours.html) de garantir le déblocage immédiat de la formation.
     */
    @GetMapping("/confirm-session")
    public ResponseEntity<?> confirmCheckoutSession(
            @RequestParam("session_id") String sessionId,
            @AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentification requise pour confirmer le paiement."));
        }
        String email = jwt.getSubject();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new com.codebangers.backend.config.exception.ResourceNotFoundException("User", email));

        try {
            Enrollment enrollment = paymentService.confirmCheckoutSession(user, sessionId);
            return ResponseEntity.ok(Map.of(
                    "confirmed", true,
                    "courseId", enrollment.getCourse().getId(),
                    "paymentStatus", enrollment.getPaymentStatus()
            ));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Erreur lors de la confirmation de session Stripe pour {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Impossible de synchroniser le paiement: " + e.getMessage()));
        }
    }
}
