package com.codebangers.backend.workshop.dto;

import java.util.UUID;

public class UserWorkshopRequest {

    private UUID userId;
    private UUID workshopId;

    public UserWorkshopRequest() {
    }

    public UserWorkshopRequest(UUID userId, UUID workshopId) {
        this.userId = userId;
        this.workshopId = workshopId;
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
}
