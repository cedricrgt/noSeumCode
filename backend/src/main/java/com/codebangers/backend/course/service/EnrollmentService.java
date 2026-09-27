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

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                           CourseRepository courseRepository,
                           UserRepository userRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
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
            if (e.getPaymentStatus() == PaymentStatus.PAID) {
                EnrollmentTier userTier = e.getTier() != null ? e.getTier() : EnrollmentTier.WEB;
                if (userTier.canAccess(requiredTier)) {
                    return true;
                }
            }
        }

        // 2. Vérification si l'utilisateur possède une autre inscription active d'un tier suffisant (Pack global)
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

        enrollment.setPaymentStatus(status);
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment setCoursePaymentStatusForUser(UUID userId, UUID courseId, PaymentStatus status) {
        return setCoursePaymentStatusForUser(userId, courseId, status, EnrollmentTier.WEB, null);
    }

    public Enrollment setCoursePaymentStatusForUser(UUID userId, UUID courseId, PaymentStatus status, EnrollmentTier tier, Cohort cohort) {
        Optional<Enrollment> existing = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        if (existing.isPresent()) {
            Enrollment enrollment = existing.get();
            enrollment.setPaymentStatus(status);
            if (tier != null) {
                enrollment.setTier(tier);
            }
            if (cohort != null) {
                enrollment.setCohort(cohort);
            }
            return enrollmentRepository.save(enrollment);
        } else {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", courseId));
            Enrollment newEnrollment = new Enrollment(user, course, status, 0, tier != null ? tier : EnrollmentTier.WEB, cohort);
            return enrollmentRepository.save(newEnrollment);
        }
    }

    public Enrollment updateProgress(UUID enrollmentId, Integer progress) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Enrollment", enrollmentId));

        enrollment.setProgress(Math.min(100, Math.max(0, progress)));
        return enrollmentRepository.save(enrollment);
    }

    public void deleteEnrollment(UUID enrollmentId) {
        enrollmentRepository.deleteById(enrollmentId);
    }
}
