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
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.discord.service.DiscordService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class EnrollmentProvisioningService {

    private static final Logger log = LoggerFactory.getLogger(EnrollmentProvisioningService.class);

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final CohortRepository cohortRepository;
    private final StripeGateway stripeGateway;
    private final com.codebangers.backend.mentor.service.MentorService mentorService;
    private DiscordService discordService;

    @Autowired
    public EnrollmentProvisioningService(EnrollmentRepository enrollmentRepository,
                                         CourseRepository courseRepository,
                                         @Autowired(required = false) CohortRepository cohortRepository,
                                         StripeGateway stripeGateway,
                                         @Autowired(required = false) com.codebangers.backend.mentor.service.MentorService mentorService) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.cohortRepository = cohortRepository;
        this.stripeGateway = stripeGateway;
        this.mentorService = mentorService;
    }

    @Autowired(required = false)
    public void setDiscordService(DiscordService discordService) {
        this.discordService = discordService;
    }

    public Enrollment confirmCheckoutSession(User user, String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            throw new IllegalArgumentException("L'identifiant de session est requis.");
        }

        com.stripe.model.checkout.Session session = stripeGateway.retrieveSession(sessionId);
        if (session == null) {
            throw new ResourceNotFoundException("Session Stripe introuvable: " + sessionId);
        }

        String paymentStatus = session.getPaymentStatus();
        String status = session.getStatus();

        if (!"paid".equalsIgnoreCase(paymentStatus) && !"complete".equalsIgnoreCase(status)) {
            log.warn("Tentative de validation d'une session non payée: id={}, status={}, paymentStatus={}",
                    sessionId, status, paymentStatus);
            throw new IllegalStateException("Le paiement n'a pas été validé par Stripe.");
        }

        String sessionUserId = session.getMetadata() != null ? session.getMetadata().get("userId") : null;
        if (sessionUserId == null || !sessionUserId.equals(user.getId().toString())) {
            log.warn("Tentative d'usurpation Stripe confirm-session: sessionUserId={}, authenticatedUserId={}",
                    sessionUserId, user.getId());
            throw new org.springframework.security.access.AccessDeniedException(
                    "Cette session Stripe n'appartient pas à l'utilisateur connecté.");
        }

        String courseIdStr = session.getMetadata() != null ? session.getMetadata().get("courseId") : null;
        if (courseIdStr == null || courseIdStr.isBlank()) {
            throw new IllegalStateException("Métadonnée courseId introuvable dans la session Stripe.");
        }

        UUID courseId;
        try {
            courseId = UUID.fromString(courseIdStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("Métadonnée courseId invalide dans la session Stripe: " + courseIdStr);
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", courseId));

        String tierStr = session.getMetadata() != null ? session.getMetadata().get("tier") : null;
        EnrollmentTier tier = tierStr != null ? EnrollmentTier.fromString(tierStr) : EnrollmentTier.WEB;
        String cohortIdStr = session.getMetadata() != null ? session.getMetadata().get("cohortId") : null;
        Cohort cohort = null;
        if (cohortIdStr != null && !cohortIdStr.isBlank() && cohortRepository != null) {
            try {
                cohort = cohortRepository.findById(UUID.fromString(cohortIdStr)).orElse(null);
            } catch (Exception ignored) {}
        }

        String addon = session.getMetadata() != null ? session.getMetadata().get("addon") : null;

        List<Enrollment> existingEnrollments = enrollmentRepository.findByUserId(user.getId());
        Enrollment enrollment = existingEnrollments.stream()
                .filter(e -> e.getCourse() != null && e.getCourse().getId().equals(course.getId()))
                .findFirst()
                .orElse(null);

        EnrollmentTier previousTier = enrollment != null ? enrollment.getTier() : null;
        if (enrollment != null) {
            enrollment.setPaymentStatus(PaymentStatus.PAID);
            if (tier != null) enrollment.setTier(tier);
            if (cohort != null) enrollment.setCohort(cohort);
            enrollmentRepository.save(enrollment);
        } else {
            enrollment = new Enrollment(user, course, PaymentStatus.PAID, 0, tier, cohort);
            enrollmentRepository.save(enrollment);
        }

        if (tier == EnrollmentTier.VIP || tier == EnrollmentTier.WEB) {
            enrollInBundleCourses(user, tier, cohort, PaymentStatus.PAID);
        }

        if (mentorService != null && addon != null && !addon.isBlank()) {
            mentorService.processMentorAddonPurchase(user, cohort, addon, tier);
        }
        if (mentorService != null && previousTier == EnrollmentTier.STARTER && tier == EnrollmentTier.WEB) {
            mentorService.handleUpgradeToWebPro(user, cohort);
        }

        log.info("🎓 Inscription confirmée (synchronisation Stripe directe) pour {} sur le cours {} (Tier: {}, Cohorte: {}) -> Statut: PAID",
                user.getEmail(), course.getTitle(), tier, (cohort != null ? cohort.getName() : "Aucune"));
        syncDiscordRolesIfLinked(user, PaymentStatus.PAID);
        return enrollment;
    }

    public void enrollInBundleCourses(User user, EnrollmentTier tier, Cohort cohort, PaymentStatus status) {
        if (tier == null || user == null) return;

        List<Enrollment> existingEnrollments = enrollmentRepository.findByUserId(user.getId());

        Course c1 = courseRepository.findBySlug("pack-starter").orElse(null);
        UUID c1Id = c1 != null ? c1.getId() : null;
        Course c2 = courseRepository.findBySlug("pack-web-pro").orElse(null);
        UUID c2Id = c2 != null ? c2.getId() : null;
        Course c3 = courseRepository.findBySlug("pack-mentorat-vip").orElse(null);
        UUID c3Id = c3 != null ? c3.getId() : null;

        List<UUID> targetCourseIds = new java.util.ArrayList<>();
        if (tier == EnrollmentTier.VIP) {
            targetCourseIds.add(c3Id);
            targetCourseIds.add(c2Id);
            targetCourseIds.add(c1Id);
        } else if (tier == EnrollmentTier.WEB) {
            targetCourseIds.add(c2Id);
            targetCourseIds.add(c1Id);
        } else if (tier == EnrollmentTier.STARTER) {
            targetCourseIds.add(c1Id);
        }

        for (UUID cid : targetCourseIds) {
            Course c = courseRepository.findById(cid).orElse(null);
            if (c != null) {
                Enrollment e = existingEnrollments.stream()
                        .filter(x -> x.getCourse() != null && x.getCourse().getId().equals(cid))
                        .findFirst()
                        .orElse(null);
                if (e != null) {
                    e.setPaymentStatus(status);
                    e.setTier(tier);
                    if (cohort != null) e.setCohort(cohort);
                    enrollmentRepository.save(e);
                } else if (status != null) {
                    Enrollment ne = new Enrollment(user, c, status, 0, tier, cohort);
                    enrollmentRepository.save(ne);
                }
            }
        }
    }

    public void syncDiscordRolesIfLinked(User user, PaymentStatus status) {
        if (discordService != null && user != null && user.isDiscordLinked()) {
            try {
                discordService.syncUserRoles(user);
            } catch (Exception e) {
                log.warn("Impossible de synchroniser les rôles Discord suite au paiement pour {}: {}", user.getEmail(), e.getMessage());
            }
        }
    }
}
