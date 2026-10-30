package com.codebangers.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ForgotPasswordRequest {

    @NotBlank(message = "L'adresse email est obligatoire")
    @Email(message = "Format d'email invalide")
    @Size(max = 100, message = "L'adresse email ne doit pas dépasser 100 caractères")
    private String email;

    public ForgotPasswordRequest() {
    }

    public ForgotPasswordRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
