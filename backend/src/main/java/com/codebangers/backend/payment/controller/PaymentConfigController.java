package com.codebangers.backend.payment.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class PaymentConfigController {

    private final String stripePublishableKey;

    public PaymentConfigController(
            @Value("${stripe.publishable.key:${STRIPE_PUBLISHABLE_KEY:}}") String stripePublishableKey) {
        this.stripePublishableKey = stripePublishableKey != null ? stripePublishableKey : "";
    }

    @GetMapping("/stripe-key")
    public ResponseEntity<Map<String, String>> getStripePublishableKey() {
        return ResponseEntity.ok(Map.of("publishableKey", stripePublishableKey));
    }
}
