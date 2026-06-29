package com.codebangers.backend.workshop.controller;

import com.codebangers.backend.workshop.dto.WorkshopRequest;
import com.codebangers.backend.workshop.dto.WorkshopResponse;
import com.codebangers.backend.workshop.model.Workshop;
import com.codebangers.backend.workshop.service.WorkshopService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workshops")
@CrossOrigin(origins = "*")
public class WorkshopController {

    private final WorkshopService workshopService;

    public WorkshopController(WorkshopService workshopService) {
        this.workshopService = workshopService;
    }

    @GetMapping
    public ResponseEntity<List<WorkshopResponse>> getAllActiveWorkshops() {
        List<Workshop> workshops = workshopService.getAllActiveWorkshops();
        List<WorkshopResponse> responses = workshops.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<WorkshopResponse>> getUpcomingWorkshops() {
        List<Workshop> workshops = workshopService.getUpcomingWorkshops();
        List<WorkshopResponse> responses = workshops.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/ongoing")
    public ResponseEntity<List<WorkshopResponse>> getOngoingWorkshops() {
        List<Workshop> workshops = workshopService.getOngoingWorkshops();
        List<WorkshopResponse> responses = workshops.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkshopResponse> getWorkshopById(@PathVariable UUID id) {
        return workshopService.getWorkshopById(id)
            .map(workshop -> ResponseEntity.ok(mapToResponse(workshop)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createWorkshop(@RequestBody WorkshopRequest request) {
        try {
            if (request.getTitle() == null || request.getTitle().isBlank()) {
                return ResponseEntity.badRequest().body("Workshop title is required");
            }
            Workshop workshop = workshopService.createWorkshop(
                request.getTitle(),
                request.getDescription(),
                request.getStartDate(),
                request.getEndDate()
            );
            return new ResponseEntity<>(mapToResponse(workshop), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWorkshop(@PathVariable UUID id, @RequestBody WorkshopRequest request) {
        try {
            Workshop workshop = workshopService.updateWorkshop(
                id,
                request.getTitle(),
                request.getDescription(),
                request.getStartDate(),
                request.getEndDate()
            );
            return ResponseEntity.ok(mapToResponse(workshop));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> softDeleteWorkshop(@PathVariable UUID id) {
        try {
            workshopService.softDeleteWorkshop(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
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
