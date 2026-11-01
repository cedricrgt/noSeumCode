package com.codebangers.backend.auth.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Component
@Order(1)
public class AuthRateLimitingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AuthRateLimitingFilter.class);

    private final boolean enabled;
    private final int maxRequestsPerMinute;
    private final Map<String, ConcurrentLinkedQueue<Long>> requestLogByIp = new ConcurrentHashMap<>();

    public AuthRateLimitingFilter(
            @Value("${app.security.rate-limiting.enabled:true}") boolean enabled,
            @Value("${app.security.rate-limiting.max-per-minute:15}") int maxRequestsPerMinute) {
        this.enabled = enabled;
        this.maxRequestsPerMinute = maxRequestsPerMinute;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (!enabled) {
            return true;
        }

        String path = request.getRequestURI();
        if (path == null) {
            return true;
        }

        // Apply rate limit specifically to sensitive auth actions (login, register, forgot-password, reset-password)
        boolean isSensitiveAuthEndpoint = path.equals("/api/auth/login") ||
                path.equals("/api/auth/register") ||
                path.equals("/api/auth/forgot-password") ||
                path.equals("/api/auth/reset-password");

        return !isSensitiveAuthEndpoint || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String clientIp = extractClientIp(request);
        long now = System.currentTimeMillis();
        long windowStart = now - 60_000L; // 1 minute window

        ConcurrentLinkedQueue<Long> timestamps = requestLogByIp.computeIfAbsent(clientIp, k -> new ConcurrentLinkedQueue<>());

        // Evict timestamps older than 1 minute
        while (!timestamps.isEmpty() && timestamps.peek() < windowStart) {
            timestamps.poll();
        }

        if (timestamps.size() >= maxRequestsPerMinute) {
            log.warn("Rate limit d'authentification dépassé pour l'IP {} sur {}", clientIp, request.getRequestURI());
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Retry-After", "60");
            response.getWriter().write("{\"message\": \"Trop de tentatives. Veuillez patienter une minute avant de réessayer.\"}");
            return;
        }

        timestamps.add(now);
        filterChain.doFilter(request, response);
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }
}
