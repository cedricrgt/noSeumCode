package com.codebangers.backend.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;
    private final String fromEmail;
    private final String smtpHost;

    public EmailServiceImpl(
            @Autowired(required = false) JavaMailSender mailSender,
            @Value("${app.mail.from:noreply@noseumcode.fr}") String fromEmail,
            @Value("${spring.mail.host:}") String smtpHost) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
        this.smtpHost = smtpHost;
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String recipientName, String resetUrl) {
        String name = (recipientName != null && !recipientName.isBlank()) ? recipientName : "Apprenant";
        String subject = "NoSeumCode — Réinitialisation de votre mot de passe";

        String htmlContent = """
            <!DOCTYPE html>
            <html lang="fr">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Réinitialisation de votre mot de passe</title>
              <style>
                body { margin: 0; padding: 0; background-color: #070e18; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; }
                .container { max-width: 600px; margin: 40px auto; background-color: #0c1524; border: 1px solid rgba(0, 255, 135, 0.25); border-radius: 12px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #070e18, #111e33); padding: 30px 40px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
                .logo { font-size: 26px; font-weight: 800; color: #00ff87; text-decoration: none; letter-spacing: 1px; }
                .content { padding: 40px; line-height: 1.6; }
                .title { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 20px; }
                .text { font-size: 15px; color: #cbd5e0; margin-bottom: 24px; }
                .button-container { text-align: center; margin: 35px 0; }
                .btn { display: inline-block; background-color: #00ff87; color: #070e18 !important; font-weight: 700; font-size: 16px; padding: 14px 32px; border-radius: 8px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px; }
                .note { font-size: 13px; color: #94a3b8; background-color: rgba(255, 255, 255, 0.04); border-radius: 8px; padding: 14px; margin-top: 25px; border-left: 3px solid #00ff87; }
                .footer { padding: 24px 40px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid rgba(255, 255, 255, 0.05); }
                .link-fallback { word-break: break-all; color: #00d9ff; font-size: 13px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">⚡ NOSEUMCODE</div>
                </div>
                <div class="content">
                  <h1 class="title">Bonjour %s,</h1>
                  <p class="text">Une demande de réinitialisation du mot de passe associé à votre compte NoSeumCode a été effectuée.</p>
                  <p class="text">Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe sécurisé :</p>
                  
                  <div class="button-container">
                    <a href="%s" class="btn" target="_blank" rel="noopener noreferrer">Réinitialiser mon mot de passe</a>
                  </div>

                  <p class="text" style="font-size: 13px;">Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br>
                    <a href="%s" class="link-fallback">%s</a>
                  </p>

                  <div class="note">
                    🔒 Ce lien est sécurisé, à usage unique et expire dans <strong>30 minutes</strong>.<br>
                    Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité : votre compte reste protégé.
                  </div>
                </div>
                <div class="footer">
                  © 2026 NoSeumCode. Tous droits réservés.<br>
                  Plateforme d'apprentissage moderne du code.
                </div>
              </div>
            </body>
            </html>
            """.formatted(name, resetUrl, resetUrl, resetUrl);

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    @Override
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        if (mailSender == null || smtpHost == null || smtpHost.isBlank()) {
            log.info("[SIMULATION EMAIL] Vers: {}, Sujet: '{}' (SMTP non configuré ou environnement local/test).", to, subject);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email transactionnel envoyé avec succès à {}", to);
        } catch (MessagingException e) {
            log.error("Échec lors de l'envoi de l'email à {}: {}", to, e.getMessage());
        } catch (Exception e) {
            log.error("Erreur inattendue lors de l'envoi du mail à {}: {}", to, e.getMessage());
        }
    }
}
