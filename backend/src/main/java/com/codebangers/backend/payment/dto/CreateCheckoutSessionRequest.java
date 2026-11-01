package com.codebangers.backend.payment.dto;

import com.codebangers.backend.course.model.EnrollmentTier;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateCheckoutSessionRequest {

    @NotNull(message = "L'identifiant du cours (courseId) est obligatoire")
    private UUID courseId;

    private EnrollmentTier tier;
    private UUID cohortId;
    private String addon;

    private String successUrl;
    private String cancelUrl;
    private Boolean embedded = true;
    private String returnUrl;

    public CreateCheckoutSessionRequest() {
    }

    public CreateCheckoutSessionRequest(UUID courseId) {
        this.courseId = courseId;
    }

    public CreateCheckoutSessionRequest(UUID courseId, String successUrl, String cancelUrl) {
        this.courseId = courseId;
        this.successUrl = successUrl;
        this.cancelUrl = cancelUrl;
        this.embedded = true;
    }

    public CreateCheckoutSessionRequest(UUID courseId, String successUrl, String cancelUrl, Boolean embedded, String returnUrl) {
        this.courseId = courseId;
        this.successUrl = successUrl;
        this.cancelUrl = cancelUrl;
        this.embedded = embedded != null ? embedded : true;
        this.returnUrl = returnUrl;
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

    public Boolean getEmbedded() {
        return embedded;
    }

    public void setEmbedded(Boolean embedded) {
        this.embedded = embedded;
    }

    public String getReturnUrl() {
        return returnUrl;
    }

    public void setReturnUrl(String returnUrl) {
        this.returnUrl = returnUrl;
    }

    public EnrollmentTier getTier() {
        return tier;
    }

    public void setTier(EnrollmentTier tier) {
        this.tier = tier;
    }

    public UUID getCohortId() {
        return cohortId;
    }

    public void setCohortId(UUID cohortId) {
        this.cohortId = cohortId;
    }

    public String getAddon() {
        return addon;
    }

    public void setAddon(String addon) {
        this.addon = addon;
    }
}
