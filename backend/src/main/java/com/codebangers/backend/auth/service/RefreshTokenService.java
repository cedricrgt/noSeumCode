package com.codebangers.backend.auth.service;

import com.codebangers.backend.auth.dto.AuthResponse;
import com.codebangers.backend.auth.model.RefreshToken;
import com.codebangers.backend.auth.repository.RefreshTokenRepository;
import com.codebangers.backend.auth.security.TokenHashUtils;
import com.codebangers.backend.config.JwtService;
import com.codebangers.backend.user.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@Transactional
public class RefreshTokenService {

    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final long refreshTokenValidityDays;
    private final long jwtExpiryHours;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            JwtService jwtService,
            @Value("${app.security.refresh-token-validity-days:7}") long refreshTokenValidityDays,
            @Value("${app.security.jwt-expiry-hours:1}") long jwtExpiryHours) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.refreshTokenValidityDays = refreshTokenValidityDays;
        this.jwtExpiryHours = jwtExpiryHours;
    }

    public String createRefreshToken(User user) {
        String rawToken = TokenHashUtils.generateSecureRandomToken(32);
        String tokenHash = TokenHashUtils.hashToken(rawToken);

        Instant expiryDate = Instant.now().plus(refreshTokenValidityDays, ChronoUnit.DAYS);
        RefreshToken refreshToken = new RefreshToken(tokenHash, user, expiryDate);
        refreshTokenRepository.save(refreshToken);

        return rawToken;
    }

    public AuthResponse rotateRefreshToken(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token manquant");
        }

        String tokenHash = TokenHashUtils.hashToken(rawRefreshToken);
        RefreshToken existingToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Jeton d'actualisation invalide ou introuvable"));

        if (existingToken.isRevoked()) {
            // Possible token reuse attack detected: revoke all tokens for this user
            log.warn("Tentative de réutilisation d'un refresh token révoqué pour l'utilisateur ID: {}", existingToken.getUser().getId());
            refreshTokenRepository.revokeAllByUser(existingToken.getUser());
            throw new IllegalArgumentException("Session expirée ou compromise. Veuillez vous reconnecter.");
        }

        if (existingToken.isExpired()) {
            throw new IllegalArgumentException("Session expirée. Veuillez vous reconnecter.");
        }

        User user = existingToken.getUser();
        if (user.isDeleted() || user.isBlocked()) {
            throw new IllegalArgumentException("Compte suspendu ou inaccessible");
        }

        // RTR: Revoke previous token
        existingToken.setRevoked(true);
        refreshTokenRepository.save(existingToken);

        // Generate new refresh token and new access token
        String newRawRefreshToken = createRefreshToken(user);
        String newAccessToken = jwtService.generateToken(user);
        long expiresInSeconds = jwtExpiryHours * 3600L;

        return new AuthResponse(
                user.getId(),
                user.getUserName(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name(),
                user.getAvatarUrl(),
                "Session actualisée avec succès",
                newAccessToken,
                newRawRefreshToken,
                expiresInSeconds
        );
    }

    public void revokeToken(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return;
        }
        String tokenHash = TokenHashUtils.hashToken(rawRefreshToken);
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    public void revokeAllUserTokens(User user) {
        refreshTokenRepository.revokeAllByUser(user);
    }
}
