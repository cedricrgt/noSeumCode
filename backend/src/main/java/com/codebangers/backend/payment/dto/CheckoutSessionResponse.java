package com.codebangers.backend.payment.dto;

import java.util.UUID;

public class CheckoutSessionResponse {

    private String sessionId;
    private String sessionUrl;
    private UUID courseId;
    private Long amount;
    private String currency;
    private String clientSecret;
    private String publishableKey;

    public CheckoutSessionResponse() {
    }

    public CheckoutSessionResponse(String sessionId, String sessionUrl, UUID courseId, Long amount, String currency) {
        this(sessionId, sessionUrl, courseId, amount, currency, null, null);
    }

    public CheckoutSessionResponse(String sessionId, String sessionUrl, UUID courseId, Long amount, String currency, String clientSecret, String publishableKey) {
        this.sessionId = sessionId;
        this.sessionUrl = sessionUrl;
        this.courseId = courseId;
        this.amount = amount;
        this.currency = currency;
        this.clientSecret = clientSecret;
        this.publishableKey = publishableKey;
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

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getPublishableKey() {
        return publishableKey;
    }

    public void setPublishableKey(String publishableKey) {
        this.publishableKey = publishableKey;
    }
}
