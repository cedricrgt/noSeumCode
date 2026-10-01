package com.codebangers.backend.auth.oauth2;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Filter that intercepts OAuth2 authorization initiation requests (/oauth2/authorization/**)
 * to capture the intended frontend redirect URI (via query param `redirect_uri` or `Referer` header)
 * and safely preserves it in an HTTP-only cookie and session for the OAuth2 callback.
 */
@Component
public class OAuth2RedirectUriFilter extends OncePerRequestFilter {

    public static final String REDIRECT_URI_PARAM = "redirect_uri";
    public static final String REDIRECT_URI_COOKIE_NAME = "oauth2_redirect_uri";
    public static final String LINK_TOKEN_PARAM = "link_token";
    public static final String LINK_USER_EMAIL_COOKIE_NAME = "oauth2_link_email";
    public static final int COOKIE_EXPIRE_SECONDS = 300; // 5 minutes

    private final List<String> authorizedOrigins;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private org.springframework.security.oauth2.jwt.JwtDecoder jwtDecoder;

    public OAuth2RedirectUriFilter(
            @Value("${app.cors.allowed-origins:http://localhost:3000,https://noseumcode.fr,https://www.noseumcode.fr,https://develop.noseumcode.fr}") String corsOrigins) {
        Set<String> origins = Arrays.stream(corsOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toSet());
        origins.add("https://noseumcode.fr");
        origins.add("https://www.noseumcode.fr");
        origins.add("https://develop.noseumcode.fr");
        origins.add("https://*.noseumcode.fr");
        origins.add("http://localhost");
        origins.add("http://localhost:*");
        origins.add("https://localhost");
        origins.add("https://localhost:*");
        origins.add("http://127.0.0.1");
        origins.add("http://127.0.0.1:*");
        origins.add("https://127.0.0.1");
        origins.add("https://127.0.0.1:*");
        origins.add("http://192.168.*");
        origins.add("https://192.168.*");
        origins.add("http://10.*");
        origins.add("https://10.*");
        for (int i = 16; i <= 31; i++) {
            origins.add("http://172." + i + ".*");
            origins.add("https://172." + i + ".*");
        }
        this.authorizedOrigins = new ArrayList<>(origins);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String uri = request.getRequestURI();
        String servletPath = request.getServletPath();
        boolean isOAuthInitiation = (uri != null && uri.contains("/oauth2/authorization/"))
                || (servletPath != null && servletPath.startsWith("/oauth2/authorization/"));

        if (isOAuthInitiation) {
            String redirectUri = request.getParameter(REDIRECT_URI_PARAM);

            if (redirectUri == null || redirectUri.isBlank()) {
                String referer = request.getHeader(HttpHeaders.REFERER);
                if (referer != null && !referer.isBlank()) {
                    try {
                        URI refUri = URI.create(referer);
                        String origin = refUri.getScheme() + "://" + refUri.getAuthority();
                        if (isAuthorizedOrigin(origin)) {
                            redirectUri = origin + "/dashboard.html";
                        }
                    } catch (Exception ignored) {
                    }
                }
            }

            if (redirectUri != null && !redirectUri.isBlank() && isAuthorizedRedirect(redirectUri)) {
                boolean isSecure = request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
                ResponseCookie cookie = ResponseCookie.from(REDIRECT_URI_COOKIE_NAME, redirectUri)
                        .path("/")
                        .httpOnly(true)
                        .maxAge(COOKIE_EXPIRE_SECONDS)
                        .sameSite("Lax")
                        .secure(isSecure)
                        .build();
                response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                try {
                    HttpSession session = request.getSession(true);
                    if (session != null) {
                        session.setAttribute(REDIRECT_URI_COOKIE_NAME, redirectUri);
                    }
                } catch (Exception ignored) {
                }
            }

            // Capture account linking token if present (Sprint 11)
            String linkToken = request.getParameter(LINK_TOKEN_PARAM);
            if (linkToken != null && !linkToken.isBlank() && jwtDecoder != null) {
                try {
                    org.springframework.security.oauth2.jwt.Jwt decodedJwt = jwtDecoder.decode(linkToken);
                    String linkEmail = decodedJwt.getSubject();
                    if (linkEmail != null && !linkEmail.isBlank()) {
                        boolean isSecure = request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
                        ResponseCookie linkCookie = ResponseCookie.from(LINK_USER_EMAIL_COOKIE_NAME, linkEmail)
                                .path("/")
                                .httpOnly(true)
                                .maxAge(COOKIE_EXPIRE_SECONDS)
                                .sameSite("Lax")
                                .secure(isSecure)
                                .build();
                        response.addHeader(HttpHeaders.SET_COOKIE, linkCookie.toString());

                        try {
                            HttpSession session = request.getSession(true);
                            if (session != null) {
                                session.setAttribute(LINK_USER_EMAIL_COOKIE_NAME, linkEmail);
                            }
                        } catch (Exception ignored) {
                        }
                    }
                } catch (Exception ignored) {
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    public boolean isAuthorizedRedirect(String targetUri) {
        if (targetUri == null || targetUri.isBlank()) {
            return false;
        }
        try {
            URI uri = URI.create(targetUri);
            String origin = uri.getScheme() + "://" + uri.getAuthority();
            return isAuthorizedOrigin(origin);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isAuthorizedOrigin(String origin) {
        if (origin == null) return false;
        String normalized = origin.trim().toLowerCase();
        for (String allowed : authorizedOrigins) {
            String allowedNorm = allowed.trim().toLowerCase();
            if (allowedNorm.startsWith("https://*.")) {
                String baseDomain = allowedNorm.substring("https://*.".length());
                if (normalized.startsWith("https://") && (normalized.substring(8).endsWith("." + baseDomain) || normalized.substring(8).equals(baseDomain))) {
                    return true;
                }
            } else if (allowedNorm.contains("*")) {
                if (org.springframework.util.PatternMatchUtils.simpleMatch(allowedNorm, normalized)) {
                    return true;
                }
            } else if (normalized.equals(allowedNorm)) {
                return true;
            }
        }
        return false;
    }
}
