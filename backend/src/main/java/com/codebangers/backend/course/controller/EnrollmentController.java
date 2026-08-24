package com.codebangers.backend.course.controller;

import com.codebangers.backend.course.dto.EnrollmentRequest;
import com.codebangers.backend.course.dto.EnrollmentResponse;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.service.EnrollmentService;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final UserService userService;

    public EnrollmentController(EnrollmentService enrollmentService, UserService userService) {
        this.enrollmentService = enrollmentService;
        this.userService = userService;
    }

    private User getAuthenticatedUser(Jwt jwt) {
        if (jwt == null) {
            throw new IllegalArgumentException("Non authentifié");
        }
        String email = jwt.getSubject();
        return userService.getUserByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
    }

    @GetMapping("/my-courses")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EnrollmentResponse>> getMyEnrolledCourses(@AuthenticationPrincipal Jwt jwt) {
        User user = getAuthenticatedUser(jwt);
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByUser(user.getId());
        List<EnrollmentResponse> responses = enrollments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentResponse> getEnrollmentById(@PathVariable UUID id) {
        return enrollmentService.getEnrollmentById(id)
            .map(enrollment -> ResponseEntity.ok(mapToResponse(enrollment)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByCourse(@PathVariable UUID courseId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByCourse(courseId);
        List<EnrollmentResponse> responses = enrollments.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId.toString() == authentication.token.claims['userId']")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByUser(@PathVariable UUID userId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByUser(userId);
        List<EnrollmentResponse> responses = enrollments.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<?> enrollUserInCourse(@RequestBody EnrollmentRequest request, @AuthenticationPrincipal Jwt jwt) {
        try {
            User user;
            if (request.getUserId() != null) {
                user = userService.getUserById(request.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            } else {
                user = getAuthenticatedUser(jwt);
            }
            Enrollment enrollment = enrollmentService.enrollUserInCourse(user, request.getCourseId());
            return new ResponseEntity<>(mapToResponse(enrollment), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/payment-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable UUID id, @RequestParam PaymentStatus status) {
        try {
            Enrollment enrollment = enrollmentService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(mapToResponse(enrollment));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/progress")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProgress(@PathVariable UUID id, @RequestParam Integer progress) {
        try {
            Enrollment enrollment = enrollmentService.updateProgress(id, progress);
            return ResponseEntity.ok(mapToResponse(enrollment));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEnrollment(@PathVariable UUID id) {
        try {
            enrollmentService.deleteEnrollment(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        EnrollmentResponse response = new EnrollmentResponse(
            enrollment.getId(),
            enrollment.getUser().getId(),
            enrollment.getCourse().getId(),
            enrollment.getEnrolledAt(),
            enrollment.getPaymentStatus(),
            enrollment.getProgress(),
            enrollment.getCompletedAt()
        );
        if (enrollment.getCourse() != null) {
            response.setCourseTitle(enrollment.getCourse().getTitle());
            response.setCourseDescription(enrollment.getCourse().getDescription());
        }
        return response;
    }
}
