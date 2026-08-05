package com.codebangers.backend.course.controller;

import com.codebangers.backend.course.dto.ContentRequest;
import com.codebangers.backend.course.dto.ContentResponse;
import com.codebangers.backend.content.model.Content;
import com.codebangers.backend.course.service.ContentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contents")
@CrossOrigin(origins = "*")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentResponse> getContentById(@PathVariable UUID id) {
        return contentService.getContentById(id)
            .map(content -> ResponseEntity.ok(mapToResponse(content)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<ContentResponse>> getContentByChapter(@PathVariable UUID chapterId) {
        List<Content> contents = contentService.getContentByChapter(chapterId);
        List<ContentResponse> responses = contents.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/chapter/{chapterId}/active")
    public ResponseEntity<List<ContentResponse>> getActiveContentByChapter(@PathVariable UUID chapterId) {
        List<Content> contents = contentService.getActiveContentByChapter(chapterId);
        List<ContentResponse> responses = contents.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/chapter/{chapterId}")
    public ResponseEntity<?> createContent(@PathVariable UUID chapterId, @RequestBody ContentRequest request) {
        try {
            Content content = contentService.createContent(
                chapterId,
                request.getContentType(),
                request.getBody(),
                request.getMediaUrl(),
                request.getPosition()
            );
            return new ResponseEntity<>(mapToResponse(content), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateContent(@PathVariable UUID id, @RequestBody ContentRequest request) {
        try {
            Content content = contentService.updateContent(
                id,
                request.getContentType(),
                request.getBody(),
                request.getMediaUrl(),
                request.getPosition()
            );
            return ResponseEntity.ok(mapToResponse(content));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> softDeleteContent(@PathVariable UUID id) {
        try {
            contentService.softDeleteContent(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
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
