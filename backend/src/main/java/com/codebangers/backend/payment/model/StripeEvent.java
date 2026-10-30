package com.codebangers.backend.payment.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stripe_event")
public class StripeEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stripe_event_id", nullable = false, unique = true)
    private String stripeEventId;

    @Column(nullable = false)
    private String type;

    @Column(name = "processed_at", nullable = false)
    private LocalDateTime processedAt;

    public StripeEvent() {
    }

    public StripeEvent(String stripeEventId, String type, LocalDateTime processedAt) {
        this.stripeEventId = stripeEventId;
        this.type = type;
        this.processedAt = processedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStripeEventId() {
        return stripeEventId;
    }

    public void setStripeEventId(String stripeEventId) {
        this.stripeEventId = stripeEventId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
}
