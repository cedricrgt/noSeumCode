package com.codebangers.backend.course.dto;

import com.codebangers.backend.content.model.Content.ContentType;

public class ContentRequest {

    private ContentType contentType;
    private String body;
    private String mediaUrl;
    private Integer position;

    public ContentRequest() {
    }

    public ContentRequest(ContentType contentType, String body, String mediaUrl, Integer position) {
        this.contentType = contentType;
        this.body = body;
        this.mediaUrl = mediaUrl;
        this.position = position;
    }

    public ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }
}
