package com.codebangers.backend.course.controller;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.content.model.Content;
import com.codebangers.backend.course.dto.ContentRequest;
import com.codebangers.backend.course.dto.ContentResponse;
import com.codebangers.backend.course.service.ContentService;
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
@RequestMapping("/api/contents")
public class ContentController {

    private final ContentService contentService;
    private final UserService userService;

    public ContentController(ContentService contentService, UserService userService) {
        this.contentService = contentService;
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentResponse> getContentById(@PathVariable UUID id) {
        return contentService.getContentById(id)
            .map(content -> ResponseEntity.ok(mapToResponse(content)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<ContentResponse>> getContentByChapter(@PathVariable UUID chapterId) {
        List<ContentResponse> responses = contentService.getContentByChapter(chapterId).stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/chapter/{chapterId}/active")
    public ResponseEntity<List<ContentResponse>> getActiveContentByChapter(@PathVariable UUID chapterId) {
        List<ContentResponse> responses = contentService.getActiveContentByChapter(chapterId).stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/chapter/{chapterId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ContentResponse> createContent(@PathVariable UUID chapterId,
                                                          @Valid @RequestBody ContentRequest request,
                                                          @AuthenticationPrincipal Jwt jwt) {
        User creator = resolveUser(jwt);
        Content content = contentService.createContent(
            chapterId,
            request.getContentType(),
            request.getBody(),
            request.getMediaUrl(),
            request.getPosition(),
            creator
        );
        return new ResponseEntity<>(mapToResponse(content), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ContentResponse> updateContent(@PathVariable UUID id,
                                                          @Valid @RequestBody ContentRequest request) {
        Content content = contentService.updateContent(
            id,
            request.getContentType(),
            request.getBody(),
            request.getMediaUrl(),
            request.getPosition()
        );
        return ResponseEntity.ok(mapToResponse(content));
    }

    @PutMapping("/{id}/toggle-published")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ContentResponse> togglePublished(@PathVariable UUID id) {
        Content content = contentService.togglePublished(id);
        return ResponseEntity.ok(mapToResponse(content));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<Void> softDeleteContent(@PathVariable UUID id) {
        contentService.softDeleteContent(id);
        return ResponseEntity.noContent().build();
    }

    private User resolveUser(Jwt jwt) {
        String email = jwt.getSubject();
        return userService.getUserByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", email));
    }

    private ContentResponse mapToResponse(Content content) {
        return new ContentResponse(
            content.getId(),
            content.getChapter().getId(),
            content.getContentType(),
            content.getBody(),
            content.getMediaUrl(),
            content.getPosition(),
            content.getCreatedAt(),
            content.getUpdatedAt()
        );
    }
}
