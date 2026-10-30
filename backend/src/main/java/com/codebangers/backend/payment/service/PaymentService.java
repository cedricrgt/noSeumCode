package com.codebangers.backend.payment.service;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.payment.dto.PaymentStatusUpdateRequest;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public PaymentService(UserRepository userRepository,
                          EnrollmentRepository enrollmentRepository,
                          CourseRepository courseRepository) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * Point d'entrée universel pour mettre à jour le statut de paiement d'un utilisateur.
     * Compatible avec l'administration manuelle (par UUID ou Email) et les webhooks Stripe automatisés.
     */
    public List<Enrollment> processPaymentStatusUpdate(String userIdentifier, PaymentStatusUpdateRequest request) {
        User user = null;
        try {
            UUID id = UUID.fromString(userIdentifier);
            user = userRepository.findById(id).orElse(null);
        } catch (IllegalArgumentException ignored) {}

        if (user == null) {
            user = userRepository.findByEmail(userIdentifier)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with identifier: " + userIdentifier));
        }

        UUID userId = user.getId();

        log.info("💳 Mise à jour du statut de paiement pour {} ({}) -> Statut: {}, Source: {}, Ref: {}",
                user.getEmail(), userId, request.getPaymentStatus(), request.getSource(), request.getTransactionReference());

        List<Course> activeCourses = courseRepository.findAll().stream().filter(c -> !c.isDeleted()).toList();
        List<Enrollment> existingEnrollments = enrollmentRepository.findByUserId(userId);

        for (Course course : activeCourses) {
            Enrollment enrollment = existingEnrollments.stream()
                    .filter(e -> e.getCourse() != null && e.getCourse().getId().equals(course.getId()))
                    .findFirst()
                    .orElse(null);

            if (enrollment != null) {
                enrollment.setPaymentStatus(request.getPaymentStatus());
                enrollmentRepository.save(enrollment);
            } else if (request.getPaymentStatus() != null) {
                Enrollment newEnrollment = new Enrollment(user, course, request.getPaymentStatus(), 0);
                enrollmentRepository.save(newEnrollment);
                log.info("🎓 Inscription créée pour {} sur le cours {} avec statut {}", user.getEmail(), course.getTitle(), request.getPaymentStatus());
            }
        }

        return enrollmentRepository.findByUserId(userId);
    }

    /**
     * Traitement automatisé d'un événement de paiement Stripe Webhook (par email).
     */
    public void processStripeWebhookEvent(String customerEmail, String stripeEventType, String transactionId) {
        User user = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + customerEmail));

        PaymentStatus status;
        switch (stripeEventType) {
            case "checkout.session.completed", "invoice.payment_succeeded", "payment_intent.succeeded":
                status = PaymentStatus.PAID;
                break;
            case "charge.refunded":
                status = PaymentStatus.REFUNDED;
                break;
            case "invoice.payment_failed", "payment_intent.payment_failed":
                status = PaymentStatus.FAILED;
                break;
            default:
                status = PaymentStatus.PENDING;
                break;
        }

        PaymentStatusUpdateRequest request = new PaymentStatusUpdateRequest(
                status,
                "STRIPE_WEBHOOK",
                transactionId,
                "Événement Stripe automatique : " + stripeEventType
        );

        processPaymentStatusUpdate(user.getId().toString(), request);
    }
}
