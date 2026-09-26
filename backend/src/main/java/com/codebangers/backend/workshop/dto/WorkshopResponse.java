package com.codebangers.backend.workshop.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class WorkshopResponse {

    private UUID id;
    private String title;
    private String theme;
    private String description;
    private Integer maxParticipants;
    private Integer registeredCount;
    private Integer remainingSeats;
    private Boolean isFull;
    private Boolean isUserRegistered;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public WorkshopResponse() {
    }

    public WorkshopResponse(UUID id, String title, String description,
                          LocalDateTime startDate, LocalDateTime endDate,
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.maxParticipants = 6;
        this.registeredCount = 0;
        this.remainingSeats = 6;
        this.isFull = false;
        this.isUserRegistered = false;
    }

    public WorkshopResponse(UUID id, String title, String theme, String description,
                          Integer maxParticipants, Integer registeredCount, Integer remainingSeats,
                          Boolean isFull, Boolean isUserRegistered,
                          LocalDateTime startDate, LocalDateTime endDate,
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.theme = theme;
        this.description = description;
        this.maxParticipants = maxParticipants != null ? maxParticipants : 6;
        this.registeredCount = registeredCount != null ? registeredCount : 0;
        this.remainingSeats = remainingSeats != null ? remainingSeats : Math.max(0, this.maxParticipants - this.registeredCount);
        this.isFull = isFull != null ? isFull : (this.remainingSeats <= 0);
        this.isUserRegistered = isUserRegistered != null ? isUserRegistered : false;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

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

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public Integer getRegisteredCount() {
        return registeredCount;
    }

    public void setRegisteredCount(Integer registeredCount) {
        this.registeredCount = registeredCount;
    }

    public Integer getRemainingSeats() {
        return remainingSeats;
    }

    public void setRemainingSeats(Integer remainingSeats) {
        this.remainingSeats = remainingSeats;
    }

    public Boolean getIsFull() {
        return isFull;
    }

    public void setIsFull(Boolean full) {
        isFull = full;
    }

    public Boolean getIsUserRegistered() {
        return isUserRegistered;
    }

    public void setIsUserRegistered(Boolean userRegistered) {
        isUserRegistered = userRegistered;
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
