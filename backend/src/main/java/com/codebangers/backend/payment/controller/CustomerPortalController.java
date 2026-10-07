package com.codebangers.backend.payment.controller;

import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import com.codebangers.backend.payment.service.CheckoutService;
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
public class CustomerPortalController {

    private static final Logger log = LoggerFactory.getLogger(CustomerPortalController.class);

    private final CheckoutService checkoutService;
    private final UserService userService;

    public CustomerPortalController(CheckoutService checkoutService, UserService userService) {
        this.checkoutService = checkoutService;
        this.userService = userService;
    }

    @PostMapping("/create-customer-portal-session")
    public ResponseEntity<?> createCustomerPortalSession(
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentification requise pour accéder au portail de facturation."));
        }

        if (userService == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Service utilisateur non disponible."));
        }

        String email = jwt.getSubject();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new com.codebangers.backend.config.exception.ResourceNotFoundException("User", email));

        try {
            String returnUrl = (body != null) ? body.get("returnUrl") : null;
            String portalUrl = checkoutService.createCustomerPortalSession(user, returnUrl);
            return ResponseEntity.ok(Map.of("portalUrl", portalUrl));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Erreur lors de la création de session Customer Portal pour {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Échec de l'accès au portail de facturation: " + e.getMessage()));
        }
    }
}
