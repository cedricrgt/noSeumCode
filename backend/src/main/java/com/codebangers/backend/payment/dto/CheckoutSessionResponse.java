package com.codebangers.backend.payment.dto;

import java.util.UUID;

public class CheckoutSessionResponse {

    private String sessionId;
    private String sessionUrl;
    private UUID courseId;
    private Long amount;
    private String currency;

    public CheckoutSessionResponse() {
    }

    public CheckoutSessionResponse(String sessionId, String sessionUrl, UUID courseId, Long amount, String currency) {
        this.sessionId = sessionId;
        this.sessionUrl = sessionUrl;
        this.courseId = courseId;
        this.amount = amount;
        this.currency = currency;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionUrl() {
        return sessionUrl;
    }

    public void setSessionUrl(String sessionUrl) {
        this.sessionUrl = sessionUrl;
    }

    public UUID getCourseId() {
        return courseId;
    }

    public void setCourseId(UUID courseId) {
        this.courseId = courseId;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
