package com.codebangers.backend.cohort.dto;

import com.codebangers.backend.cohort.model.CohortStatus;
import com.codebangers.backend.course.model.EnrollmentTier;

import java.time.LocalDateTime;
import java.util.UUID;

public class CohortResponse {

    private UUID id;
    private String name;
    private String slug;
    private String description;
    private EnrollmentTier tier;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxStudents;
    private CohortStatus status;
    private long enrolledCount;
    private int remainingSeats;
    private boolean isFull;
    private UUID createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CohortResponse() {
    }

    public CohortResponse(UUID id, String name, String slug, String description,
                          EnrollmentTier tier, LocalDateTime startDate, LocalDateTime endDate,
                          Integer maxStudents, CohortStatus status, long enrolledCount,
                          UUID createdById, String createdByName,
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.tier = tier;
        this.startDate = startDate;
        this.endDate = endDate;
        this.maxStudents = maxStudents != null ? maxStudents : 6;
        this.status = status;
        this.enrolledCount = enrolledCount;
        this.remainingSeats = Math.max(0, this.maxStudents - (int) enrolledCount);
        this.isFull = this.remainingSeats <= 0;
        this.createdById = createdById;
        this.createdByName = createdByName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public EnrollmentTier getTier() {
        return tier;
    }

    public void setTier(EnrollmentTier tier) {
        this.tier = tier;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Integer getMaxStudents() {
        return maxStudents;
    }

    public void setMaxStudents(Integer maxStudents) {
        this.maxStudents = maxStudents;
        this.remainingSeats = Math.max(0, (maxStudents != null ? maxStudents : 6) - (int) this.enrolledCount);
        this.isFull = this.remainingSeats <= 0;
    }

    public CohortStatus getStatus() {
        return status;
    }

    public void setStatus(CohortStatus status) {
        this.status = status;
    }

    public long getEnrolledCount() {
        return enrolledCount;
    }

    public void setEnrolledCount(long enrolledCount) {
        this.enrolledCount = enrolledCount;
        this.remainingSeats = Math.max(0, (this.maxStudents != null ? this.maxStudents : 6) - (int) enrolledCount);
        this.isFull = this.remainingSeats <= 0;
    }

    public int getRemainingSeats() {
        return remainingSeats;
    }

    public void setRemainingSeats(int remainingSeats) {
        this.remainingSeats = remainingSeats;
    }

    public boolean isFull() {
        return isFull;
    }

    public void setFull(boolean isFull) {
        this.isFull = isFull;
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
