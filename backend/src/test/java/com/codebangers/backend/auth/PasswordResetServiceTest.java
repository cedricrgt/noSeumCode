package com.codebangers.backend.auth;

import com.codebangers.backend.auth.dto.ResetPasswordRequest;
import com.codebangers.backend.auth.model.PasswordResetToken;
import com.codebangers.backend.auth.repository.PasswordResetTokenRepository;
import com.codebangers.backend.auth.security.TokenHashUtils;
import com.codebangers.backend.auth.service.PasswordResetService;
import com.codebangers.backend.auth.service.RefreshTokenService;
import com.codebangers.backend.email.EmailService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class PasswordResetServiceTest {

    private UserRepository userRepository;
    private PasswordResetTokenRepository tokenRepository;
    private PasswordEncoder passwordEncoder;
    private EmailService emailService;
    private RefreshTokenService refreshTokenService;
    private PasswordResetService resetService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        tokenRepository = mock(PasswordResetTokenRepository.class);
        passwordEncoder = new BCryptPasswordEncoder();
        emailService = mock(EmailService.class);
        refreshTokenService = mock(RefreshTokenService.class);

        resetService = new PasswordResetService(
                userRepository,
                tokenRepository,
                passwordEncoder,
                emailService,
                refreshTokenService,
                "https://noseumcode.fr/reset-password.html",
                30
        );
    }

    @Test
    void shouldInitiatePasswordResetForValidUser() {
        User user = new User("student1", "John", "Doe", "john@example.com", "oldHash", Role.STUDENT);
        user.setId(UUID.randomUUID());
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        resetService.initiatePasswordReset("john@example.com");

        verify(tokenRepository).deleteByUser(user);
        ArgumentCaptor<PasswordResetToken> tokenCaptor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(tokenRepository).save(tokenCaptor.capture());

        PasswordResetToken saved = tokenCaptor.getValue();
        assertNotNull(saved.getTokenHash());
        assertEquals(user, saved.getUser());
        assertFalse(saved.isUsed());
        assertTrue(saved.getExpiryDate().isAfter(Instant.now()));

        verify(emailService).sendPasswordResetEmail(eq("john@example.com"), eq("John"), contains("https://noseumcode.fr/reset-password.html?token="));
    }

    @Test
    void shouldSilentlyIgnoreNonExistentUserOnInitiation() {
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> resetService.initiatePasswordReset("ghost@example.com"));

        verify(tokenRepository, never()).save(any());
        verify(emailService, never()).sendPasswordResetEmail(any(), any(), any());
    }

    @Test
    void shouldResetPasswordSuccessfullyAndRevokeActiveSessions() {
        User user = new User("student1", "John", "Doe", "john@example.com", passwordEncoder.encode("oldPassword123"), Role.STUDENT);
        user.setId(UUID.randomUUID());

        String rawToken = "my-secure-one-time-token-12345";
        String tokenHash = TokenHashUtils.hashToken(rawToken);
        Instant futureExpiry = Instant.now().plus(30, ChronoUnit.MINUTES);

        PasswordResetToken resetToken = new PasswordResetToken(tokenHash, user, futureExpiry);
        when(tokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(resetToken));

        ResetPasswordRequest request = new ResetPasswordRequest(rawToken, "brandNewPassword2026!");
        resetService.resetPassword(request);

        assertTrue(passwordEncoder.matches("brandNewPassword2026!", user.getPassword()));
        assertTrue(resetToken.isUsed());
        verify(tokenRepository).save(resetToken);
        verify(userRepository).save(user);
        verify(refreshTokenService).revokeAllUserTokens(user);
    }

    @Test
    void shouldRejectExpiredResetToken() {
        User user = new User("student1", "John", "Doe", "john@example.com", "hash", Role.STUDENT);
        String rawToken = "expired-token";
        String tokenHash = TokenHashUtils.hashToken(rawToken);
        Instant pastExpiry = Instant.now().minus(10, ChronoUnit.MINUTES);

        PasswordResetToken resetToken = new PasswordResetToken(tokenHash, user, pastExpiry);
        when(tokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(resetToken));

        ResetPasswordRequest request = new ResetPasswordRequest(rawToken, "newPassword123");
        assertThrows(IllegalArgumentException.class, () -> resetService.resetPassword(request));
        assertFalse(resetToken.isUsed());
    }

    @Test
    void shouldRejectAlreadyUsedResetToken() {
        User user = new User("student1", "John", "Doe", "john@example.com", "hash", Role.STUDENT);
        String rawToken = "already-used-token";
        String tokenHash = TokenHashUtils.hashToken(rawToken);
        Instant futureExpiry = Instant.now().plus(15, ChronoUnit.MINUTES);

        PasswordResetToken resetToken = new PasswordResetToken(tokenHash, user, futureExpiry);
        resetToken.setUsed(true);
        when(tokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(resetToken));

        ResetPasswordRequest request = new ResetPasswordRequest(rawToken, "newPassword123");
        assertThrows(IllegalArgumentException.class, () -> resetService.resetPassword(request));
    }
}
