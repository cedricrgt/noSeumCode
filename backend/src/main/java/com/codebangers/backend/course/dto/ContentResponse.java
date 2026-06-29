package com.codebangers.backend.course.dto;

import com.codebangers.backend.course.model.Content.ContentType;
import java.time.LocalDateTime;
import java.util.UUID;

public class ContentResponse {

    private UUID id;
    private UUID chapterId;
    private ContentType contentType;
    private String body;
    private String mediaUrl;
    private Integer position;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ContentResponse() {
    }

    public ContentResponse(UUID id, UUID chapterId, ContentType contentType,
                         String body, String mediaUrl, Integer position,
                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.chapterId = chapterId;
        this.contentType = contentType;
        this.body = body;
        this.mediaUrl = mediaUrl;
        this.position = position;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getChapterId() {
        return chapterId;
    }

    public void setChapterId(UUID chapterId) {
        this.chapterId = chapterId;
    }

    public ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
