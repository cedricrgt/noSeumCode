package com.codebangers.backend.auth;

<<<<<<< HEAD
import com.codebangers.backend.auth.dto.*;
=======
import com.codebangers.backend.auth.dto.AuthResponse;
import com.codebangers.backend.auth.dto.LoginRequest;
import com.codebangers.backend.auth.dto.RegisterRequest;
>>>>>>> main
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

<<<<<<< HEAD
import java.util.Map;

=======
>>>>>>> main
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
<<<<<<< HEAD
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
=======
            return ResponseEntity.badRequest().body(e.getMessage());
>>>>>>> main
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
<<<<<<< HEAD
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            AuthResponse response = authService.refreshToken(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        if (request != null) {
            authService.logout(request);
        }
        return ResponseEntity.ok(Map.of("message", "Déconnexion réussie"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        // OWASP: Always return 200 OK with same generic message to prevent email enumeration
        return ResponseEntity.ok(Map.of(
                "message", "Si cette adresse email est associée à un compte, un lien de réinitialisation vous a été envoyé."
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok(Map.of("message", "Votre mot de passe a été réinitialisé avec succès."));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
=======
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
>>>>>>> main
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
<<<<<<< HEAD
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Non authentifié"));
=======
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Non authentifié");
>>>>>>> main
        }
        try {
            String email = jwt.getSubject();
            AuthResponse response = authService.getCurrentUserProfile(email);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
<<<<<<< HEAD
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
=======
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
>>>>>>> main
        }
    }
}
