package com.codebangers.backend.course.service;

import com.codebangers.backend.config.exception.DuplicateResourceException;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.model.Course;
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

    public Enrollment enrollUserInCourse(User user, UUID courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course", courseId));

        Optional<Enrollment> existing = enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId);
        if (existing.isPresent()) {
            throw new DuplicateResourceException("User already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment(user, course);
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updatePaymentStatus(UUID enrollmentId, PaymentStatus status) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Enrollment", enrollmentId));

        enrollment.setPaymentStatus(status);
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment setCoursePaymentStatusForUser(UUID userId, UUID courseId, PaymentStatus status) {
        Optional<Enrollment> existing = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        if (existing.isPresent()) {
            Enrollment enrollment = existing.get();
            enrollment.setPaymentStatus(status);
            return enrollmentRepository.save(enrollment);
        } else {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", courseId));
            Enrollment newEnrollment = new Enrollment(user, course, status, 0);
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
