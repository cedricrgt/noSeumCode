package com.codebangers.backend.workshop.controller;

import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import com.codebangers.backend.workshop.dto.UserWorkshopRequest;
import com.codebangers.backend.workshop.dto.UserWorkshopResponse;
import com.codebangers.backend.workshop.model.UserWorkshop;
import com.codebangers.backend.workshop.service.UserWorkshopService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-workshops")
@CrossOrigin(origins = "*")
public class UserWorkshopController {

    private final UserWorkshopService userWorkshopService;
    private final UserService userService;

    public UserWorkshopController(UserWorkshopService userWorkshopService, UserService userService) {
        this.userWorkshopService = userWorkshopService;
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserWorkshopResponse> getRegistration(@PathVariable UUID id) {
        return userWorkshopService.getRegistration(id, id)
            .map(registration -> ResponseEntity.ok(mapToResponse(registration)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/workshop/{workshopId}")
    public ResponseEntity<List<UserWorkshopResponse>> getRegistrationsByWorkshop(@PathVariable UUID workshopId) {
        List<UserWorkshop> registrations = userWorkshopService.getRegistrationsByWorkshop(workshopId);
        List<UserWorkshopResponse> responses = registrations.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserWorkshopResponse>> getRegistrationsByUser(@PathVariable UUID userId) {
        List<UserWorkshop> registrations = userWorkshopService.getRegistrationsByUser(userId);
        List<UserWorkshopResponse> responses = registrations.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<?> registerUserToWorkshop(@RequestBody UserWorkshopRequest request) {
        try {
            User user = userService.getUserById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
            UserWorkshop registration = userWorkshopService.registerUserToWorkshop(user, request.getWorkshopId());
            return new ResponseEntity<>(mapToResponse(registration), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/attendance")
    public ResponseEntity<?> markAttendance(@PathVariable UUID id, @RequestParam Boolean attended) {
        try {
            UserWorkshop registration = userWorkshopService.markAttendance(id, attended);
            return ResponseEntity.ok(mapToResponse(registration));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> unregisterUserFromWorkshop(@PathVariable UUID id) {
        try {
            userWorkshopService.unregisterUserFromWorkshop(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
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
