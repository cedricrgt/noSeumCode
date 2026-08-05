package com.codebangers.backend.course.controller;

import com.codebangers.backend.course.dto.ChapterRequest;
import com.codebangers.backend.course.dto.ChapterResponse;
import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.course.service.ChapterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chapters")
@CrossOrigin(origins = "*")
public class ChapterController {

    private final ChapterService chapterService;

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
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

    @GetMapping("/{id}/sub-chapters")
    public ResponseEntity<List<ChapterResponse>> getSubChapters(@PathVariable UUID id) {
        List<Chapter> chapters = chapterService.getSubChapters(id);
        List<ChapterResponse> responses = chapters.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/course/{courseId}")
    public ResponseEntity<?> createChapter(@PathVariable UUID courseId, @RequestBody ChapterRequest request) {
        try {
            Chapter chapter = chapterService.createChapter(courseId, request.getTitle(), request.getPosition());
            return new ResponseEntity<>(mapToResponse(chapter), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{parentId}/sub-chapter")
    public ResponseEntity<?> createSubChapter(@PathVariable UUID parentId, @RequestBody ChapterRequest request) {
        try {
            Chapter chapter = chapterService.createSubChapter(parentId, request.getTitle(), request.getPosition());
            return new ResponseEntity<>(mapToResponse(chapter), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateChapter(@PathVariable UUID id, @RequestBody ChapterRequest request) {
        try {
            Chapter chapter = chapterService.updateChapter(id, request.getTitle(), request.getPosition());
            return ResponseEntity.ok(mapToResponse(chapter));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> softDeleteChapter(@PathVariable UUID id) {
        try {
            chapterService.softDeleteChapter(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
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
