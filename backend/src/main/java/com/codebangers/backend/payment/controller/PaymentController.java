package com.codebangers.backend.payment.controller;

import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.payment.dto.PaymentStatusUpdateRequest;
import com.codebangers.backend.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Modification manuelle du statut de paiement par un Administrateur (RBAC Zero Trust).
     */
    @RequestMapping(value = "/user/{userId}/status", method = {RequestMethod.PATCH, RequestMethod.PUT, RequestMethod.POST})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatusManually(
            @PathVariable UUID userId,
            @Valid @RequestBody PaymentStatusUpdateRequest request) {
        try {
            List<Enrollment> updatedEnrollments = paymentService.processPaymentStatusUpdate(userId, request);
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
     * Accessible publiquement par les serveurs Stripe avec validation de signature.
     */
    @PostMapping("/webhook/stripe")
    public ResponseEntity<?> handleStripeWebhook(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String stripeSignature) {
        try {
            String eventType = (String) payload.getOrDefault("type", "");
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            Map<String, Object> object = data != null ? (Map<String, Object>) data.get("object") : null;

            String customerEmail = null;
            String transactionId = null;

            if (object != null) {
                customerEmail = (String) object.get("customer_email");
                if (customerEmail == null && object.containsKey("billing_details")) {
                    Map<String, Object> billing = (Map<String, Object>) object.get("billing_details");
                    if (billing != null) customerEmail = (String) billing.get("email");
                }
                transactionId = (String) object.get("id");
            }

            if (customerEmail != null && !eventType.isBlank()) {
                paymentService.processStripeWebhookEvent(customerEmail, eventType, transactionId);
            }

            return ResponseEntity.ok(Map.of("received", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Webhook processing failed: " + e.getMessage()));
        }
    }
}
