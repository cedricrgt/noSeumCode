package com.codebangers.backend.course.dto;

import com.codebangers.backend.course.model.ApprovalStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ChapterResponse {

    private UUID id;
    private UUID courseId;
    private String courseTitle;
    private UUID parentId;
    private String title;
    private Integer position;
    private ApprovalStatus status;
    private String rejectionReason;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private UUID createdById;
    private String createdByName;
    private UUID reviewedById;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ContentResponse> contents;

    public ChapterResponse() {
    }

    public ChapterResponse(UUID id, UUID courseId, UUID parentId, String title,
                          Integer position, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.courseId = courseId;
        this.parentId = parentId;
        this.title = title;
        this.position = position;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = ApprovalStatus.APPROVED;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getCourseId() {
        return courseId;
    }

    public void setCourseId(UUID courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public UUID getParentId() {
        return parentId;
    }

    public void setParentId(UUID parentId) {
        this.parentId = parentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public ApprovalStatus getStatus() {
        return status;
    }

    public void setStatus(ApprovalStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public UUID getCreatedById() {
        return createdById;
    }

    public void setCreatedById(UUID createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public UUID getReviewedById() {
        return reviewedById;
    }

    public void setReviewedById(UUID reviewedById) {
        this.reviewedById = reviewedById;
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

    private String content;

    public List<ContentResponse> getContents() {
        return contents;
    }

    public void setContents(List<ContentResponse> contents) {
        this.contents = contents;
    }

    public String getContent() {
        if (content != null && !content.isEmpty()) {
            return content;
        }
        if (contents != null && !contents.isEmpty()) {
            return contents.stream()
                .map(ContentResponse::getBody)
                .filter(b -> b != null && !b.isEmpty())
                .findFirst()
                .orElse("");
        }
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
