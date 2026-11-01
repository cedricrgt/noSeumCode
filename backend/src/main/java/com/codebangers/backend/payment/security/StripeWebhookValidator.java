package com.codebangers.backend.payment.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;

@Component
public class StripeWebhookValidator {

    private static final Logger log = LoggerFactory.getLogger(StripeWebhookValidator.class);
    private static final long DEFAULT_TOLERANCE_SECONDS = 300L; // 5 minutes

    /**
     * Valide la signature cryptographique HMAC SHA-256 du webhook Stripe.
     * Conforme aux spécifications officielles de Stripe (t=timestamp, v1=signature).
     *
     * @param payload Corps brut de la requête HTTP (JSON)
     * @param sigHeader Valeur du header 'Stripe-Signature'
     * @param secret Clé secrète de signature du webhook Stripe (whsec_...)
     * @return true si la signature est valide et le timestamp dans la tolérance
     */
    public boolean isValidSignature(String payload, String sigHeader, String secret) {
        return isValidSignature(payload, sigHeader, secret, DEFAULT_TOLERANCE_SECONDS);
    }

    public boolean isValidSignature(String payload, String sigHeader, String secret, long toleranceSeconds) {
        if (payload == null || sigHeader == null || secret == null || secret.isBlank()) {
            log.warn("Tentative de validation Stripe webhook avec paramètres manquants.");
            return false;
        }

        try {
            long timestamp = -1;
            List<String> signatures = new ArrayList<>();

            // Le header est au format : t=1492774577,v1=5257a869e7...,v0=...
            String[] items = sigHeader.split(",");
            for (String item : items) {
                String[] parts = item.trim().split("=", 2);
                if (parts.length != 2) continue;
                String key = parts[0].trim();
                String val = parts[1].trim();

                if ("t".equals(key)) {
                    try {
                        timestamp = Long.parseLong(val);
                    } catch (NumberFormatException e) {
                        log.warn("Timestamp Stripe invalide dans le header: {}", val);
                        return false;
                    }
                } else if ("v1".equals(key)) {
                    signatures.add(val);
                }
            }

            if (timestamp <= 0 || signatures.isEmpty()) {
                log.warn("Header Stripe-Signature incomplet (timestamp ou signatures v1 absents).");
                return false;
            }

            // Vérification anti-rejeu (replay attack)
            long currentTimestamp = Instant.now().getEpochSecond();
            if (toleranceSeconds > 0 && Math.abs(currentTimestamp - timestamp) > toleranceSeconds) {
                log.warn("Webhook Stripe rejeté: timestamp expiré (reçu: {}, actuel: {}, tolérance: {}s)",
                        timestamp, currentTimestamp, toleranceSeconds);
                return false;
            }

            // Calcul du HMAC SHA-256 attendu
            String signedPayload = timestamp + "." + payload;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] expectedHashBytes = mac.doFinal(signedPayload.getBytes(StandardCharsets.UTF_8));
            String expectedSignature = HexFormat.of().formatHex(expectedHashBytes);

            // Comparaison en temps constant (constant-time) contre les attaques temporelles (timing attacks)
            byte[] expectedBytes = expectedSignature.getBytes(StandardCharsets.UTF_8);
            for (String sig : signatures) {
                byte[] sigBytes = sig.getBytes(StandardCharsets.UTF_8);
                if (MessageDigest.isEqual(expectedBytes, sigBytes)) {
                    return true;
                }
            }

            log.warn("Signature Stripe HMAC non concordante.");
            return false;
        } catch (Exception e) {
            log.error("Erreur lors de la validation de la signature Stripe: {}", e.getMessage(), e);
            return false;
        }
    }
}
