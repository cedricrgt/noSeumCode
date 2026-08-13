package com.codebangers.backend.course.controller;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.dto.ChapterRequest;
import com.codebangers.backend.course.dto.ChapterResponse;
import com.codebangers.backend.course.service.ChapterService;
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
@RequestMapping("/api/chapters")
public class ChapterController {

    private final ChapterService chapterService;
    private final UserService userService;

    public ChapterController(ChapterService chapterService, UserService userService) {
        this.chapterService = chapterService;
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChapterResponse> getChapterById(@PathVariable UUID id) {
        return chapterService.getChapterById(id)
            .map(chapter -> ResponseEntity.ok(mapToResponse(chapter)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ChapterResponse>> getRootChaptersByCourse(@PathVariable UUID courseId) {
        List<ChapterResponse> responses = chapterService.getRootChaptersByCourse(courseId).stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/course/{courseId}/all")
    public ResponseEntity<List<ChapterResponse>> getActiveChaptersByCourse(@PathVariable UUID courseId) {
        List<ChapterResponse> responses = chapterService.getActiveChaptersByCourse(courseId).stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}/sub-chapters")
    public ResponseEntity<List<ChapterResponse>> getSubChapters(@PathVariable UUID id) {
        List<ChapterResponse> responses = chapterService.getSubChapters(id).stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ChapterResponse> createChapter(@PathVariable UUID courseId,
                                                          @Valid @RequestBody ChapterRequest request,
                                                          @AuthenticationPrincipal Jwt jwt) {
        User creator = resolveUser(jwt);
        Chapter chapter = chapterService.createChapter(courseId, request.getTitle(), request.getPosition(), creator);
        return new ResponseEntity<>(mapToResponse(chapter), HttpStatus.CREATED);
    }

    @PostMapping("/{parentId}/sub-chapter")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ChapterResponse> createSubChapter(@PathVariable UUID parentId,
                                                             @Valid @RequestBody ChapterRequest request,
                                                             @AuthenticationPrincipal Jwt jwt) {
        User creator = resolveUser(jwt);
        Chapter chapter = chapterService.createSubChapter(parentId, request.getTitle(), request.getPosition(), creator);
        return new ResponseEntity<>(mapToResponse(chapter), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ChapterResponse> updateChapter(@PathVariable UUID id,
                                                          @Valid @RequestBody ChapterRequest request) {
        Chapter chapter = chapterService.updateChapter(id, request.getTitle(), request.getPosition());
        return ResponseEntity.ok(mapToResponse(chapter));
    }

    @PutMapping("/{id}/toggle-published")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ChapterResponse> togglePublished(@PathVariable UUID id) {
        Chapter chapter = chapterService.togglePublished(id);
        return ResponseEntity.ok(mapToResponse(chapter));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<Void> softDeleteChapter(@PathVariable UUID id) {
        chapterService.softDeleteChapter(id);
        return ResponseEntity.noContent().build();
    }

    private User resolveUser(Jwt jwt) {
        String email = jwt.getSubject();
        return userService.getUserByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", email));
    }

    private ChapterResponse mapToResponse(Chapter chapter) {
        return new ChapterResponse(
            chapter.getId(),
            chapter.getCourse().getId(),
            chapter.getParent() != null ? chapter.getParent().getId() : null,
            chapter.getTitle(),
            chapter.getPosition(),
            chapter.getCreatedAt(),
            chapter.getUpdatedAt()
        );
    }
}
