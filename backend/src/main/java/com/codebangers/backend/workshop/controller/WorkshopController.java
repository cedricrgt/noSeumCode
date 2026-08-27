package com.codebangers.backend.workshop.controller;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import com.codebangers.backend.workshop.dto.WorkshopRequest;
import com.codebangers.backend.workshop.dto.WorkshopResponse;
import com.codebangers.backend.workshop.model.Workshop;
import com.codebangers.backend.workshop.service.WorkshopService;
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
@RequestMapping("/api/workshops")
public class WorkshopController {

    private final WorkshopService workshopService;
    private final UserService userService;

    public WorkshopController(WorkshopService workshopService, UserService userService) {
        this.workshopService = workshopService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<WorkshopResponse>> getAllActiveWorkshops() {
        List<WorkshopResponse> responses = workshopService.getAllActiveWorkshops().stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<WorkshopResponse>> getUpcomingWorkshops() {
        List<WorkshopResponse> responses = workshopService.getUpcomingWorkshops().stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/ongoing")
    public ResponseEntity<List<WorkshopResponse>> getOngoingWorkshops() {
        List<WorkshopResponse> responses = workshopService.getOngoingWorkshops().stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkshopResponse> getWorkshopById(@PathVariable UUID id) {
        return workshopService.getWorkshopById(id)
            .map(workshop -> ResponseEntity.ok(mapToResponse(workshop)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<WorkshopResponse> createWorkshop(@Valid @RequestBody WorkshopRequest request,
                                                            @AuthenticationPrincipal Jwt jwt) {
        User creator = resolveUser(jwt);
        Workshop workshop = workshopService.createWorkshop(
            request.getTitle(),
            request.getDescription(),
            request.getStartDate(),
            request.getEndDate(),
            creator
        );
        return new ResponseEntity<>(mapToResponse(workshop), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<WorkshopResponse> updateWorkshop(@PathVariable UUID id,
                                                            @Valid @RequestBody WorkshopRequest request) {
        Workshop workshop = workshopService.updateWorkshop(
            id,
            request.getTitle(),
            request.getDescription(),
            request.getStartDate(),
            request.getEndDate()
        );
        return ResponseEntity.ok(mapToResponse(workshop));
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

    private WorkshopResponse mapToResponse(Workshop workshop) {
        return new WorkshopResponse(
            workshop.getId(),
            workshop.getTitle(),
            workshop.getDescription(),
            workshop.getStartDate(),
            workshop.getEndDate(),
            workshop.getCreatedAt(),
            workshop.getUpdatedAt()
        );
    }
}
