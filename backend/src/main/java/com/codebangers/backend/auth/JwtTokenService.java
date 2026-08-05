package com.codebangers.backend.auth;

import com.codebangers.backend.user.model.User;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtTokenService {

    private static final String DEFAULT_SECRET = "codebangers-super-secret-key-change-me-in-production-2026";

    private final byte[] secretKey;

    public JwtTokenService(@Value("${app.jwt.secret:codebangers-super-secret-key-change-me-in-production-2026}") String secret) {
        String resolvedSecret = (secret == null || secret.isBlank()) ? DEFAULT_SECRET : secret;
        this.secretKey = resolvedSecret.getBytes(StandardCharsets.UTF_8);
    }

    public String generateToken(User user) {
        Instant now = Instant.now();
        String userId = user.getId() != null ? user.getId().toString() : "unknown";
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .claim("role", user.getRole().name())
                .claim("userId", userId)
                .issueTime(Date.from(now))
                .expirationTime(Date.from(now.plusSeconds(3600)))
                .build();

        try {
            JWSSigner signer = new MACSigner(secretKey);
            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
            signedJWT.sign(signer);
            return signedJWT.serialize();
        } catch (JOSEException e) {
            throw new IllegalStateException("Unable to sign JWT token", e);
        }
    }
}
