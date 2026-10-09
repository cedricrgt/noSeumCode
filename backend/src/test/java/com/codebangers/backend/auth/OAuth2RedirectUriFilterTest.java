package com.codebangers.backend.auth;

import com.codebangers.backend.auth.oauth2.CustomOAuth2UserService;
import com.codebangers.backend.auth.oauth2.CustomOidcUserService;
import com.codebangers.backend.auth.oauth2.OAuth2AuthenticationSuccessHandler;
import com.codebangers.backend.auth.oauth2.OAuth2RedirectUriFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OAuth2RedirectUriFilterTest {

    private OAuth2RedirectUriFilter filter;

    @BeforeEach
    void setUp() {
        filter = new OAuth2RedirectUriFilter("http://localhost:3000,https://noseumcode.fr,https://develop.noseumcode.fr");
    }

    @Test
    void shouldAuthorizeValidOrigins() {
        assertTrue(filter.isAuthorizedRedirect("https://develop.noseumcode.fr/dashboard.html"));
        assertTrue(filter.isAuthorizedRedirect("https://noseumcode.fr/dashboard.html"));
        assertTrue(filter.isAuthorizedRedirect("https://test.noseumcode.fr/dashboard.html"));
        assertTrue(filter.isAuthorizedRedirect("http://localhost:3000/dashboard.html"));
        assertTrue(filter.isAuthorizedRedirect("http://127.0.0.1:3000/dashboard.html"));
        assertTrue(filter.isAuthorizedRedirect("http://localhost:5500/dashboard.html"));
        assertTrue(filter.isAuthorizedRedirect("http://127.0.0.1:5500/dashboard.html"));
        assertTrue(filter.isAuthorizedRedirect("http://localhost:5173/dashboard.html"));
        assertTrue(filter.isAuthorizedRedirect("http://192.168.1.9:3000/dashboard.html"));
        assertTrue(filter.isAuthorizedRedirect("http://192.168.0.10:5173/dashboard.html"));
        assertTrue(filter.isAuthorizedRedirect("http://10.0.0.1:3000/dashboard.html"));
        assertTrue(filter.isAuthorizedRedirect("http://172.20.10.2:3000/dashboard.html"));
    }

    @Test
    void shouldRejectUnauthorizedOrigins() {
        assertFalse(filter.isAuthorizedRedirect("https://evil-noseumcode.fr/dashboard.html"));
        assertFalse(filter.isAuthorizedRedirect("https://attacker.com/dashboard.html"));
        assertFalse(filter.isAuthorizedRedirect("https://noseumcode.fr.attacker.com/dashboard.html"));
        assertFalse(filter.isAuthorizedRedirect("javascript:alert(1)"));
        assertFalse(filter.isAuthorizedRedirect("/relative/path"));
        assertFalse(filter.isAuthorizedRedirect(""));
        assertFalse(filter.isAuthorizedRedirect(null));
    }

    @Test
    void shouldSetCookieAndSessionWhenValidRedirectUriParamProvided() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/oauth2/authorization/google");
        request.setParameter("redirect_uri", "https://develop.noseumcode.fr/dashboard.html");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        verify(chain, times(1)).doFilter(request, response);

        Cookie cookie = response.getCookie(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME);
        assertNotNull(cookie);
        assertEquals("https://develop.noseumcode.fr/dashboard.html", cookie.getValue());
        assertTrue(cookie.isHttpOnly());

        HttpSession session = request.getSession(false);
        assertNotNull(session);
        assertEquals("https://develop.noseumcode.fr/dashboard.html",
                session.getAttribute(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME));
    }

    @Test
    void shouldNotSetCookieWhenRedirectUriIsUnauthorized() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/oauth2/authorization/google");
        request.setParameter("redirect_uri", "https://evil.com/phish");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        verify(chain, times(1)).doFilter(request, response);
        assertNull(response.getCookie(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME));
    }

    @Test
    void shouldFallbackToRefererWhenRedirectUriParamNotProvided() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/oauth2/authorization/discord");
        request.addHeader("Referer", "https://develop.noseumcode.fr/workshops.html");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        verify(chain, times(1)).doFilter(request, response);
        Cookie cookie = response.getCookie(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME);
        assertNotNull(cookie);
        assertEquals("https://develop.noseumcode.fr/dashboard.html", cookie.getValue());
    }

    @Test
    void shouldIgnoreNonOAuthRoutes() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/courses");
        request.setParameter("redirect_uri", "https://develop.noseumcode.fr/dashboard.html");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        verify(chain, times(1)).doFilter(request, response);
        assertNull(response.getCookie(OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME));
    }

    @Test
    void shouldAllowLanAndLocalhostCorsOriginsInSecurityConfig() {
        com.codebangers.backend.config.SecurityConfig config = new com.codebangers.backend.config.SecurityConfig(
                null, null, null, null, null, "https://noseumcode.fr"
        );
        org.springframework.web.cors.CorsConfigurationSource source = config.corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/auth/login");
        org.springframework.web.cors.CorsConfiguration cors = source.getCorsConfiguration(request);
        assertNotNull(cors);
        assertEquals("http://192.168.1.9:3000", cors.checkOrigin("http://192.168.1.9:3000"));
        assertEquals("http://localhost:3000", cors.checkOrigin("http://localhost:3000"));
        assertEquals("http://localhost:5173", cors.checkOrigin("http://localhost:5173"));
        assertEquals("http://127.0.0.1:8080", cors.checkOrigin("http://127.0.0.1:8080"));
        assertEquals("http://10.0.0.4:3000", cors.checkOrigin("http://10.0.0.4:3000"));
        assertEquals("http://172.20.1.5:3000", cors.checkOrigin("http://172.20.1.5:3000"));
        assertNull(cors.checkOrigin("https://evil.com"));
        assertNull(cors.checkOrigin("http://185.199.108.153:3000"));
    }

    @Test
    void shouldEnforceStrictProductionCorsOriginsInSecurityConfig() {
        org.springframework.mock.env.MockEnvironment env = new org.springframework.mock.env.MockEnvironment();
        env.setActiveProfiles("prod");

        com.codebangers.backend.config.SecurityConfig config = new com.codebangers.backend.config.SecurityConfig(
                null, null, null, null, null, "https://noseumcode.fr,https://www.noseumcode.fr,https://develop.noseumcode.fr", env
        );
        org.springframework.web.cors.CorsConfigurationSource source = config.corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/auth/login");
        org.springframework.web.cors.CorsConfiguration cors = source.getCorsConfiguration(request);
        assertNotNull(cors);

        // Allowed production & staging origins
        assertEquals("https://noseumcode.fr", cors.checkOrigin("https://noseumcode.fr"));
        assertEquals("https://www.noseumcode.fr", cors.checkOrigin("https://www.noseumcode.fr"));
        assertEquals("https://develop.noseumcode.fr", cors.checkOrigin("https://develop.noseumcode.fr"));

        // Strictly forbidden in production (wildcards, localhost, LAN IPs, arbitrary domains)
        assertNull(cors.checkOrigin("https://evil.com"));
        assertNull(cors.checkOrigin("https://sub.noseumcode.fr"));
        assertNull(cors.checkOrigin("http://localhost:3000"));
        assertNull(cors.checkOrigin("http://127.0.0.1:8080"));
        assertNull(cors.checkOrigin("http://192.168.1.9:3000"));
        assertNull(cors.checkOrigin("http://10.0.0.4:3000"));
        assertNull(cors.checkOrigin("http://172.20.1.5:3000"));
    }

    @Test
    void shouldHaveAutowiredConstructorInSecurityConfig() throws NoSuchMethodException {
        java.lang.reflect.Constructor<com.codebangers.backend.config.SecurityConfig> constructor =
                com.codebangers.backend.config.SecurityConfig.class.getConstructor(
                        CustomOAuth2UserService.class,
                        CustomOidcUserService.class,
                        OAuth2AuthenticationSuccessHandler.class,
                        com.codebangers.backend.auth.oauth2.OAuth2AuthenticationFailureHandler.class,
                        OAuth2RedirectUriFilter.class,
                        String.class,
                        org.springframework.core.env.Environment.class
                );
        assertNotNull(constructor);
        assertTrue(constructor.isAnnotationPresent(org.springframework.beans.factory.annotation.Autowired.class));
    }
}

