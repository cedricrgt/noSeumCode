package com.codebangers.backend.workshop.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class WorkshopRequest {

    @NotBlank(message = "Workshop title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Size(max = 255, message = "Theme must not exceed 255 characters")
    private String theme;

    private String description;

    private Integer maxParticipants = 6;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    public WorkshopRequest() {
    }

    public WorkshopRequest(String title, String description,
                         LocalDateTime startDate, LocalDateTime endDate) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.maxParticipants = 6;
    }

    public WorkshopRequest(String title, String theme, String description, Integer maxParticipants,
                         LocalDateTime startDate, LocalDateTime endDate) {
        this.title = title;
        this.theme = theme;
        this.description = description;
        this.maxParticipants = maxParticipants != null ? maxParticipants : 6;
        this.startDate = startDate;
        this.endDate = endDate;
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

    public Integer getMaxParticipants() {
        return maxParticipants != null ? maxParticipants : 6;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants != null ? maxParticipants : 6;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
}
