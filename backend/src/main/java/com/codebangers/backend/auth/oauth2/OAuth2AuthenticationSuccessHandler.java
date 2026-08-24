package com.codebangers.backend.auth.oauth2;

import com.codebangers.backend.config.JwtService;
import com.codebangers.backend.user.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
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
    private final String redirectUri;

    public OAuth2AuthenticationSuccessHandler(
            JwtService jwtService,
            @Value("${app.oauth2.authorized-redirect-uri:http://localhost:3000/dashboard.html}") String redirectUri) {
        this.jwtService = jwtService;
        this.redirectUri = redirectUri;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        if (response.isCommitted()) {
            return;
        }

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        User user = oAuth2User.getUser();
        String token = jwtService.generateToken(user);

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .fragment("token=" + token +
                        "&role=" + user.getRole().name() +
                        "&userName=" + URLEncoder.encode(user.getUserName(), StandardCharsets.UTF_8) +
                        "&firstName=" + URLEncoder.encode(user.getFirstName(), StandardCharsets.UTF_8))
                .build()
                .toUriString();

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
