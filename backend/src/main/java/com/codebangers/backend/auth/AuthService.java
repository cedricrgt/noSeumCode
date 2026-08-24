package com.codebangers.backend.auth;

import com.codebangers.backend.auth.dto.AuthResponse;
import com.codebangers.backend.auth.dto.LoginRequest;
import com.codebangers.backend.auth.dto.RegisterRequest;
import com.codebangers.backend.config.JwtService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
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

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
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
        return mapToAuthResponse(user, "Connexion réussie", token);
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

        return mapToAuthResponse(savedUser, "Compte créé avec succès", token);
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        String token = jwtService.generateToken(user);
        return mapToAuthResponse(user, "Profil récupéré", token);
    }

    private AuthResponse mapToAuthResponse(User user, String message, String token) {
        return new AuthResponse(
                user.getId(),
                user.getUserName(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name(),
                user.getAvatarUrl(),
                message,
                token
        );
    }
}
