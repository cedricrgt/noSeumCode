package com.codebangers.backend.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CourseRequest {

    @NotBlank(message = "Course title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;
    private String description;

    private Long priceInCents;
    private String currency;
    private String slug;
    private String thumbnailUrl;
    private String level;
    private Boolean isPublished;

    // Constructors

    public CourseRequest() {
    }

    public CourseRequest(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public CourseRequest(String title, String description, Long priceInCents, String currency, String slug, String thumbnailUrl, String level, Boolean isPublished) {
        this.title = title;
        this.description = description;
        this.priceInCents = priceInCents;
        this.currency = currency;
        this.slug = slug;
        this.thumbnailUrl = thumbnailUrl;
        this.level = level;
        this.isPublished = isPublished;
    }

    // Getters & Setters

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getPriceInCents() {
        return priceInCents;
    }

    public void setPriceInCents(Long priceInCents) {
        this.priceInCents = priceInCents;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }
}
