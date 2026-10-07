package com.codebangers.backend.payment.controller;

import com.codebangers.backend.payment.dto.PaymentStatusUpdateRequest;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.payment.service.PaymentStatusService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class AdminPaymentController {

    private final PaymentStatusService paymentStatusService;

    public AdminPaymentController(PaymentStatusService paymentStatusService) {
        this.paymentStatusService = paymentStatusService;
    }

    @RequestMapping(value = "/user/{userIdentifier}/status", method = {RequestMethod.PATCH, RequestMethod.PUT, RequestMethod.POST})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatusManually(
            @PathVariable String userIdentifier,
            @Valid @RequestBody PaymentStatusUpdateRequest request) {
        try {
            List<Enrollment> updatedEnrollments = paymentStatusService.processPaymentStatusUpdate(userIdentifier, request);
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
}
