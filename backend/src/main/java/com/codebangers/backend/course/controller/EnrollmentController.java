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
    @PreAuthorize("hasRole('ADMIN') or @enrollmentSecurity.canAccessEnrollment(#id, authentication)")
    public ResponseEntity<EnrollmentResponse> getEnrollmentById(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        Enrollment enrollment = enrollmentService.getEnrollmentById(id)
                .orElse(null);
        if (enrollment == null) {
            return ResponseEntity.notFound().build();
        }
        if (jwt != null) {
            User user = getAuthenticatedUser(jwt);
            boolean isAdmin = user.getRole() == com.codebangers.backend.user.model.Role.ADMIN;
            boolean isOwner = enrollment.getUser() != null && enrollment.getUser().getId().equals(user.getId());
            if (!isAdmin && !isOwner) {
                throw new org.springframework.security.access.AccessDeniedException("Accès refusé à cette inscription");
            }
        }
        return ResponseEntity.ok(mapToResponse(enrollment));
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> enrollUserInCourse(@RequestBody EnrollmentRequest request, @AuthenticationPrincipal Jwt jwt) {
        try {
            User authenticatedUser = getAuthenticatedUser(jwt);
            User user;
            if (request.getUserId() != null) {
                boolean isAdmin = authenticatedUser.getRole() == com.codebangers.backend.user.model.Role.ADMIN;
                if (!isAdmin && !request.getUserId().equals(authenticatedUser.getId())) {
                    throw new org.springframework.security.access.AccessDeniedException(
                            "Seul un administrateur peut inscrire un autre utilisateur.");
                }
                if (isAdmin && !request.getUserId().equals(authenticatedUser.getId())) {
                    user = userService.getUserById(request.getUserId())
                            .orElseThrow(() -> new IllegalArgumentException("User not found"));
                } else {
                    user = authenticatedUser;
                }
            } else {
                user = authenticatedUser;
            }
            Enrollment enrollment = enrollmentService.enrollUserInCourse(user, request.getCourseId());
            return new ResponseEntity<>(mapToResponse(enrollment), HttpStatus.CREATED);
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @RequestMapping(value = "/{id}/payment-status", method = {RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.POST})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable UUID id,
            @RequestParam(required = false) PaymentStatus status,
            @RequestBody(required = false) java.util.Map<String, String> body) {
        try {
            PaymentStatus targetStatus = status;
            if (targetStatus == null && body != null && body.containsKey("paymentStatus")) {
                targetStatus = PaymentStatus.valueOf(body.get("paymentStatus").toUpperCase());
            }
            if (targetStatus == null && body != null && body.containsKey("status")) {
                targetStatus = PaymentStatus.valueOf(body.get("status").toUpperCase());
            }
            if (targetStatus == null) {
                return ResponseEntity.badRequest().body("Le statut de paiement est obligatoire (PENDING, PAID, FAILED, REFUNDED).");
            }
            Enrollment enrollment = enrollmentService.updatePaymentStatus(id, targetStatus);
            return ResponseEntity.ok(mapToResponse(enrollment));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @RequestMapping(value = "/user/{userId}/course/{courseId}/payment-status", method = {RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.POST})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setCoursePaymentStatusForUser(
            @PathVariable UUID userId,
            @PathVariable UUID courseId,
            @RequestParam(required = false) PaymentStatus status,
            @RequestBody(required = false) java.util.Map<String, String> body) {
        try {
            PaymentStatus targetStatus = status;
            if (targetStatus == null && body != null && body.containsKey("paymentStatus")) {
                targetStatus = PaymentStatus.valueOf(body.get("paymentStatus").toUpperCase());
            }
            if (targetStatus == null && body != null && body.containsKey("status")) {
                targetStatus = PaymentStatus.valueOf(body.get("status").toUpperCase());
            }
            if (targetStatus == null) {
                return ResponseEntity.badRequest().body("Le statut de paiement est obligatoire (PENDING, PAID, FAILED, REFUNDED).");
            }
            Enrollment enrollment = enrollmentService.setCoursePaymentStatusForUser(userId, courseId, targetStatus);
            return ResponseEntity.ok(mapToResponse(enrollment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/progress")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProgress(
            @PathVariable UUID id,
            @RequestParam Integer progress,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            User user = getAuthenticatedUser(jwt);
            Enrollment enrollment = enrollmentService.updateProgress(id, user.getId(), progress);
            return ResponseEntity.ok(mapToResponse(enrollment));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (com.codebangers.backend.config.exception.ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
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
        if (enrollment.getTier() != null) {
            response.setTier(enrollment.getTier());
            response.setLifetimeAccess(true);
        }
        if (enrollment.getCohort() != null) {
            response.setCohortId(enrollment.getCohort().getId());
            response.setCohortName(enrollment.getCohort().getName());
            response.setCohortSlug(enrollment.getCohort().getSlug());
        }
        return response;
    }
}
