package com.codebangers.backend.course.dto;

import java.util.UUID;

public class CourseResponse {

    private UUID id;
    private String courseTitle;

    public CourseResponse(UUID id, String courseTitle) {
        this.id = id;
        this.courseTitle = courseTitle;
    }

    // Getters

    public UUID getId() {
        return id;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

}
