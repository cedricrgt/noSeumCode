package com.codebangers.backend.user.controller;

import com.codebangers.backend.user.dto.UserRequest;
import com.codebangers.backend.user.dto.UserResponse;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAllUsers();
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
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @RequestMapping(value = "/{id}/role", method = {RequestMethod.PATCH, RequestMethod.PUT})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable UUID id, @RequestBody(required = false) com.codebangers.backend.user.dto.RoleUpdateRequest request) {
        if (request == null || request.getRole() == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Le paramètre 'role' (STUDENT, TEACHER, ADMIN) est obligatoire."));
        }

        try {
            User user = userService.updateUserRole(id, request.getRole());
            return ResponseEntity.ok(mapToResponse(user));
        } catch (com.codebangers.backend.config.exception.ResourceNotFoundException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                .body(java.util.Map.of("message", "Utilisateur non trouvé avec l'identifiant spécifié."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Erreur lors de la modification du rôle : " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> softDeleteUser(@PathVariable UUID id) {
        try {
            userService.softDeleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
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
        return response;
    }
}
