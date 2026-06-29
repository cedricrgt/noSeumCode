package com.codebangers.backend.user.dto;

import java.util.UUID;

public class AuthResponse {

    private UUID userId;
    private String userName;
    private String email;
    private String role;
    private String message;
    private String accessToken;

    public AuthResponse() {
    }

    public AuthResponse(UUID userId, String userName, String email, String role, String message, String accessToken) {
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.role = role;
        this.message = message;
        this.accessToken = accessToken;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}
