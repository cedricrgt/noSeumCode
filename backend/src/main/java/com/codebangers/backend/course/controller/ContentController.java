package com.codebangers.backend.course.controller;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.content.model.Content;
import com.codebangers.backend.course.dto.ContentRequest;
import com.codebangers.backend.course.dto.ContentResponse;
import com.codebangers.backend.course.service.ChapterService;
import com.codebangers.backend.course.service.ContentService;
import com.codebangers.backend.course.service.EnrollmentService;
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
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/contents")
public class ContentController {

    private final ContentService contentService;
    private final UserService userService;
    private final ChapterService chapterService;
    private final EnrollmentService enrollmentService;

    public ContentController(ContentService contentService,
                             UserService userService,
                             ChapterService chapterService,
                             EnrollmentService enrollmentService) {
        this.contentService = contentService;
        this.userService = userService;
        this.chapterService = chapterService;
        this.enrollmentService = enrollmentService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getContentById(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        Optional<Content> opt = contentService.getContentWithChapterAndCourse(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Content content = opt.get();
        Chapter chapter = content.getChapter();
        UUID courseId = (chapter != null && chapter.getCourse() != null) ? chapter.getCourse().getId() : null;
        User user = resolveOptionalUser(jwt);
        boolean hasPaid = enrollmentService.hasPaidAccess(user, courseId);
        boolean isPreview = (chapter != null && chapter.isFreePreview());

        if (!hasPaid && !isPreview) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Accès refusé. Cette ressource nécessite une inscription payante validée."));
        }

        return ResponseEntity.ok(mapToResponse(content));
    }

    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<?> getContentByChapter(@PathVariable UUID chapterId, @AuthenticationPrincipal Jwt jwt) {
        Optional<Chapter> chapOpt = chapterService.getChapterById(chapterId);
        if (chapOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Chapter chapter = chapOpt.get();
        UUID courseId = chapter.getCourse() != null ? chapter.getCourse().getId() : null;
        User user = resolveOptionalUser(jwt);
        boolean hasPaid = enrollmentService.hasPaidAccess(user, courseId);
        boolean isPreview = chapter.isFreePreview();

        if (!hasPaid && !isPreview) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Accès refusé. Les contenus de cette section nécessitent une inscription payante validée."));
        }

        List<ContentResponse> responses = contentService.getContentByChapter(chapterId).stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/chapter/{chapterId}/active")
    public ResponseEntity<?> getActiveContentByChapter(@PathVariable UUID chapterId, @AuthenticationPrincipal Jwt jwt) {
        Optional<Chapter> chapOpt = chapterService.getChapterById(chapterId);
        if (chapOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Chapter chapter = chapOpt.get();
        UUID courseId = chapter.getCourse() != null ? chapter.getCourse().getId() : null;
        User user = resolveOptionalUser(jwt);
        boolean hasPaid = enrollmentService.hasPaidAccess(user, courseId);
        boolean isPreview = chapter.isFreePreview();

        if (!hasPaid && !isPreview) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Accès refusé. Les contenus de cette section nécessitent une inscription payante validée."));
        }

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

    private User resolveOptionalUser(Jwt jwt) {
        if (jwt == null) return null;
        return userService.getUserByEmail(jwt.getSubject()).orElse(null);
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
