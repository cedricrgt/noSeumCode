package com.codebangers.backend.auth;

import com.codebangers.backend.auth.security.AuthRateLimitingFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class AuthRateLimitingFilterTest {

    @Test
    void shouldAllowRequestsUnderRateLimit() throws ServletException, IOException {
        AuthRateLimitingFilter filter = new AuthRateLimitingFilter(true, 5);

        for (int i = 0; i < 5; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
            request.setRemoteAddr("192.168.1.100");
            MockHttpServletResponse response = new MockHttpServletResponse();
            FilterChain chain = mock(FilterChain.class);

            filter.doFilter(request, response, chain);
            assertEquals(200, response.getStatus());
            verify(chain, times(1)).doFilter(request, response);
        }
    }

    @Test
    void shouldBlockRequestExceedingRateLimitWith429() throws ServletException, IOException {
        AuthRateLimitingFilter filter = new AuthRateLimitingFilter(true, 3);

        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 3; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
            request.setRemoteAddr("10.0.0.5");
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
            assertEquals(200, response.getStatus());
        }

        // 4th request must be blocked
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
        request.setRemoteAddr("10.0.0.5");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, chain);

        assertEquals(429, response.getStatus());
        assertEquals("60", response.getHeader("Retry-After"));
        // Filter chain should NOT have been invoked on the 4th call
        verify(chain, times(3)).doFilter(any(), any());
    }

    @Test
    void shouldIgnoreNonSensitiveEndpoints() throws ServletException, IOException {
        AuthRateLimitingFilter filter = new AuthRateLimitingFilter(true, 2);

        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 5; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/courses");
            request.setRemoteAddr("172.16.0.1");
            MockHttpServletResponse response = new MockHttpServletResponse();

            filter.doFilter(request, response, chain);
            assertEquals(200, response.getStatus());
        }

        verify(chain, times(5)).doFilter(any(), any());
    }
}
