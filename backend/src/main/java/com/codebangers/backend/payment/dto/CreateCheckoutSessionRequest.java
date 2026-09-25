package com.codebangers.backend.payment.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateCheckoutSessionRequest {

    @NotNull(message = "L'identifiant du cours (courseId) est obligatoire")
    private UUID courseId;

    private String successUrl;
    private String cancelUrl;

    public CreateCheckoutSessionRequest() {
    }

    public CreateCheckoutSessionRequest(UUID courseId) {
        this.courseId = courseId;
    }

    public CreateCheckoutSessionRequest(UUID courseId, String successUrl, String cancelUrl) {
        this.courseId = courseId;
        this.successUrl = successUrl;
        this.cancelUrl = cancelUrl;
    }

    public UUID getCourseId() {
        return courseId;
    }

    public void setCourseId(UUID courseId) {
        this.courseId = courseId;
    }

    public String getSuccessUrl() {
        return successUrl;
    }

    public void setSuccessUrl(String successUrl) {
        this.successUrl = successUrl;
    }

    public String getCancelUrl() {
        return cancelUrl;
    }

    public void setCancelUrl(String cancelUrl) {
        this.cancelUrl = cancelUrl;
    }
}
