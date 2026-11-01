package com.codebangers.backend.auth.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Gestionnaire d'échec d'authentification OAuth2 (ex: annulation sur Discord).
 * Redirige proprement vers le tableau de bord avec indicateur d'erreur dans le fragment d'URL.
 */
@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationFailureHandler.class);

    private final String defaultRedirectUri;
    private final OAuth2RedirectUriFilter redirectUriFilter;

    public OAuth2AuthenticationFailureHandler(
            OAuth2RedirectUriFilter redirectUriFilter,
            @Value("${app.oauth2.authorized-redirect-uri:http://localhost:3000/dashboard.html}") String defaultRedirectUri) {
        this.redirectUriFilter = redirectUriFilter;
        this.defaultRedirectUri = defaultRedirectUri;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
            throws IOException, ServletException {
        log.warn("Échec d'authentification OAuth2 : {}", exception.getMessage());

        String targetRedirectUri = defaultRedirectUri;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (OAuth2RedirectUriFilter.REDIRECT_URI_COOKIE_NAME.equals(cookie.getName())) {
                    String uri = cookie.getValue();
                    if (uri != null && redirectUriFilter.isAuthorizedRedirect(uri)) {
                        targetRedirectUri = uri;
                    }
                    break;
                }
            }
        }

        String targetUrl = targetRedirectUri.contains("#")
                ? targetRedirectUri + "&discord_error=access_denied"
                : targetRedirectUri + "#discord_error=access_denied";

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
