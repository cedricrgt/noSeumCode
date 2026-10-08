package com.codebangers.backend.payment.service;

import com.codebangers.backend.cohort.model.Cohort;
import com.codebangers.backend.cohort.repository.CohortRepository;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.model.EnrollmentTier;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.payment.dto.PaymentStatusUpdateRequest;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class StripeEventService {

    private static final Logger log = LoggerFactory.getLogger(StripeEventService.class);

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final CohortRepository cohortRepository;
    private final com.codebangers.backend.mentor.service.MentorService mentorService;
    private final EnrollmentProvisioningService enrollmentProvisioningService;
    private final PaymentStatusService paymentStatusService;

    @Autowired
    public StripeEventService(UserRepository userRepository,
                              EnrollmentRepository enrollmentRepository,
                              CourseRepository courseRepository,
                              @Autowired(required = false) CohortRepository cohortRepository,
                              @Autowired(required = false) com.codebangers.backend.mentor.service.MentorService mentorService,
                              EnrollmentProvisioningService enrollmentProvisioningService,
                              PaymentStatusService paymentStatusService) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.cohortRepository = cohortRepository;
        this.mentorService = mentorService;
        this.enrollmentProvisioningService = enrollmentProvisioningService;
        this.paymentStatusService = paymentStatusService;
    }

    public void processStripeWebhookEvent(String customerEmail, String stripeEventType, String transactionId) {
        processStripeWebhookEvent(customerEmail, stripeEventType, transactionId, null, null);
    }

    public void processStripeWebhookEvent(String customerEmail, String stripeEventType, String transactionId, String courseIdStr, String userIdStr) {
        processStripeWebhookEvent(customerEmail, stripeEventType, transactionId, courseIdStr, userIdStr, null, null, null);
    }

    public void processStripeWebhookEvent(String customerEmail, String stripeEventType, String transactionId,
                                          String courseIdStr, String userIdStr, String tierStr, String cohortIdStr, String addon) {
        User user = null;
        if (userIdStr != null && !userIdStr.isBlank()) {
            try {
                user = userRepository.findById(UUID.fromString(userIdStr)).orElse(null);
            } catch (IllegalArgumentException ignored) {}
        }
        if (user == null && customerEmail != null && !customerEmail.isBlank()) {
            user = userRepository.findByEmail(customerEmail).orElse(null);
        }

        if (user == null) {
            log.error("Impossible de traiter l'événement Stripe: aucun utilisateur trouvé pour email={} ou userId={}", customerEmail, userIdStr);
            throw new ResourceNotFoundException("User not found for Stripe webhook event");
        }

        PaymentStatus status;
        switch (stripeEventType) {
            case "checkout.session.completed":
            case "invoice.payment_succeeded":
            case "payment_intent.succeeded":
                status = PaymentStatus.PAID;
                break;
            case "charge.refunded":
                status = PaymentStatus.REFUNDED;
                break;
            case "invoice.payment_failed":
            case "payment_intent.payment_failed":
                status = PaymentStatus.FAILED;
                break;
            default:
                log.info("Stripe event ignored: {}", stripeEventType);
                return;
        }

        EnrollmentTier tier = tierStr != null ? EnrollmentTier.fromString(tierStr) : EnrollmentTier.WEB;
        Cohort cohort = null;
        if (cohortIdStr != null && !cohortIdStr.isBlank() && cohortRepository != null) {
            try {
                cohort = cohortRepository.findById(UUID.fromString(cohortIdStr)).orElse(null);
            } catch (Exception ignored) {}
        }

        if (courseIdStr != null && !courseIdStr.isBlank()) {
            try {
                UUID courseId = UUID.fromString(courseIdStr);
                Course course = courseRepository.findById(courseId).orElse(null);
                if (course != null) {
                    List<Enrollment> existingEnrollments = enrollmentRepository.findByUserId(user.getId());
                    Enrollment enrollment = existingEnrollments.stream()
                            .filter(e -> e.getCourse() != null && e.getCourse().getId().equals(course.getId()))
                            .findFirst()
                            .orElse(null);

                    EnrollmentTier previousTier = enrollment != null ? enrollment.getTier() : null;
                    if (enrollment != null) {
                        enrollment.setPaymentStatus(status);
                        if (tier != null) enrollment.setTier(tier);
                        if (cohort != null) enrollment.setCohort(cohort);
                        enrollmentRepository.save(enrollment);
                    } else if (status != null) {
                        Enrollment newEnrollment = new Enrollment(user, course, status, 0, tier, cohort);
                        enrollmentRepository.save(newEnrollment);
                    }

                    if (tier == EnrollmentTier.VIP || tier == EnrollmentTier.WEB) {
                        enrollmentProvisioningService.enrollInBundleCourses(user, tier, cohort, status);
                    }

                    if (status == PaymentStatus.PAID && mentorService != null && addon != null && !addon.isBlank()) {
                        mentorService.processMentorAddonPurchase(user, cohort, addon, tier);
                    }
                    if (status == PaymentStatus.PAID && mentorService != null && previousTier == EnrollmentTier.STARTER && tier == EnrollmentTier.WEB) {
                        mentorService.handleUpgradeToWebPro(user, cohort);
                    }

                    log.info("🎓 Inscription mise à jour suite à webhook Stripe pour {} sur le cours {} (Tier: {}, Cohorte: {}) -> Statut: {}",
                            user.getEmail(), course.getTitle(), tier, (cohort != null ? cohort.getName() : "Aucune"), status);
                    enrollmentProvisioningService.syncDiscordRolesIfLinked(user, status);
                    return;
                }
            } catch (IllegalArgumentException e) {
                log.warn("Identifiant de cours invalide dans metadata Stripe: {}", courseIdStr);
            }
        }

        PaymentStatusUpdateRequest request = new PaymentStatusUpdateRequest(
                status,
                "STRIPE_WEBHOOK",
                transactionId,
                "Événement Stripe automatique : " + stripeEventType
        );
        paymentStatusService.processPaymentStatusUpdate(user.getId().toString(), request);
    }
}
