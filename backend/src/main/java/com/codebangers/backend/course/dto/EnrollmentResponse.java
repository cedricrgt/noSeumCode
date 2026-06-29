package com.codebangers.backend.course.dto;

import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public class EnrollmentResponse {

    private UUID id;
    private UUID userId;
    private UUID courseId;
    private LocalDateTime enrolledAt;
    private PaymentStatus paymentStatus;
    private Integer progress;
    private LocalDateTime completedAt;

    public EnrollmentResponse() {
    }

    public EnrollmentResponse(UUID id, UUID userId, UUID courseId,
                            LocalDateTime enrolledAt, PaymentStatus paymentStatus,
                            Integer progress, LocalDateTime completedAt) {
        this.id = id;
        this.userId = userId;
        this.courseId = courseId;
        this.enrolledAt = enrolledAt;
        this.paymentStatus = paymentStatus;
        this.progress = progress;
        this.completedAt = completedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getCourseId() {
        return courseId;
    }

    public void setCourseId(UUID courseId) {
        this.courseId = courseId;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
