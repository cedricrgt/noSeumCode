package com.codebangers.backend.course.dto;

import com.codebangers.backend.course.model.ApprovalStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class LiveRecapBatchResponse {

    private UUID parentChapterId;
    private UUID courseId;
    private String courseTitle;
    private String courseSlug;
    private String sessionTitle;
    private ApprovalStatus status;
    private int subChaptersCount;
    private List<UUID> subChapterIds = new ArrayList<>();
    private LocalDateTime createdAt;

    public LiveRecapBatchResponse() {
    }

    public LiveRecapBatchResponse(UUID parentChapterId, UUID courseId, String courseTitle, String courseSlug,
                                 String sessionTitle, ApprovalStatus status, int subChaptersCount,
                                 List<UUID> subChapterIds, LocalDateTime createdAt) {
        this.parentChapterId = parentChapterId;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.courseSlug = courseSlug;
        this.sessionTitle = sessionTitle;
        this.status = status;
        this.subChaptersCount = subChaptersCount;
        this.subChapterIds = subChapterIds != null ? subChapterIds : new ArrayList<>();
        this.createdAt = createdAt;
    }

    public UUID getParentChapterId() {
        return parentChapterId;
    }

    public void setParentChapterId(UUID parentChapterId) {
        this.parentChapterId = parentChapterId;
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

    public String getCourseSlug() {
        return courseSlug;
    }

    public void setCourseSlug(String courseSlug) {
        this.courseSlug = courseSlug;
    }

    public String getSessionTitle() {
        return sessionTitle;
    }

    public void setSessionTitle(String sessionTitle) {
        this.sessionTitle = sessionTitle;
    }

    public ApprovalStatus getStatus() {
        return status;
    }

    public void setStatus(ApprovalStatus status) {
        this.status = status;
    }

    public int getSubChaptersCount() {
        return subChaptersCount;
    }

    public void setSubChaptersCount(int subChaptersCount) {
        this.subChaptersCount = subChaptersCount;
    }

    public List<UUID> getSubChapterIds() {
        return subChapterIds;
    }

    public void setSubChapterIds(List<UUID> subChapterIds) {
        this.subChapterIds = subChapterIds;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
