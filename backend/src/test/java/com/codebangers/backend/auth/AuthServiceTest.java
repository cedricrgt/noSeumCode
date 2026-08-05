package com.codebangers.backend.auth;

import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    @Test
    void shouldLoginExistingUserAndReturnToken() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        AuthService authService = new AuthService(userRepository, passwordEncoder, new JwtTokenService("codebangers-super-secret-key-change-me-in-production-2026"));

        User user = new User("teacher1", "Ada", "Lovelace", "teacher@codebangers.com", passwordEncoder.encode("secret123"), Role.TEACHER);
        when(userRepository.findByEmail("teacher@codebangers.com")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login("teacher@codebangers.com", "secret123");

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("teacher@codebangers.com", response.getEmail());
        assertEquals(Role.TEACHER.name(), response.getRole());
    }
}
