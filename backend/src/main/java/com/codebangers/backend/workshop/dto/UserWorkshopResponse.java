package com.codebangers.backend.workshop.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserWorkshopResponse {

    private UUID id;
    private UUID userId;
    private UUID workshopId;
    private String workshopTitle;
    private String workshopTheme;
    private String workshopDescription;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime registeredAt;
    private Boolean attended;

    public UserWorkshopResponse() {
    }

    public UserWorkshopResponse(UUID id, UUID userId, UUID workshopId,
                              LocalDateTime registeredAt, Boolean attended) {
        this.id = id;
        this.userId = userId;
        this.workshopId = workshopId;
        this.registeredAt = registeredAt;
        this.attended = attended;
    }

    public UserWorkshopResponse(UUID id, UUID userId, UUID workshopId,
                              String workshopTitle, String workshopTheme, String workshopDescription,
                              LocalDateTime startDate, LocalDateTime endDate,
                              LocalDateTime registeredAt, Boolean attended) {
        this.id = id;
        this.userId = userId;
        this.workshopId = workshopId;
        this.workshopTitle = workshopTitle;
        this.workshopTheme = workshopTheme;
        this.workshopDescription = workshopDescription;
        this.startDate = startDate;
        this.endDate = endDate;
        this.registeredAt = registeredAt;
        this.attended = attended;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getWorkshopId() {
        return workshopId;
    }

    public void setWorkshopId(UUID workshopId) {
        this.workshopId = workshopId;
    }

    public String getWorkshopTitle() {
        return workshopTitle;
    }

    public void setWorkshopTitle(String workshopTitle) {
        this.workshopTitle = workshopTitle;
    }

    public String getWorkshopTheme() {
        return workshopTheme;
    }

    public void setWorkshopTheme(String workshopTheme) {
        this.workshopTheme = workshopTheme;
    }

    public String getWorkshopDescription() {
        return workshopDescription;
    }

    public void setWorkshopDescription(String workshopDescription) {
        this.workshopDescription = workshopDescription;
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

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public Boolean getAttended() {
        return attended;
    }

    public void setAttended(Boolean attended) {
        this.attended = attended;
    }
}
