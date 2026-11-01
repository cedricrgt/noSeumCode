package com.codebangers.backend.auth;

import com.codebangers.backend.auth.dto.*;
import com.codebangers.backend.auth.service.PasswordResetService;
import com.codebangers.backend.auth.service.RefreshTokenService;
import com.codebangers.backend.config.JwtService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetService passwordResetService;
    private final long jwtExpiryHours;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this(userRepository, passwordEncoder, jwtService, null, null, 1);
    }

    @Autowired
    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Autowired(required = false) RefreshTokenService refreshTokenService,
            @Autowired(required = false) PasswordResetService passwordResetService,
            @Value("${app.security.jwt-expiry-hours:1}") long jwtExpiryHours) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.passwordResetService = passwordResetService;
        this.jwtExpiryHours = jwtExpiryHours;
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Identifiants incorrects");
        }

        User user = userOpt.get();

        if (user.isDeleted()) {
            throw new IllegalArgumentException("Ce compte a été supprimé");
        }

        if (user.isBlocked()) {
            throw new IllegalArgumentException("Ce compte est bloqué");
        }

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Identifiants incorrects");
        }

        String token = jwtService.generateToken(user);
        String refreshToken = (refreshTokenService != null) ? refreshTokenService.createRefreshToken(user) : null;
        return mapToAuthResponse(user, "Connexion réussie", token, refreshToken);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Cet email est déjà utilisé");
        }

        if (userRepository.findByUserName(request.getUserName()).isPresent()) {
            throw new IllegalArgumentException("Ce nom d'utilisateur est déjà pris");
        }

        Role role = Role.STUDENT;

        User user = new User(
                request.getUserName(),
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role
        );
        user.setProvider("LOCAL");

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);
        String refreshToken = (refreshTokenService != null) ? refreshTokenService.createRefreshToken(savedUser) : null;

        return mapToAuthResponse(savedUser, "Compte créé avec succès", token, refreshToken);
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        String token = jwtService.generateToken(user);
        return mapToAuthResponse(user, "Profil récupéré", token, null);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (refreshTokenService == null) {
            throw new IllegalStateException("Service de rafraîchissement non disponible");
        }
        return refreshTokenService.rotateRefreshToken(request.getRefreshToken());
    }

    public void logout(RefreshTokenRequest request) {
        if (refreshTokenService != null && request != null && request.getRefreshToken() != null) {
            refreshTokenService.revokeToken(request.getRefreshToken());
        }
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        if (passwordResetService != null && request != null) {
            passwordResetService.initiatePasswordReset(request.getEmail());
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (passwordResetService == null) {
            throw new IllegalStateException("Service de réinitialisation non disponible");
        }
        passwordResetService.resetPassword(request);
    }

    private AuthResponse mapToAuthResponse(User user, String message, String token, String refreshToken) {
        long expiresIn = jwtExpiryHours * 3600L;
        return new AuthResponse(
                user.getId(),
                user.getUserName(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name(),
                user.getAvatarUrl(),
                message,
                token,
                refreshToken,
                expiresIn
        );
    }
}
