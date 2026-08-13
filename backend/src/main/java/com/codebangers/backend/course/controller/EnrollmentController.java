package com.codebangers.backend.course.controller;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.dto.EnrollmentRequest;
import com.codebangers.backend.course.dto.EnrollmentResponse;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.service.EnrollmentService;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final UserService userService;

    public EnrollmentController(EnrollmentService enrollmentService, UserService userService) {
        this.enrollmentService = enrollmentService;
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentResponse> getEnrollmentById(@PathVariable UUID id) {
        return enrollmentService.getEnrollmentById(id)
            .map(enrollment -> ResponseEntity.ok(mapToResponse(enrollment)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByCourse(@PathVariable UUID courseId) {
        List<EnrollmentResponse> responses = enrollmentService.getEnrollmentsByCourse(courseId).stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByUser(@PathVariable UUID userId) {
        List<EnrollmentResponse> responses = enrollmentService.getEnrollmentsByUser(userId).stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/me")
    public ResponseEntity<List<EnrollmentResponse>> getMyEnrollments(@AuthenticationPrincipal Jwt jwt) {
        User user = resolveUser(jwt);
        List<EnrollmentResponse> responses = enrollmentService.getEnrollmentsByUser(user.getId()).stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<EnrollmentResponse> enrollCurrentUser(@Valid @RequestBody EnrollmentRequest request,
                                                                 @AuthenticationPrincipal Jwt jwt) {
        User user = resolveUser(jwt);
        Enrollment enrollment = enrollmentService.enrollUserInCourse(user, request.getCourseId());
        return new ResponseEntity<>(mapToResponse(enrollment), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/payment-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentResponse> updatePaymentStatus(@PathVariable UUID id,
                                                                    @RequestParam PaymentStatus status) {
        Enrollment enrollment = enrollmentService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(mapToResponse(enrollment));
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<EnrollmentResponse> updateProgress(@PathVariable UUID id,
                                                              @RequestParam Integer progress) {
        Enrollment enrollment = enrollmentService.updateProgress(id, progress);
        return ResponseEntity.ok(mapToResponse(enrollment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable UUID id) {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }

    private User resolveUser(Jwt jwt) {
        String email = jwt.getSubject();
        return userService.getUserByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", email));
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        return new EnrollmentResponse(
            enrollment.getId(),
            enrollment.getUser().getId(),
            enrollment.getCourse().getId(),
            enrollment.getEnrolledAt(),
            enrollment.getPaymentStatus(),
            enrollment.getProgress(),
            enrollment.getCompletedAt()
        );
    }
}
