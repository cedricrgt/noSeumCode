package com.codebangers.backend.user.controller;

import com.codebangers.backend.config.JwtService;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.user.dto.AuthResponse;
import com.codebangers.backend.user.dto.LoginRequest;
import com.codebangers.backend.user.dto.UserRequest;
import com.codebangers.backend.user.dto.UserResponse;
import com.codebangers.backend.user.model.Role;
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
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRequest request) {
        User user = new User(
            request.getUserName(),
            request.getFirstName(),
            request.getLastName(),
            request.getEmail(),
            request.getPassword(),
            Role.USER
        );
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(mapToAuthResponse(createdUser, "User registered successfully"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userService.authenticateUser(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(mapToAuthResponse(user, "Login successful"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> responses = userService.getAllUsers().stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return userService.getUserById(id)
            .map(user -> ResponseEntity.ok(mapToResponse(user)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable UUID id, @Valid @RequestBody UserRequest request) {
        User user = userService.updateUser(id, request);
        return ResponseEntity.ok(mapToResponse(user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> softDeleteUser(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        User admin = resolveUser(jwt);
        userService.softDeleteUser(id, admin);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> blockUser(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        User admin = resolveUser(jwt);
        userService.blockUser(id, admin);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/unblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unblockUser(@PathVariable UUID id) {
        userService.unblockUser(id);
        return ResponseEntity.noContent().build();
    }

    private User resolveUser(Jwt jwt) {
        String email = jwt.getSubject();
        return userService.getUserByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", email));
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

    private AuthResponse mapToAuthResponse(User user, String message) {
        return new AuthResponse(
            user.getId(),
            user.getUserName(),
            user.getEmail(),
            user.getRole().toString(),
            message,
            jwtService.generateToken(user)
        );
    }
}
