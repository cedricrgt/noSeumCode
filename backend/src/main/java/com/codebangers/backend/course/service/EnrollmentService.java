package com.codebangers.backend.course.service;

import com.codebangers.backend.cohort.model.Cohort;
import com.codebangers.backend.config.exception.DuplicateResourceException;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.CourseTier;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.model.EnrollmentTier;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final com.codebangers.backend.payment.service.EnrollmentProvisioningService enrollmentProvisioningService;
    private com.codebangers.backend.discord.service.DiscordService discordService;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                           CourseRepository courseRepository,
                           UserRepository userRepository) {
        this(enrollmentRepository, courseRepository, userRepository, null, null);
    }

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                           CourseRepository courseRepository,
                           UserRepository userRepository,
                           com.codebangers.backend.payment.service.EnrollmentProvisioningService enrollmentProvisioningService) {
        this(enrollmentRepository, courseRepository, userRepository, enrollmentProvisioningService, null);
    }

    @org.springframework.beans.factory.annotation.Autowired
    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                           CourseRepository courseRepository,
                           UserRepository userRepository,
                           @org.springframework.beans.factory.annotation.Autowired(required = false) com.codebangers.backend.payment.service.EnrollmentProvisioningService enrollmentProvisioningService,
                           @org.springframework.beans.factory.annotation.Autowired(required = false) com.codebangers.backend.discord.service.DiscordService discordService) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentProvisioningService = enrollmentProvisioningService;
        this.discordService = discordService;
    }

    private void syncDiscordRolesIfLinked(User user) {
        if (discordService != null && user != null && user.isDiscordLinked()) {
            try {
                discordService.syncUserRoles(user);
            } catch (Exception e) {
                // Silently handle Discord sync error to avoid breaking database transaction
            }
        }
    }

    @Transactional(readOnly = true)
    public Optional<Enrollment> getEnrollmentById(UUID id) {
        return enrollmentRepository.findByIdWithAssociations(id);
    }

    @Transactional(readOnly = true)
    public Optional<Enrollment> getEnrollmentByUserAndCourse(UUID userId, UUID courseId) {
        return enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
    }

    @Transactional(readOnly = true)
    public List<Enrollment> getEnrollmentsByCourse(UUID courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    @Transactional(readOnly = true)
    public List<Enrollment> getEnrollmentsByUser(UUID userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    /**
     * Vérifie si un utilisateur dispose des droits d'accès complets/payants à un cours (ADR-013).
     * Les rôles ADMIN et TEACHER disposent d'un accès universel sans restriction.
     * Pour les autres utilisateurs (STUDENT, GUEST) :
     * - Une inscription avec statut 'PAID' est strictement requise.
     * - Le niveau de souscription de l'élève (STARTER, WEB, VIP) doit satisfaire le niveau requis par le cours (Course.requiredTier).
     * - Les élèves STARTER ont un accès à vie garanti aux replays du tronc commun (STARTER).
     * - Les modules avancés (WEB / VIP) sont strictement verrouillés pour les élèves STARTER.
     */
    @Transactional(readOnly = true)
    public boolean hasPaidAccess(User user, UUID courseId) {
        if (user == null || courseId == null) {
            return false;
        }
        if (user.getRole() == com.codebangers.backend.user.model.Role.ADMIN ||
            user.getRole() == com.codebangers.backend.user.model.Role.TEACHER) {
            return true;
        }

        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            return false;
        }

        CourseTier requiredTier = course.getRequiredTier() != null ? course.getRequiredTier() : CourseTier.STARTER;

        // 1. Vérification de l'inscription directe pour ce cours
        Optional<Enrollment> directEnrollment = enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId);
        if (directEnrollment.isPresent()) {
            Enrollment e = directEnrollment.get();
            // Si l'inscription directe est explicitement non payée (FAILED, REFUNDED, PENDING) -> accès refusé
            if (e.getPaymentStatus() != PaymentStatus.PAID) {
                return false;
            }
            EnrollmentTier userTier = e.getTier() != null ? e.getTier() : EnrollmentTier.WEB;
            return userTier.canAccess(requiredTier);
        }

        // 2. Si aucune inscription directe, vérifier si une autre inscription active d'un tier suffisant existe (Pack global)
        List<Enrollment> paidEnrollments = enrollmentRepository.findByUserId(user.getId()).stream()
                .filter(e -> e.getPaymentStatus() == PaymentStatus.PAID)
                .toList();

        for (Enrollment paidEnrollment : paidEnrollments) {
            EnrollmentTier tier = paidEnrollment.getTier() != null ? paidEnrollment.getTier() : EnrollmentTier.WEB;
            if (tier.canAccess(requiredTier)) {
                return true;
            }
        }

        return false;
    }

    public Enrollment enrollUserInCourse(User user, UUID courseId) {
        return enrollUserInCourse(user, courseId, EnrollmentTier.WEB, null);
    }

    public Enrollment enrollUserInCourse(User user, UUID courseId, EnrollmentTier tier, Cohort cohort) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course", courseId));

        Optional<Enrollment> existing = enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId);
        if (existing.isPresent()) {
            throw new DuplicateResourceException("User already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment(user, course, PaymentStatus.PENDING, 0, tier, cohort);
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updatePaymentStatus(UUID enrollmentId, PaymentStatus status) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Enrollment", enrollmentId));

        EnrollmentTier oldTier = enrollment.getTier();
        enrollment.setPaymentStatus(status);
        Enrollment saved = enrollmentRepository.save(enrollment);

        if (status == PaymentStatus.FAILED || status == PaymentStatus.REFUNDED) {
            if (oldTier != null && (oldTier == EnrollmentTier.VIP || oldTier == EnrollmentTier.WEB)) {
                List<Enrollment> userEnrollments = enrollmentRepository.findByUserId(saved.getUser().getId());
                for (Enrollment other : userEnrollments) {
                    if (!other.getId().equals(saved.getId()) && other.getTier() == oldTier) {
                        other.setPaymentStatus(status);
                        enrollmentRepository.save(other);
                    }
                }
            }
        } else if (status == PaymentStatus.PAID) {
            enrollInBundleCourses(saved.getUser(), oldTier, saved.getCohort(), status);
        }

        syncDiscordRolesIfLinked(saved.getUser());
        return saved;
    }

    public Enrollment setCoursePaymentStatusForUser(UUID userId, UUID courseId, PaymentStatus status) {
        return setCoursePaymentStatusForUser(userId, courseId, status, EnrollmentTier.WEB, null);
    }

    public Enrollment setCoursePaymentStatusForUser(UUID userId, UUID courseId, PaymentStatus status, EnrollmentTier tier, Cohort cohort) {
        Optional<Enrollment> existing = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        Enrollment saved;
        EnrollmentTier effectiveTier = tier != null ? tier : (existing.map(Enrollment::getTier).orElse(EnrollmentTier.WEB));

        // Auto-detect tier from courseId via slug if not explicitly specified
        Course c3 = courseRepository.findBySlug("pack-mentorat-vip").orElse(null);
        Course c2 = courseRepository.findBySlug("pack-web-pro").orElse(null);
        if (c3 != null && courseId.equals(c3.getId())) {
            effectiveTier = EnrollmentTier.VIP;
        } else if (c2 != null && courseId.equals(c2.getId()) && effectiveTier != EnrollmentTier.VIP) {
            effectiveTier = EnrollmentTier.WEB;
        }

        if (existing.isPresent()) {
            Enrollment enrollment = existing.get();
            EnrollmentTier oldTier = enrollment.getTier();
            enrollment.setPaymentStatus(status);
            enrollment.setTier(effectiveTier);
            if (cohort != null) {
                enrollment.setCohort(cohort);
            }
            saved = enrollmentRepository.save(enrollment);

            if (status == PaymentStatus.FAILED || status == PaymentStatus.REFUNDED) {
                List<Enrollment> userEnrollments = enrollmentRepository.findByUserId(userId);
                for (Enrollment other : userEnrollments) {
                    if (!other.getId().equals(saved.getId()) && oldTier != null && other.getTier() == oldTier) {
                        other.setPaymentStatus(status);
                        enrollmentRepository.save(other);
                    }
                }
            } else if (status == PaymentStatus.PAID) {
                enrollInBundleCourses(saved.getUser(), effectiveTier, cohort, status);
            }
        } else {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", courseId));
            Enrollment newEnrollment = new Enrollment(user, course, status, 0, effectiveTier, cohort);
            saved = enrollmentRepository.save(newEnrollment);

            if (status == PaymentStatus.PAID) {
                enrollInBundleCourses(user, effectiveTier, cohort, status);
            }
        }
        syncDiscordRolesIfLinked(saved.getUser());
        return saved;
    }

    private void enrollInBundleCourses(User user, EnrollmentTier tier, Cohort cohort, PaymentStatus status) {
        if (enrollmentProvisioningService != null) {
            enrollmentProvisioningService.enrollInBundleCourses(user, tier, cohort, status);
            return;
        }
        if (tier == null || user == null) return;
        Course c1 = courseRepository.findBySlug("pack-starter").orElse(null);
        UUID c1Id = c1 != null ? c1.getId() : null;
        Course c2 = courseRepository.findBySlug("pack-web-pro").orElse(null);
        UUID c2Id = c2 != null ? c2.getId() : null;
        Course c3 = courseRepository.findBySlug("pack-mentorat-vip").orElse(null);
        UUID c3Id = c3 != null ? c3.getId() : null;

        List<UUID> targetCourseIds = new java.util.ArrayList<>();
        if (tier == EnrollmentTier.VIP) {
            if (c3Id != null) targetCourseIds.add(c3Id);
            if (c2Id != null) targetCourseIds.add(c2Id);
            if (c1Id != null) targetCourseIds.add(c1Id);
        } else if (tier == EnrollmentTier.WEB) {
            if (c2Id != null) targetCourseIds.add(c2Id);
            if (c1Id != null) targetCourseIds.add(c1Id);
        } else if (tier == EnrollmentTier.STARTER) {
            if (c1Id != null) targetCourseIds.add(c1Id);
        }

        List<Enrollment> existingEnrollments = enrollmentRepository.findByUserId(user.getId());
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

    public Enrollment updateProgress(UUID enrollmentId, UUID authenticatedUserId, Integer progress) {
        if (progress == null || progress < 0 || progress > 100) {
            throw new IllegalArgumentException("La progression doit être comprise entre 0 et 100");
        }
        User user = userRepository.findById(authenticatedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", authenticatedUserId));

        Enrollment enrollment;
        if (user.getRole() == com.codebangers.backend.user.model.Role.ADMIN) {
            enrollment = enrollmentRepository.findById(enrollmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Enrollment", enrollmentId));
        } else {
            enrollment = enrollmentRepository.findByIdAndUserId(enrollmentId, authenticatedUserId)
                    .orElseThrow(() -> {
                        if (enrollmentRepository.existsById(enrollmentId)) {
                            throw new org.springframework.security.access.AccessDeniedException(
                                    "Vous ne pouvez pas modifier la progression d'une inscription appartenant à un autre utilisateur.");
                        }
                        return new ResourceNotFoundException("Enrollment", enrollmentId);
                    });
        }

        enrollment.setProgress(progress);
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updateProgress(UUID enrollmentId, Integer progress) {
        if (progress == null || progress < 0 || progress > 100) {
            throw new IllegalArgumentException("La progression doit être comprise entre 0 et 100");
        }
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Enrollment", enrollmentId));

        enrollment.setProgress(progress);
        return enrollmentRepository.save(enrollment);
    }

    public void deleteEnrollment(UUID enrollmentId) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
        User user = enrollmentOpt.map(Enrollment::getUser).orElse(null);
        enrollmentRepository.deleteById(enrollmentId);
        if (user != null) {
            syncDiscordRolesIfLinked(user);
        }
    }
}
