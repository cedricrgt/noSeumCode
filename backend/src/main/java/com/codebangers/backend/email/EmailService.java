package com.codebangers.backend.email;

public interface EmailService {

    void sendPasswordResetEmail(String toEmail, String recipientName, String resetUrl);

    void sendHtmlEmail(String to, String subject, String htmlContent);
}
