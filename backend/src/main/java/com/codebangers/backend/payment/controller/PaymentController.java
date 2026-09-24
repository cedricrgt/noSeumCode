package com.codebangers.backend.payment.controller;

import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.payment.dto.PaymentStatusUpdateRequest;
import com.codebangers.backend.payment.security.StripeWebhookValidator;
import com.codebangers.backend.payment.service.PaymentService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;
    private final StripeWebhookValidator stripeWebhookValidator;
    private final ObjectMapper objectMapper;
    private final String stripeWebhookSecret;

    public PaymentController(
            PaymentService paymentService,
            StripeWebhookValidator stripeWebhookValidator,
            ObjectMapper objectMapper,
            @Value("${stripe.webhook.secret:}") String stripeWebhookSecret) {
        this.paymentService = paymentService;
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
     * Webhook Stripe récepteur d'événements automatisés (Stripe Webhook Handler).
     * Accessible publiquement par les serveurs Stripe avec validation HMAC SHA-256 cryptographique.
     */
    @PostMapping(value = "/webhook/stripe", consumes = "application/json")
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

            if (!dataObject.isMissingNode()) {
                customerEmail = dataObject.path("customer_email").asText(null);
                if (customerEmail == null && dataObject.has("billing_details")) {
                    customerEmail = dataObject.path("billing_details").path("email").asText(null);
                }
                transactionId = dataObject.path("id").asText(null);
            }

            if (customerEmail != null && !customerEmail.isBlank() && !eventType.isBlank()) {
                paymentService.processStripeWebhookEvent(customerEmail, eventType, transactionId);
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
}
