package com.codebangers.backend.user.controller;

import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.user.dto.RoleUpdateRequest;
import com.codebangers.backend.user.dto.UserRequest;
import com.codebangers.backend.user.dto.UserResponse;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final EnrollmentRepository enrollmentRepository;

    public UserController(UserService userService, EnrollmentRepository enrollmentRepository) {
        this.userService = userService;
        this.enrollmentRepository = enrollmentRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAllUsersForAdmin();
        List<UserResponse> responses = users.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id.toString() == authentication.token.claims['userId']")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return userService.getUserById(id)
            .map(user -> ResponseEntity.ok(mapToResponse(user)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id.toString() == authentication.token.claims['userId']")
    public ResponseEntity<?> updateUser(@PathVariable UUID id, @RequestBody UserRequest request) {
        try {
            User user = userService.updateUser(id, request);
            return ResponseEntity.ok(mapToResponse(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @RequestMapping(value = "/{id}/role", method = {RequestMethod.PATCH, RequestMethod.PUT})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable UUID id, @RequestBody(required = false) RoleUpdateRequest request) {
        if (request == null || request.getRole() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Le paramètre 'role' (STUDENT, TEACHER, ADMIN) est obligatoire."));
        }

        try {
            User user = userService.updateUserRole(id, request.getRole());
            return ResponseEntity.ok(mapToResponse(user));
        } catch (com.codebangers.backend.config.exception.ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Utilisateur non trouvé avec l'identifiant spécifié."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erreur lors de la modification du rôle : " + e.getMessage()));
        }
    }

    @RequestMapping(value = "/{id}/block", method = {RequestMethod.PATCH, RequestMethod.PUT, RequestMethod.POST})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> blockUser(@PathVariable UUID id) {
        try {
            userService.blockUser(id);
            return ResponseEntity.ok(Map.of("message", "Utilisateur bloqué avec succès."));
        } catch (com.codebangers.backend.config.exception.ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erreur lors du blocage : " + e.getMessage()));
        }
    }

    @RequestMapping(value = "/{id}/unblock", method = {RequestMethod.PATCH, RequestMethod.PUT, RequestMethod.POST})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> unblockUser(@PathVariable UUID id) {
        try {
            userService.unblockUser(id);
            return ResponseEntity.ok(Map.of("message", "Utilisateur débloqué avec succès."));
        } catch (com.codebangers.backend.config.exception.ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erreur lors du déblocage : " + e.getMessage()));
        }
    }

    @RequestMapping(value = "/{id}/restore", method = {RequestMethod.PATCH, RequestMethod.PUT, RequestMethod.POST})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> restoreUser(@PathVariable UUID id) {
        try {
            userService.restoreUser(id);
            return ResponseEntity.ok(Map.of("message", "Utilisateur restauré avec succès."));
        } catch (com.codebangers.backend.config.exception.ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erreur lors de la restauration : " + e.getMessage()));
        }
    }

    @RequestMapping(value = "/{id}", method = {RequestMethod.DELETE, RequestMethod.POST})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> softDeleteUser(@PathVariable UUID id) {
        try {
            userService.softDeleteUser(id);
            return ResponseEntity.ok(Map.of("message", "Utilisateur marqué comme supprimé (soft delete) avec succès."));
        } catch (com.codebangers.backend.config.exception.ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erreur lors de la suppression : " + e.getMessage()));
        }
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUserName(user.getUserName());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        response.setDeleted(user.isDeleted());
        response.setDeletedAt(user.getDeletedAt());
        response.setBlocked(user.isBlocked());
        response.setBlockedAt(user.getBlockedAt());

        try {
            List<Enrollment> enrollments = enrollmentRepository.findByUserId(user.getId());
            response.setEnrolledCoursesCount(enrollments != null ? enrollments.size() : 0);
            if (enrollments == null || enrollments.isEmpty()) {
                response.setPaymentStatus("GRATUIT");
            } else {
                boolean hasPaid = enrollments.stream().anyMatch(e -> e.getPaymentStatus() == Enrollment.PaymentStatus.PAID);
                response.setPaymentStatus(hasPaid ? "PAYÉ" : "EN ATTENTE");
            }
        } catch (Exception e) {
            response.setEnrolledCoursesCount(0);
            response.setPaymentStatus("GRATUIT");
        }

        return response;
    }
}
