package com.codebangers.backend.workshop.controller;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import com.codebangers.backend.workshop.dto.UserWorkshopResponse;
import com.codebangers.backend.workshop.model.UserWorkshop;
import com.codebangers.backend.workshop.service.UserWorkshopService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user-workshops")
public class UserWorkshopController {

    private final UserWorkshopService userWorkshopService;
    private final UserService userService;

    public UserWorkshopController(UserWorkshopService userWorkshopService, UserService userService) {
        this.userWorkshopService = userWorkshopService;
        this.userService = userService;
    }

    @GetMapping("/workshop/{workshopId}")
    public ResponseEntity<List<UserWorkshopResponse>> getRegistrationsByWorkshop(@PathVariable UUID workshopId) {
        List<UserWorkshopResponse> responses = userWorkshopService.getRegistrationsByWorkshop(workshopId).stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserWorkshopResponse>> getRegistrationsByUser(@PathVariable UUID userId) {
        List<UserWorkshopResponse> responses = userWorkshopService.getRegistrationsByUser(userId).stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/me")
    public ResponseEntity<List<UserWorkshopResponse>> getMyRegistrations(@AuthenticationPrincipal Jwt jwt) {
        User user = resolveUser(jwt);
        List<UserWorkshopResponse> responses = userWorkshopService.getRegistrationsByUser(user.getId()).stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/{workshopId}")
    public ResponseEntity<UserWorkshopResponse> registerCurrentUser(@PathVariable UUID workshopId,
                                                                     @AuthenticationPrincipal Jwt jwt) {
        User user = resolveUser(jwt);
        UserWorkshop registration = userWorkshopService.registerUserToWorkshop(user, workshopId);
        return new ResponseEntity<>(mapToResponse(registration), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/attendance")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<UserWorkshopResponse> markAttendance(@PathVariable UUID id,
                                                                @RequestParam Boolean attended) {
        UserWorkshop registration = userWorkshopService.markAttendance(id, attended);
        return ResponseEntity.ok(mapToResponse(registration));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unregisterUserFromWorkshop(@PathVariable UUID id) {
        userWorkshopService.unregisterUserFromWorkshop(id);
        return ResponseEntity.noContent().build();
    }

    private User resolveUser(Jwt jwt) {
        String email = jwt.getSubject();
        return userService.getUserByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", email));
    }

    private UserWorkshopResponse mapToResponse(UserWorkshop registration) {
        return new UserWorkshopResponse(
            registration.getId(),
            registration.getUser().getId(),
            registration.getWorkshop().getId(),
            registration.getRegisteredAt(),
            registration.getAttended()
        );
    }
}
