package com.codebangers.backend.course.dto;

public class ChapterRequest {

    private String title;
    private Integer position;

    public ChapterRequest() {
    }

    public ChapterRequest(String title, Integer position) {
        this.title = title;
        this.position = position;
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
}
