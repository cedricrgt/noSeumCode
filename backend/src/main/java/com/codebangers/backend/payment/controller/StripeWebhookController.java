package com.codebangers.backend.payment.controller;

import com.codebangers.backend.payment.security.StripeWebhookValidator;
import com.codebangers.backend.payment.service.StripeEventService;
import com.codebangers.backend.payment.repository.StripeEventRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class StripeWebhookController {

    private static final Logger log = LoggerFactory.getLogger(StripeWebhookController.class);

    private final StripeEventService stripeEventService;
    private final StripeWebhookValidator stripeWebhookValidator;
    private final ObjectMapper objectMapper;
    private final String stripeWebhookSecret;
    private final StripeEventRepository stripeEventRepository;

    public StripeWebhookController(
            StripeEventService stripeEventService,
            StripeWebhookValidator stripeWebhookValidator,
            ObjectMapper objectMapper,
            StripeEventRepository stripeEventRepository,
            @Value("${stripe.webhook.secret:}") String stripeWebhookSecret) {
        this.stripeEventService = stripeEventService;
        this.stripeWebhookValidator = stripeWebhookValidator;
        this.objectMapper = objectMapper;
        this.stripeEventRepository = stripeEventRepository;
        this.stripeWebhookSecret = stripeWebhookSecret;
    }

    @GetMapping(value = {"/webhook", "/webhook/stripe"})
    public ResponseEntity<Map<String, Object>> getWebhookHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "stripe-webhook",
                "endpoint", "/api/payments/webhook",
                "message", "NoSeumCode Stripe Webhook listener is operational. Expecting POST requests with Stripe-Signature."
        ));
    }

    @PostMapping(value = {"/webhook", "/webhook/stripe"}, consumes = "application/json")
    public ResponseEntity<?> handleStripeWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(value = "Stripe-Signature", required = false) String stripeSignature) {

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
            String eventId = root.path("id").asText(null);
            String eventType = root.path("type").asText("");

            if (eventId != null && !eventId.isBlank()) {
                try {
                    com.codebangers.backend.payment.model.StripeEvent event =
                            new com.codebangers.backend.payment.model.StripeEvent(eventId, eventType, java.time.LocalDateTime.now());
                    stripeEventRepository.saveAndFlush(event);
                } catch (org.springframework.dao.DataIntegrityViolationException e) {
                    log.info("Événement Stripe déjà traité (idempotence): id={}, type={}", eventId, eventType);
                    return ResponseEntity.ok(Map.of("received", true, "idempotent", true));
                }
            }

            JsonNode dataObject = root.path("data").path("object");

            String customerEmail = null;
            String transactionId = null;
            String courseId = null;
            String userId = null;
            String tier = null;
            String cohortId = null;
            String addon = null;

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
                    tier = metadata.path("tier").asText(null);
                    cohortId = metadata.path("cohortId").asText(null);
                    addon = metadata.path("addon").asText(null);
                    if (customerEmail == null) {
                        customerEmail = metadata.path("userEmail").asText(null);
                    }
                }
            }

            if ((customerEmail != null && !customerEmail.isBlank()) || (userId != null && !userId.isBlank())) {
                if (courseId != null || userId != null) {
                    stripeEventService.processStripeWebhookEvent(customerEmail, eventType, transactionId, courseId, userId, tier, cohortId, addon);
                } else {
                    stripeEventService.processStripeWebhookEvent(customerEmail, eventType, transactionId);
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
}
