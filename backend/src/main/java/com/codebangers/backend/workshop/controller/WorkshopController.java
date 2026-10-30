package com.codebangers.backend.workshop.controller;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import com.codebangers.backend.workshop.dto.WorkshopRequest;
import com.codebangers.backend.workshop.dto.WorkshopResponse;
import com.codebangers.backend.workshop.model.Workshop;
<<<<<<< HEAD
import com.codebangers.backend.workshop.repository.UserWorkshopRepository;
=======
>>>>>>> main
import com.codebangers.backend.workshop.service.WorkshopService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
<<<<<<< HEAD
import java.util.Optional;
=======
>>>>>>> main
import java.util.UUID;

@RestController
@RequestMapping("/api/workshops")
public class WorkshopController {

    private final WorkshopService workshopService;
    private final UserService userService;
<<<<<<< HEAD
    private final UserWorkshopRepository userWorkshopRepository;

    public WorkshopController(WorkshopService workshopService,
                              UserService userService,
                              UserWorkshopRepository userWorkshopRepository) {
        this.workshopService = workshopService;
        this.userService = userService;
        this.userWorkshopRepository = userWorkshopRepository;
    }

    @GetMapping
    public ResponseEntity<List<WorkshopResponse>> getAllActiveWorkshops(@AuthenticationPrincipal Jwt jwt) {
        UUID currentUserId = resolveOptionalUserId(jwt);
        List<WorkshopResponse> responses = workshopService.getAllActiveWorkshops().stream()
            .map(w -> mapToResponse(w, currentUserId))
=======

    public WorkshopController(WorkshopService workshopService, UserService userService) {
        this.workshopService = workshopService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<WorkshopResponse>> getAllActiveWorkshops() {
        List<WorkshopResponse> responses = workshopService.getAllActiveWorkshops().stream()
            .map(this::mapToResponse)
>>>>>>> main
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/upcoming")
<<<<<<< HEAD
    public ResponseEntity<List<WorkshopResponse>> getUpcomingWorkshops(@AuthenticationPrincipal Jwt jwt) {
        UUID currentUserId = resolveOptionalUserId(jwt);
        List<WorkshopResponse> responses = workshopService.getUpcomingWorkshops().stream()
            .map(w -> mapToResponse(w, currentUserId))
=======
    public ResponseEntity<List<WorkshopResponse>> getUpcomingWorkshops() {
        List<WorkshopResponse> responses = workshopService.getUpcomingWorkshops().stream()
            .map(this::mapToResponse)
>>>>>>> main
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/ongoing")
<<<<<<< HEAD
    public ResponseEntity<List<WorkshopResponse>> getOngoingWorkshops(@AuthenticationPrincipal Jwt jwt) {
        UUID currentUserId = resolveOptionalUserId(jwt);
        List<WorkshopResponse> responses = workshopService.getOngoingWorkshops().stream()
            .map(w -> mapToResponse(w, currentUserId))
=======
    public ResponseEntity<List<WorkshopResponse>> getOngoingWorkshops() {
        List<WorkshopResponse> responses = workshopService.getOngoingWorkshops().stream()
            .map(this::mapToResponse)
>>>>>>> main
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
<<<<<<< HEAD
    public ResponseEntity<WorkshopResponse> getWorkshopById(@PathVariable UUID id,
                                                            @AuthenticationPrincipal Jwt jwt) {
        UUID currentUserId = resolveOptionalUserId(jwt);
        return workshopService.getWorkshopById(id)
            .map(workshop -> ResponseEntity.ok(mapToResponse(workshop, currentUserId)))
=======
    public ResponseEntity<WorkshopResponse> getWorkshopById(@PathVariable UUID id) {
        return workshopService.getWorkshopById(id)
            .map(workshop -> ResponseEntity.ok(mapToResponse(workshop)))
>>>>>>> main
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<WorkshopResponse> createWorkshop(@Valid @RequestBody WorkshopRequest request,
                                                            @AuthenticationPrincipal Jwt jwt) {
        User creator = resolveUser(jwt);
        Workshop workshop = workshopService.createWorkshop(
            request.getTitle(),
<<<<<<< HEAD
            request.getTheme(),
            request.getDescription(),
            request.getMaxParticipants(),
=======
            request.getDescription(),
>>>>>>> main
            request.getStartDate(),
            request.getEndDate(),
            creator
        );
<<<<<<< HEAD
        return new ResponseEntity<>(mapToResponse(workshop, creator.getId()), HttpStatus.CREATED);
=======
        return new ResponseEntity<>(mapToResponse(workshop), HttpStatus.CREATED);
>>>>>>> main
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<WorkshopResponse> updateWorkshop(@PathVariable UUID id,
<<<<<<< HEAD
                                                            @Valid @RequestBody WorkshopRequest request,
                                                            @AuthenticationPrincipal Jwt jwt) {
        Workshop workshop = workshopService.updateWorkshop(
            id,
            request.getTitle(),
            request.getTheme(),
            request.getDescription(),
            request.getMaxParticipants(),
            request.getStartDate(),
            request.getEndDate()
        );
        UUID currentUserId = resolveOptionalUserId(jwt);
        return ResponseEntity.ok(mapToResponse(workshop, currentUserId));
=======
                                                            @Valid @RequestBody WorkshopRequest request) {
        Workshop workshop = workshopService.updateWorkshop(
            id,
            request.getTitle(),
            request.getDescription(),
            request.getStartDate(),
            request.getEndDate()
        );
        return ResponseEntity.ok(mapToResponse(workshop));
>>>>>>> main
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<Void> softDeleteWorkshop(@PathVariable UUID id) {
        workshopService.softDeleteWorkshop(id);
        return ResponseEntity.noContent().build();
    }

    private User resolveUser(Jwt jwt) {
        String email = jwt.getSubject();
        return userService.getUserByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", email));
    }

<<<<<<< HEAD
    private UUID resolveOptionalUserId(Jwt jwt) {
        if (jwt == null || jwt.getSubject() == null) {
            return null;
        }
        return userService.getUserByEmail(jwt.getSubject())
            .map(User::getId)
            .orElse(null);
    }

    private WorkshopResponse mapToResponse(Workshop workshop, UUID currentUserId) {
        int max = workshop.getMaxParticipants() != null ? workshop.getMaxParticipants() : 6;
        int registeredCount = userWorkshopRepository.countByWorkshopId(workshop.getId());
        int remainingSeats = Math.max(0, max - registeredCount);
        boolean isFull = remainingSeats <= 0;

        boolean isUserRegistered = false;
        if (currentUserId != null) {
            isUserRegistered = userWorkshopRepository.findByUserIdAndWorkshopId(currentUserId, workshop.getId()).isPresent();
        }

        return new WorkshopResponse(
            workshop.getId(),
            workshop.getTitle(),
            workshop.getTheme(),
            workshop.getDescription(),
            max,
            registeredCount,
            remainingSeats,
            isFull,
            isUserRegistered,
=======
    private WorkshopResponse mapToResponse(Workshop workshop) {
        return new WorkshopResponse(
            workshop.getId(),
            workshop.getTitle(),
            workshop.getDescription(),
>>>>>>> main
            workshop.getStartDate(),
            workshop.getEndDate(),
            workshop.getCreatedAt(),
            workshop.getUpdatedAt()
        );
    }
}
