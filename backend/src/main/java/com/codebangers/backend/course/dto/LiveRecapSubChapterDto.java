package com.codebangers.backend.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LiveRecapSubChapterDto {

    @NotBlank(message = "Le titre du sous-chapitre est obligatoire")
    private String title;

    @NotNull(message = "La position du sous-chapitre est obligatoire")
    private Integer position;

    @NotBlank(message = "Le contenu Markdown est obligatoire")
    private String markdownContent;

    private String videoTimestampStart;

    private String mediaUrl;

    public LiveRecapSubChapterDto() {
    }

    public LiveRecapSubChapterDto(String title, Integer position, String markdownContent, String videoTimestampStart, String mediaUrl) {
        this.title = title;
        this.position = position;
        this.markdownContent = markdownContent;
        this.videoTimestampStart = videoTimestampStart;
        this.mediaUrl = mediaUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public String getMarkdownContent() {
        return markdownContent;
    }

    public void setMarkdownContent(String markdownContent) {
        this.markdownContent = markdownContent;
    }

    public String getVideoTimestampStart() {
        return videoTimestampStart;
    }

    public void setVideoTimestampStart(String videoTimestampStart) {
        this.videoTimestampStart = videoTimestampStart;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }
}
