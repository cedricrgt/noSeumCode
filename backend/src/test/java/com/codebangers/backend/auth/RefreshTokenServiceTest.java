package com.codebangers.backend.auth;

import com.codebangers.backend.auth.dto.AuthResponse;
import com.codebangers.backend.auth.model.RefreshToken;
import com.codebangers.backend.auth.repository.RefreshTokenRepository;
import com.codebangers.backend.auth.security.TokenHashUtils;
import com.codebangers.backend.auth.service.RefreshTokenService;
import com.codebangers.backend.config.JwtService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RefreshTokenServiceTest {

    private RefreshTokenRepository refreshTokenRepository;
    private JwtService jwtService;
    private RefreshTokenService refreshTokenService;

    @BeforeEach
    void setUp() {
        refreshTokenRepository = mock(RefreshTokenRepository.class);
        jwtService = mock(JwtService.class);
        refreshTokenService = new RefreshTokenService(refreshTokenRepository, jwtService, 7, 1);
    }

    @Test
    void shouldCreateRefreshTokenWithValidExpiry() {
        User user = new User("user1", "John", "Doe", "john@example.com", "hash", Role.STUDENT);
        user.setId(UUID.randomUUID());

        String rawToken = refreshTokenService.createRefreshToken(user);

        assertNotNull(rawToken);
        ArgumentCaptor<RefreshToken> captor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(captor.capture());

        RefreshToken saved = captor.getValue();
        assertEquals(TokenHashUtils.hashToken(rawToken), saved.getTokenHash());
        assertEquals(user, saved.getUser());
        assertFalse(saved.isRevoked());
        assertTrue(saved.getExpiryDate().isAfter(Instant.now()));
    }

    @Test
    void shouldRotateRefreshTokenSuccessfully() {
        User user = new User("user1", "John", "Doe", "john@example.com", "hash", Role.STUDENT);
        user.setId(UUID.randomUUID());

        String oldRawToken = "old-refresh-token-value-12345";
        String oldTokenHash = TokenHashUtils.hashToken(oldRawToken);
        Instant futureExpiry = Instant.now().plus(7, ChronoUnit.DAYS);

        RefreshToken existingToken = new RefreshToken(oldTokenHash, user, futureExpiry);
        when(refreshTokenRepository.findByTokenHash(oldTokenHash)).thenReturn(Optional.of(existingToken));
        when(jwtService.generateToken(user)).thenReturn("new.access.token");

        AuthResponse response = refreshTokenService.rotateRefreshToken(oldRawToken);

        assertNotNull(response);
        assertEquals("new.access.token", response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertNotEquals(oldRawToken, response.getRefreshToken());
        assertEquals(3600L, response.getExpiresIn());

        // Previous token must be revoked
        assertTrue(existingToken.isRevoked());
        verify(refreshTokenRepository, atLeastOnce()).save(existingToken);
    }

    @Test
    void shouldDetectReuseOfRevokedTokenAndRevokeAllUserTokens() {
        User user = new User("user1", "John", "Doe", "john@example.com", "hash", Role.STUDENT);
        user.setId(UUID.randomUUID());

        String compromisedToken = "compromised-token";
        String tokenHash = TokenHashUtils.hashToken(compromisedToken);
        Instant futureExpiry = Instant.now().plus(7, ChronoUnit.DAYS);

        RefreshToken revokedToken = new RefreshToken(tokenHash, user, futureExpiry);
        revokedToken.setRevoked(true);
        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(revokedToken));

        assertThrows(IllegalArgumentException.class, () -> refreshTokenService.rotateRefreshToken(compromisedToken));
        // Verify all tokens for this user are immediately revoked
        verify(refreshTokenRepository).revokeAllByUser(user);
    }

    @Test
    void shouldRejectExpiredRefreshToken() {
        User user = new User("user1", "John", "Doe", "john@example.com", "hash", Role.STUDENT);
        String expiredRawToken = "expired-token";
        String tokenHash = TokenHashUtils.hashToken(expiredRawToken);
        Instant pastExpiry = Instant.now().minus(1, ChronoUnit.DAYS);

        RefreshToken expiredToken = new RefreshToken(tokenHash, user, pastExpiry);
        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(expiredToken));

        assertThrows(IllegalArgumentException.class, () -> refreshTokenService.rotateRefreshToken(expiredRawToken));
    }
}
