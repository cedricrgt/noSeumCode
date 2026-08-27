package com.codebangers.backend.workshop.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserWorkshopResponse {

    private UUID id;
    private UUID userId;
    private UUID workshopId;
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
