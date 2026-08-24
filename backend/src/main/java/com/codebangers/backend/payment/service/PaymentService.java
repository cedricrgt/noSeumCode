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
     * Compatible avec l'administration manuelle et les webhooks Stripe automatisés.
     */
    public List<Enrollment> processPaymentStatusUpdate(UUID userId, PaymentStatusUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        log.info("💳 Mise à jour du statut de paiement pour {} ({}) -> Statut: {}, Source: {}, Ref: {}",
                user.getEmail(), userId, request.getPaymentStatus(), request.getSource(), request.getTransactionReference());

        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);

        if (enrollments.isEmpty() && (request.getPaymentStatus() == PaymentStatus.PAID || request.getPaymentStatus() == PaymentStatus.PENDING)) {
            // Si l'utilisateur n'a pas encore d'inscription, l'inscrire à la formation active principale
            List<Course> activeCourses = courseRepository.findAll().stream().filter(c -> !c.isDeleted()).toList();
            if (!activeCourses.isEmpty()) {
                Course defaultCourse = activeCourses.get(0);
                Enrollment newEnrollment = new Enrollment(user, defaultCourse, request.getPaymentStatus(), 0);
                enrollments = List.of(enrollmentRepository.save(newEnrollment));
                log.info("🎓 Inscription automatique créée pour {} sur le cours {}", user.getEmail(), defaultCourse.getTitle());
            }
        } else {
            for (Enrollment enrollment : enrollments) {
                enrollment.setPaymentStatus(request.getPaymentStatus());
                enrollmentRepository.save(enrollment);
            }
        }

        return enrollments;
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

        processPaymentStatusUpdate(user.getId(), request);
    }
}
