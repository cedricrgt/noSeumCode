package com.codebangers.backend.payment.controller;

import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.payment.dto.CheckoutSessionResponse;
import com.codebangers.backend.payment.dto.CreateCheckoutSessionRequest;
import com.codebangers.backend.payment.service.CheckoutService;
import com.codebangers.backend.payment.service.EnrollmentProvisioningService;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class CheckoutController {

    private static final Logger log = LoggerFactory.getLogger(CheckoutController.class);

    private final CheckoutService checkoutService;
    private final EnrollmentProvisioningService enrollmentProvisioningService;
    private final UserService userService;

    public CheckoutController(CheckoutService checkoutService, EnrollmentProvisioningService enrollmentProvisioningService, UserService userService) {
        this.checkoutService = checkoutService;
        this.enrollmentProvisioningService = enrollmentProvisioningService;
        this.userService = userService;
    }

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
            CheckoutSessionResponse response = checkoutService.createCheckoutSession(user, request);
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
            Enrollment enrollment = enrollmentProvisioningService.confirmCheckoutSession(user, sessionId);
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
