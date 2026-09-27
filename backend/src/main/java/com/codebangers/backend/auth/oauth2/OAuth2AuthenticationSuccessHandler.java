package com.codebangers.backend.auth.oauth2;

import com.codebangers.backend.auth.service.RefreshTokenService;
import com.codebangers.backend.config.JwtService;
import com.codebangers.backend.user.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final String defaultRedirectUri;
    private final OAuth2RedirectUriFilter redirectUriFilter;

    public OAuth2AuthenticationSuccessHandler(
            JwtService jwtService,
            @Autowired(required = false) RefreshTokenService refreshTokenService,
            OAuth2RedirectUriFilter redirectUriFilter,
            @Value("${app.oauth2.authorized-redirect-uri:http://localhost:3000/dashboard.html}") String defaultRedirectUri) {
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.redirectUriFilter = redirectUriFilter;
        this.defaultRedirectUri = defaultRedirectUri;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        if (response.isCommitted()) {
            return;
        }

        String targetRedirectUri = resolveTargetRedirectUri(request, response);

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        User user = oAuth2User.getUser();
        String token = jwtService.generateToken(user);
        String refreshToken = (refreshTokenService != null) ? refreshTokenService.createRefreshToken(user) : "";

        String userName = user.getUserName() != null ? user.getUserName() : "";
        String firstName = user.getFirstName() != null ? user.getFirstName() : "";
        String email = user.getEmail() != null ? user.getEmail() : "";

        String targetUrl = UriComponentsBuilder.fromUriString(targetRedirectUri)
                .fragment("token=" + token +
                        "&refreshToken=" + URLEncoder.encode(refreshToken, StandardCharsets.UTF_8) +
                        "&role=" + user.getRole().name() +
                        "&userName=" + URLEncoder.encode(userName, StandardCharsets.UTF_8) +
                        "&firstName=" + URLEncoder.encode(firstName, StandardCharsets.UTF_8) +
                        "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8))
                .build()
                .toUriString();

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String resolveTargetRedirectUri(HttpServletRequest request, HttpServletResponse response) {
        boolean isSecure = request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));

        // 1. Check Cookie
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME.equals(cookie.getName())) {
                    String uri = cookie.getValue();
                    // Delete cookie
                    ResponseCookie deleteCookie = ResponseCookie.from(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME, "")
                            .path("/")
                            .httpOnly(true)
                            .maxAge(0)
                            .sameSite("Lax")
                            .secure(isSecure)
                            .build();
                    response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

                    if (uri != null && redirectUriFilter.isAuthorizedRedirect(uri)) {
                        return uri;
                    }
                }
            }
        }

        // 2. Check Session
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                Object sessionUri = session.getAttribute(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME);
                session.removeAttribute(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME);
                if (sessionUri instanceof String sUri && redirectUriFilter.isAuthorizedRedirect(sUri)) {
                    return sUri;
                }
            }
        } catch (Exception ignored) {
        }

        // 3. Fallback to default
        return defaultRedirectUri;
    }
}
