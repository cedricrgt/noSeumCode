package com.codebangers.backend.course.controller;

import com.codebangers.backend.course.dto.ChapterRequest;
import com.codebangers.backend.course.dto.ChapterResponse;
import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.course.service.ChapterService;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {

    private final ChapterService chapterService;
    private final UserRepository userRepository;

    public ChapterController(ChapterService chapterService, UserRepository userRepository) {
        this.chapterService = chapterService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(Jwt jwt) {
        if (jwt == null) return null;
        return userRepository.findByEmail(jwt.getSubject()).orElse(null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChapterResponse> getChapterById(@PathVariable UUID id) {
        return chapterService.getChapterById(id)
            .map(chapter -> ResponseEntity.ok(mapToResponse(chapter)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ChapterResponse>> getRootChaptersByCourse(@PathVariable UUID courseId) {
        List<Chapter> chapters = chapterService.getRootChaptersByCourse(courseId);
        List<ChapterResponse> responses = chapters.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/course/{courseId}/all")
    public ResponseEntity<List<ChapterResponse>> getActiveChaptersByCourse(@PathVariable UUID courseId) {
        List<Chapter> chapters = chapterService.getActiveChaptersByCourse(courseId);
        List<ChapterResponse> responses = chapters.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/course/{courseId}/approved")
    public ResponseEntity<List<ChapterResponse>> getApprovedChaptersByCourse(@PathVariable UUID courseId) {
        List<Chapter> chapters = chapterService.getApprovedChaptersByCourse(courseId);
        List<ChapterResponse> responses = chapters.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/pending-approval")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ChapterResponse>> getPendingApprovalChapters() {
        List<Chapter> chapters = chapterService.getPendingApprovalChapters();
        List<ChapterResponse> responses = chapters.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}/sub-chapters")
    public ResponseEntity<List<ChapterResponse>> getSubChapters(@PathVariable UUID id) {
        List<Chapter> chapters = chapterService.getSubChapters(id);
        List<ChapterResponse> responses = chapters.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> createChapter(@PathVariable UUID courseId, @RequestBody ChapterRequest request, @AuthenticationPrincipal Jwt jwt) {
        try {
            User author = getAuthenticatedUser(jwt);
            Chapter chapter = chapterService.createChapter(courseId, request.getTitle(), request.getPosition(), author);
            return new ResponseEntity<>(mapToResponse(chapter), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{parentId}/sub-chapter")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> createSubChapter(@PathVariable UUID parentId, @RequestBody ChapterRequest request, @AuthenticationPrincipal Jwt jwt) {
        try {
            User author = getAuthenticatedUser(jwt);
            Chapter chapter = chapterService.createSubChapter(parentId, request.getTitle(), request.getPosition(), author);
            return new ResponseEntity<>(mapToResponse(chapter), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> updateChapter(@PathVariable UUID id, @RequestBody ChapterRequest request, @AuthenticationPrincipal Jwt jwt) {
        try {
            User editor = getAuthenticatedUser(jwt);
            Chapter chapter = chapterService.updateChapter(id, request.getTitle(), request.getPosition(), editor);
            return ResponseEntity.ok(mapToResponse(chapter));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> submitForApproval(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        try {
            User user = getAuthenticatedUser(jwt);
            Chapter chapter = chapterService.submitForApproval(id, user);
            return ResponseEntity.ok(mapToResponse(chapter));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveChapter(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        try {
            User admin = getAuthenticatedUser(jwt);
            Chapter chapter = chapterService.approveChapter(id, admin);
            return ResponseEntity.ok(mapToResponse(chapter));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectChapter(@PathVariable UUID id, @RequestBody(required = false) Map<String, String> body, @AuthenticationPrincipal Jwt jwt) {
        try {
            User admin = getAuthenticatedUser(jwt);
            String reason = body != null ? body.get("reason") : "";
            Chapter chapter = chapterService.rejectChapter(id, reason, admin);
            return ResponseEntity.ok(mapToResponse(chapter));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> softDeleteChapter(@PathVariable UUID id) {
        try {
            chapterService.softDeleteChapter(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private ChapterResponse mapToResponse(Chapter chapter) {
        ChapterResponse response = new ChapterResponse(
            chapter.getId(),
            chapter.getCourse() != null ? chapter.getCourse().getId() : null,
            chapter.getParent() != null ? chapter.getParent().getId() : null,
            chapter.getTitle(),
            chapter.getPosition(),
            chapter.getCreatedAt(),
            chapter.getUpdatedAt()
        );
        if (chapter.getCourse() != null) {
            response.setCourseTitle(chapter.getCourse().getTitle());
        }
        response.setStatus(chapter.getStatus());
        response.setRejectionReason(chapter.getRejectionReason());
        response.setSubmittedAt(chapter.getSubmittedAt());
        response.setReviewedAt(chapter.getReviewedAt());
        if (chapter.getCreatedBy() != null) {
            response.setCreatedById(chapter.getCreatedBy().getId());
            response.setCreatedByName(chapter.getCreatedBy().getFirstName() + " " + chapter.getCreatedBy().getLastName());
        }
        if (chapter.getReviewedBy() != null) {
            response.setReviewedById(chapter.getReviewedBy().getId());
        }
        return response;
    }
}
