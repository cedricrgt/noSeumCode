package com.codebangers.backend.workshop.controller;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import com.codebangers.backend.workshop.dto.WorkshopRequest;
import com.codebangers.backend.workshop.dto.WorkshopResponse;
import com.codebangers.backend.workshop.model.Workshop;
import com.codebangers.backend.workshop.repository.UserWorkshopRepository;
import com.codebangers.backend.workshop.service.WorkshopService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/workshops")
public class WorkshopController {

    private final WorkshopService workshopService;
    private final UserService userService;
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
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<WorkshopResponse>> getUpcomingWorkshops(@AuthenticationPrincipal Jwt jwt) {
        UUID currentUserId = resolveOptionalUserId(jwt);
        List<WorkshopResponse> responses = workshopService.getUpcomingWorkshops().stream()
            .map(w -> mapToResponse(w, currentUserId))
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/ongoing")
    public ResponseEntity<List<WorkshopResponse>> getOngoingWorkshops(@AuthenticationPrincipal Jwt jwt) {
        UUID currentUserId = resolveOptionalUserId(jwt);
        List<WorkshopResponse> responses = workshopService.getOngoingWorkshops().stream()
            .map(w -> mapToResponse(w, currentUserId))
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkshopResponse> getWorkshopById(@PathVariable UUID id,
                                                            @AuthenticationPrincipal Jwt jwt) {
        UUID currentUserId = resolveOptionalUserId(jwt);
        return workshopService.getWorkshopById(id)
            .map(workshop -> ResponseEntity.ok(mapToResponse(workshop, currentUserId)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<WorkshopResponse> createWorkshop(@Valid @RequestBody WorkshopRequest request,
                                                            @AuthenticationPrincipal Jwt jwt) {
        User creator = resolveUser(jwt);
        Workshop workshop = workshopService.createWorkshop(
            request.getTitle(),
            request.getTheme(),
            request.getDescription(),
            request.getMaxParticipants(),
            request.getStartDate(),
            request.getEndDate(),
            creator
        );
        return new ResponseEntity<>(mapToResponse(workshop, creator.getId()), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<WorkshopResponse> updateWorkshop(@PathVariable UUID id,
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
            workshop.getStartDate(),
            workshop.getEndDate(),
            workshop.getCreatedAt(),
            workshop.getUpdatedAt()
        );
    }
}
