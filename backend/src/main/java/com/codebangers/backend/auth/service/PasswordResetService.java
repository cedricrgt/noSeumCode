package com.codebangers.backend.auth.service;

import com.codebangers.backend.auth.dto.ResetPasswordRequest;
import com.codebangers.backend.auth.model.PasswordResetToken;
import com.codebangers.backend.auth.repository.PasswordResetTokenRepository;
import com.codebangers.backend.auth.security.TokenHashUtils;
import com.codebangers.backend.email.EmailService;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@Transactional
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;
    private final String resetPasswordBaseUrl;
    private final long tokenValidityMinutes;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            RefreshTokenService refreshTokenService,
            @Value("${app.frontend.reset-password-url:https://noseumcode.fr/reset-password.html}") String resetPasswordBaseUrl,
            @Value("${app.security.password-reset-validity-minutes:30}") long tokenValidityMinutes) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.refreshTokenService = refreshTokenService;
        this.resetPasswordBaseUrl = resetPasswordBaseUrl;
        this.tokenValidityMinutes = tokenValidityMinutes;
    }

    public void initiatePasswordReset(String email) {
        if (email == null || email.isBlank()) {
            return;
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim().toLowerCase());
        if (userOpt.isEmpty()) {
            // OWASP: Ne pas divulguer si l'email existe ou non
            log.debug("Demande de réinitialisation pour email inexistant: {}", email);
            return;
        }

        User user = userOpt.get();
        if (user.isDeleted() || user.isBlocked()) {
            log.warn("Demande de réinitialisation pour compte bloqué ou supprimé: {}", email);
            return;
        }

        // Nettoyer les anciens tokens non utilisés de cet utilisateur
        passwordResetTokenRepository.deleteByUser(user);

        // Générer un jeton cryptographique sécurisé
        String rawToken = TokenHashUtils.generateSecureRandomToken(32);
        String tokenHash = TokenHashUtils.hashToken(rawToken);

        Instant expiryDate = Instant.now().plus(tokenValidityMinutes, ChronoUnit.MINUTES);
        PasswordResetToken resetToken = new PasswordResetToken(tokenHash, user, expiryDate);
        passwordResetTokenRepository.save(resetToken);

        // Construire l'URL de réinitialisation
        String delimiter = resetPasswordBaseUrl.contains("?") ? "&" : "?";
        String resetUrl = resetPasswordBaseUrl + delimiter + "token=" + rawToken;

        // Envoyer l'email
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetUrl);
        log.info("Lien de réinitialisation généré et envoyé pour l'utilisateur: {}", user.getEmail());
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (request == null || request.getToken() == null || request.getToken().isBlank()) {
            throw new IllegalArgumentException("Le jeton de réinitialisation est requis");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 8) {
            throw new IllegalArgumentException("Le nouveau mot de passe doit comporter au moins 8 caractères");
        }

        String tokenHash = TokenHashUtils.hashToken(request.getToken().trim());
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Ce lien de réinitialisation est invalide ou a expiré"));

        if (resetToken.isUsed() || resetToken.isExpired()) {
            throw new IllegalArgumentException("Ce lien de réinitialisation a déjà été utilisé ou a expiré");
        }

        User user = resetToken.getUser();
        if (user.isDeleted() || user.isBlocked()) {
            throw new IllegalArgumentException("Ce compte est inaccessible");
        }

        // Mettre à jour le mot de passe hashé
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Marquer le jeton comme utilisé
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Révoquer tous les refresh tokens pour forcer une ré-authentification sécurisée
        refreshTokenService.revokeAllUserTokens(user);

        log.info("Mot de passe réinitialisé avec succès pour l'utilisateur: {}", user.getEmail());
    }
}
