package com.codebangers.backend.cohort.controller;

import com.codebangers.backend.cohort.dto.CohortRequest;
import com.codebangers.backend.cohort.dto.CohortResponse;
import com.codebangers.backend.cohort.model.Cohort;
import com.codebangers.backend.cohort.service.CohortService;
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
@RequestMapping("/api/cohorts")
public class CohortController {

    private final CohortService cohortService;
    private final UserService userService;

    public CohortController(CohortService cohortService, UserService userService) {
        this.cohortService = cohortService;
        this.userService = userService;
    }

    private User resolveUser(Jwt jwt) {
        if (jwt == null) return null;
        return userService.getUserByEmail(jwt.getSubject()).orElse(null);
    }

    @GetMapping
    public ResponseEntity<List<CohortResponse>> getOpenCohorts() {
        return ResponseEntity.ok(cohortService.getOpenCohorts());
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<CohortResponse>> getAllCohorts() {
        return ResponseEntity.ok(cohortService.getAllCohorts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CohortResponse> getCohortById(@PathVariable UUID id) {
        return cohortService.getCohortById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<CohortResponse> getCohortBySlug(@PathVariable String slug) {
        return cohortService.getCohortBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<CohortResponse> createCohort(@Valid @RequestBody CohortRequest request,
                                                       @AuthenticationPrincipal Jwt jwt) {
        User author = resolveUser(jwt);
        Cohort cohort = cohortService.createCohort(request, author);
        return new ResponseEntity<>(cohortService.mapToResponse(cohort), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<CohortResponse> updateCohort(@PathVariable UUID id,
                                                       @Valid @RequestBody CohortRequest request,
                                                       @AuthenticationPrincipal Jwt jwt) {
        User editor = resolveUser(jwt);
        Cohort cohort = cohortService.updateCohort(id, request, editor);
        return ResponseEntity.ok(cohortService.mapToResponse(cohort));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCohort(@PathVariable UUID id) {
        cohortService.deleteCohort(id);
        return ResponseEntity.noContent().build();
    }
}
