package com.codebangers.backend.course.service;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.chapter.repository.ChapterRepository;
import com.codebangers.backend.content.model.Content;
import com.codebangers.backend.content.model.Content.ContentType;
import com.codebangers.backend.content.repository.ContentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ContentService {

    private final ContentRepository contentRepository;
    private final ChapterRepository chapterRepository;

    public ContentService(ContentRepository contentRepository,
                        ChapterRepository chapterRepository) {
        this.contentRepository = contentRepository;
        this.chapterRepository = chapterRepository;
    }

    @Transactional(readOnly = true)
    public Optional<Content> getContentById(UUID id) {
        return contentRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Content> getContentByChapter(UUID chapterId) {
        return contentRepository.findByChapterId(chapterId);
    }

    @Transactional(readOnly = true)
    public List<Content> getActiveContentByChapter(UUID chapterId) {
        return contentRepository.findActiveByChapterId(chapterId);
    }

    public Content createContent(UUID chapterId, ContentType contentType, 
                               String body, String mediaUrl, Integer position) {
        Chapter chapter = chapterRepository.findById(chapterId)
            .orElseThrow(() -> new IllegalArgumentException("Chapter not found: " + chapterId));

        Content content = new Content(chapter, contentType, body, position);
        content.setMediaUrl(mediaUrl);
        return contentRepository.save(content);
    }

    public Content updateContent(UUID contentId, ContentType contentType,
                               String body, String mediaUrl, Integer position) {
        Content content = contentRepository.findById(contentId)
            .orElseThrow(() -> new IllegalArgumentException("Content not found: " + contentId));

        content.setContentType(contentType);
        content.setBody(body);
        content.setMediaUrl(mediaUrl);
        content.setPosition(position);
        return contentRepository.save(content);
    }

    public void softDeleteContent(UUID contentId) {
        Content content = contentRepository.findById(contentId)
            .orElseThrow(() -> new IllegalArgumentException("Content not found: " + contentId));

        content.setDeletedAt(LocalDateTime.now());
        contentRepository.save(content);
    }

    public void deleteContent(UUID contentId) {
        contentRepository.deleteById(contentId);
    }
}
