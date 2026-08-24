package com.codebangers.backend.auth;

import com.codebangers.backend.auth.dto.AuthResponse;
import com.codebangers.backend.auth.dto.LoginRequest;
import com.codebangers.backend.auth.dto.RegisterRequest;
import com.codebangers.backend.config.JwtService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    @Test
    void shouldLoginExistingUserAndReturnToken() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        JwtService jwtService = mock(JwtService.class);
        AuthService authService = new AuthService(userRepository, passwordEncoder, jwtService);

        User user = new User("teacher1", "Ada", "Lovelace", "teacher@codebangers.com", passwordEncoder.encode("secret123"), Role.TEACHER);
        user.setId(UUID.randomUUID());
        when(userRepository.findByEmail("teacher@codebangers.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("mocked.jwt.token");

        LoginRequest loginRequest = new LoginRequest("teacher@codebangers.com", "secret123");
        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getAccessToken());
        assertEquals("teacher@codebangers.com", response.getEmail());
        assertEquals(Role.TEACHER.name(), response.getRole());
    }

    @Test
    void shouldRegisterNewUserAndReturnToken() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        JwtService jwtService = mock(JwtService.class);
        AuthService authService = new AuthService(userRepository, passwordEncoder, jwtService);

        when(userRepository.findByEmail("student@codebangers.com")).thenReturn(Optional.empty());
        when(userRepository.findByUserName("student1")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });
        when(jwtService.generateToken(any(User.class))).thenReturn("mocked.jwt.token");

        RegisterRequest registerRequest = new RegisterRequest("student1", "John", "Doe", "student@codebangers.com", "password123", Role.STUDENT);
        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getAccessToken());
        assertEquals("student@codebangers.com", response.getEmail());
        assertEquals(Role.STUDENT.name(), response.getRole());
    }

    @Test
    void shouldRejectBlockedUser() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        JwtService jwtService = mock(JwtService.class);
        AuthService authService = new AuthService(userRepository, passwordEncoder, jwtService);

        User user = new User("blocked1", "Blocked", "User", "blocked@codebangers.com", passwordEncoder.encode("secret123"), Role.STUDENT);
        user.setBlocked(true);
        when(userRepository.findByEmail("blocked@codebangers.com")).thenReturn(Optional.of(user));

        LoginRequest loginRequest = new LoginRequest("blocked@codebangers.com", "secret123");
        assertThrows(IllegalArgumentException.class, () -> authService.login(loginRequest));
    }
}
