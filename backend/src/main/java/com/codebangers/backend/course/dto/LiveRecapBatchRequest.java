package com.codebangers.backend.course.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class LiveRecapBatchRequest {

    private UUID courseId;

    private String courseSlug;

    @NotBlank(message = "Le titre de la session live est obligatoire")
    private String sessionTitle;

    private String summary;

    private String videoUrl;

    @NotEmpty(message = "Au moins un sous-chapitre est requis pour le récapitulatif live")
    @Valid
    private List<LiveRecapSubChapterDto> subChapters = new ArrayList<>();

    public LiveRecapBatchRequest() {
    }

    public LiveRecapBatchRequest(UUID courseId, String courseSlug, String sessionTitle, String summary, String videoUrl, List<LiveRecapSubChapterDto> subChapters) {
        this.courseId = courseId;
        this.courseSlug = courseSlug;
        this.sessionTitle = sessionTitle;
        this.summary = summary;
        this.videoUrl = videoUrl;
        if (subChapters != null) {
            this.subChapters = subChapters;
        }
    }

    public UUID getCourseId() {
        return courseId;
    }

    public void setCourseId(UUID courseId) {
        this.courseId = courseId;
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

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public List<LiveRecapSubChapterDto> getSubChapters() {
        return subChapters;
    }

    public void setSubChapters(List<LiveRecapSubChapterDto> subChapters) {
        this.subChapters = subChapters;
    }
}
