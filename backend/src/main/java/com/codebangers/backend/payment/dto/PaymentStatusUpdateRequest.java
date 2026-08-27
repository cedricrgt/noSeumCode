package com.codebangers.backend.payment.dto;

import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import jakarta.validation.constraints.NotNull;

public class PaymentStatusUpdateRequest {

    @NotNull(message = "Le statut de paiement est obligatoire")
    private PaymentStatus paymentStatus;

    private String source = "MANUAL_ADMIN"; // "MANUAL_ADMIN", "STRIPE_WEBHOOK", "PAYPAL", etc.
    private String transactionReference;
    private String note;

    public PaymentStatusUpdateRequest() {
    }

    public PaymentStatusUpdateRequest(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public PaymentStatusUpdateRequest(PaymentStatus paymentStatus, String source, String transactionReference, String note) {
        this.paymentStatus = paymentStatus;
        this.source = source;
        this.transactionReference = transactionReference;
        this.note = note;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
