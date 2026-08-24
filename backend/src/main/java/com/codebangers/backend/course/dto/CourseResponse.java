package com.codebangers.backend.course.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CourseResponse {

    private UUID id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByName;
    private String updatedByName;
    private int chaptersCount = 0;

    // Constructors

    public CourseResponse() {
    }

    public CourseResponse(UUID id, String title, String description,
                        LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public CourseResponse(UUID id, String title, String description,
                        LocalDateTime createdAt, LocalDateTime updatedAt,
                        String createdByName, String updatedByName, int chaptersCount) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdByName = createdByName;
        this.updatedByName = updatedByName;
        this.chaptersCount = chaptersCount;
    }

    // Getters & Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public String getUpdatedByName() {
        return updatedByName;
    }

    public void setUpdatedByName(String updatedByName) {
        this.updatedByName = updatedByName;
    }

    public int getChaptersCount() {
        return chaptersCount;
    }

    public void setChaptersCount(int chaptersCount) {
        this.chaptersCount = chaptersCount;
    }
}
