package com.codebangers.backend.course.dto;

import java.util.UUID;

public class EnrollmentRequest {

    private UUID userId;
    private UUID courseId;

    public EnrollmentRequest() {
    }

    public EnrollmentRequest(UUID userId, UUID courseId) {
        this.userId = userId;
        this.courseId = courseId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getCourseId() {
        return courseId;
    }

    public void setCourseId(UUID courseId) {
        this.courseId = courseId;
    }
}
