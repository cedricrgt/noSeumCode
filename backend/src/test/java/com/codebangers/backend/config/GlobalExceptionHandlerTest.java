package com.codebangers.backend.config;

import com.codebangers.backend.config.exception.ApiError;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    @DisplayName("NoResourceFoundException should return HTTP 404 Not Found")
    void handleNoResourceFound_returns404() {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest("GET", "/actuator/unknown");
        ServletWebRequest request = new ServletWebRequest(mockRequest);
        NoResourceFoundException ex = new NoResourceFoundException(HttpMethod.GET, "Resource not found", "actuator/unknown");

        ResponseEntity<ApiError> response = handler.handleNoResourceFound(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(404);
        assertThat(response.getBody().getError()).isEqualTo("Not Found");
        assertThat(response.getBody().getMessage()).contains("actuator/unknown");
    }

    @Test
    @DisplayName("Generic Exception should return HTTP 500 Internal Server Error")
    void handleGenericException_returns500() {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest("GET", "/api/test");
        ServletWebRequest request = new ServletWebRequest(mockRequest);
        Exception ex = new RuntimeException("Unexpected error");

        ResponseEntity<ApiError> response = handler.handleGenericException(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(500);
        assertThat(response.getBody().getError()).isEqualTo("Internal Server Error");
    }

    @Test
    @DisplayName("IllegalArgumentException should return HTTP 400 Bad Request")
    void handleIllegalArgument_returns400() {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest("GET", "/api/test");
        ServletWebRequest request = new ServletWebRequest(mockRequest);
        IllegalArgumentException ex = new IllegalArgumentException("Invalid argument value");

        ResponseEntity<ApiError> response = handler.handleIllegalArgument(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
        assertThat(response.getBody().getMessage()).isEqualTo("Invalid argument value");
    }
}
