package com.codebangers.backend.auth;

import com.codebangers.backend.auth.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    private AuthService authService;
    private AuthController authController;

    @BeforeEach
    void setUp() {
        authService = mock(AuthService.class);
        authController = new AuthController(authService);
    }

    @Test
    void shouldReturn200OnForgotPasswordAlways() {
        ForgotPasswordRequest request = new ForgotPasswordRequest("unknown@example.com");

        ResponseEntity<?> response = authController.forgotPassword(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(authService).forgotPassword(request);
        assertNotNull(response.getBody());
    }

    @Test
    void shouldReturn200OnResetPasswordSuccess() {
        ResetPasswordRequest request = new ResetPasswordRequest("token-123", "newPassword123!");

        ResponseEntity<?> response = authController.resetPassword(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(authService).resetPassword(request);
    }

    @Test
    void shouldReturn400OnResetPasswordError() {
        ResetPasswordRequest request = new ResetPasswordRequest("invalid-token", "newPassword123!");
        doThrow(new IllegalArgumentException("Lien expiré")).when(authService).resetPassword(request);

        ResponseEntity<?> response = authController.resetPassword(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(Map.of("message", "Lien expiré"), response.getBody());
    }

    @Test
    void shouldReturn200OnRefreshTokenSuccess() {
        RefreshTokenRequest request = new RefreshTokenRequest("valid-refresh-token");
        AuthResponse authResponse = new AuthResponse();
        authResponse.setAccessToken("new-access");
        when(authService.refreshToken(request)).thenReturn(authResponse);

        ResponseEntity<?> response = authController.refreshToken(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(authResponse, response.getBody());
    }

    @Test
    void shouldReturn401OnRefreshTokenError() {
        RefreshTokenRequest request = new RefreshTokenRequest("expired-refresh-token");
        when(authService.refreshToken(request)).thenThrow(new IllegalArgumentException("Session expirée"));

        ResponseEntity<?> response = authController.refreshToken(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void shouldReturn200OnLogout() {
        RefreshTokenRequest request = new RefreshTokenRequest("some-token");

        ResponseEntity<?> response = authController.logout(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(authService).logout(request);
    }
}
