package com.codebangers.backend.auth;

import com.codebangers.backend.auth.oauth2.CustomOAuth2User;
import com.codebangers.backend.auth.oauth2.OAuth2AuthenticationSuccessHandler;
import com.codebangers.backend.auth.oauth2.OAuth2RedirectUriFilter;
import com.codebangers.backend.auth.service.RefreshTokenService;
import com.codebangers.backend.config.JwtService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OAuth2AuthenticationSuccessHandlerTest {

    private JwtService jwtService;
    private RefreshTokenService refreshTokenService;
    private OAuth2RedirectUriFilter redirectUriFilter;
    private OAuth2AuthenticationSuccessHandler successHandler;
    private Authentication authentication;
    private User testUser;

    @BeforeEach
    void setUp() {
        jwtService = mock(JwtService.class);
        refreshTokenService = mock(RefreshTokenService.class);
        redirectUriFilter = new OAuth2RedirectUriFilter("https://develop.noseumcode.fr,https://noseumcode.fr,http://localhost:3000");
        successHandler = new OAuth2AuthenticationSuccessHandler(
                jwtService,
                refreshTokenService,
                redirectUriFilter,
                "http://localhost:3000/dashboard.html"
        );

        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setUserName("testuser");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setEmail("test@noseumcode.fr");
        testUser.setRole(Role.STUDENT);

        CustomOAuth2User oAuth2User = new CustomOAuth2User(testUser, Map.of("sub", "12345", "email", "test@noseumcode.fr"));
        authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(oAuth2User);

        when(jwtService.generateToken(testUser)).thenReturn("mock-jwt-token");
        when(refreshTokenService.createRefreshToken(testUser)).thenReturn("mock-refresh-token");
    }

    @Test
    void shouldRedirectToDynamicTargetFromCookieAndClearCookie() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME, "https://develop.noseumcode.fr/dashboard.html"));
        MockHttpServletResponse response = new MockHttpServletResponse();

        successHandler.onAuthenticationSuccess(request, response, authentication);

        String redirectedUrl = response.getRedirectedUrl();
        assertNotNull(redirectedUrl);
        assertTrue(redirectedUrl.startsWith("https://develop.noseumcode.fr/dashboard.html#token=mock-jwt-token"));
        assertTrue(redirectedUrl.contains("refreshToken=mock-refresh-token"));
        assertTrue(redirectedUrl.contains("role=STUDENT"));
        assertTrue(redirectedUrl.contains("userName=testuser"));
        assertTrue(redirectedUrl.contains("firstName=Test"));
        assertTrue(redirectedUrl.contains("email=test%40noseumcode.fr"));

        // Cookie should be cleared in response headers
        String setCookieHeader = response.getHeader("Set-Cookie");
        assertNotNull(setCookieHeader);
        assertTrue(setCookieHeader.contains(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME));
        assertTrue(setCookieHeader.contains("Max-Age=0"));
    }

    @Test
    void shouldRedirectToDynamicTargetFromSessionAndRemoveAttribute() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpSession session = new MockHttpSession();
        session.setAttribute(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME, "https://develop.noseumcode.fr/dashboard.html");
        request.setSession(session);
        MockHttpServletResponse response = new MockHttpServletResponse();

        successHandler.onAuthenticationSuccess(request, response, authentication);

        String redirectedUrl = response.getRedirectedUrl();
        assertNotNull(redirectedUrl);
        assertTrue(redirectedUrl.startsWith("https://develop.noseumcode.fr/dashboard.html#token=mock-jwt-token"));
        assertNull(session.getAttribute(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME));
    }

    @Test
    void shouldFallbackToDefaultRedirectUriWhenNoCookieOrSession() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        successHandler.onAuthenticationSuccess(request, response, authentication);

        String redirectedUrl = response.getRedirectedUrl();
        assertNotNull(redirectedUrl);
        assertTrue(redirectedUrl.startsWith("http://localhost:3000/dashboard.html#token=mock-jwt-token"));
    }

    @Test
    void shouldFallbackToDefaultWhenCookieTargetIsUnauthorized() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME, "https://evil.com/steal"));
        MockHttpServletResponse response = new MockHttpServletResponse();

        successHandler.onAuthenticationSuccess(request, response, authentication);

        String redirectedUrl = response.getRedirectedUrl();
        assertNotNull(redirectedUrl);
        assertTrue(redirectedUrl.startsWith("http://localhost:3000/dashboard.html#token=mock-jwt-token"));
    }
}
