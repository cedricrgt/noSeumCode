package com.codebangers.backend.auth;

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
        assertTrue(filter.isAuthorizedRedirect("http://localhost:5500/dashboard.html"));
        assertTrue(filter.isAuthorizedRedirect("http://127.0.0.1:5500/dashboard.html"));
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
}
