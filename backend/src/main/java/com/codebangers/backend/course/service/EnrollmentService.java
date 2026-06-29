package com.codebangers.backend.course.service;

import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.user.model.User;
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

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                           CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
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

    public Enrollment enrollUserInCourse(User user, UUID courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        // Check if already enrolled
        Optional<Enrollment> existing = enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("User already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment(user, course);
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updatePaymentStatus(UUID enrollmentId, PaymentStatus status) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new IllegalArgumentException("Enrollment not found: " + enrollmentId));

        enrollment.setPaymentStatus(status);
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updateProgress(UUID enrollmentId, Integer progress) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new IllegalArgumentException("Enrollment not found: " + enrollmentId));

        enrollment.setProgress(Math.min(100, Math.max(0, progress)));
        return enrollmentRepository.save(enrollment);
    }

    public void deleteEnrollment(UUID enrollmentId) {
        enrollmentRepository.deleteById(enrollmentId);
    }
}
