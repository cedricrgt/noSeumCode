package com.codebangers.backend.auth.oauth2;

import com.codebangers.backend.discord.service.DiscordService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;

@Service
@Transactional
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger log = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    private final UserRepository userRepository;
    private final DiscordService discordService;

    public CustomOAuth2UserService(
            UserRepository userRepository,
            @Autowired(required = false) DiscordService discordService) {
        this.userRepository = userRepository;
        this.discordService = discordService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userAccessToken = (userRequest.getAccessToken() != null)
                ? userRequest.getAccessToken().getTokenValue()
                : null;

        try {
            return processOAuth2User(registrationId, oAuth2User, userAccessToken);
        } catch (Exception ex) {
            log.error("Erreur lors du traitement OAuth2 pour provider {}: {}", registrationId, ex.getMessage());
            throw new OAuth2AuthenticationException("Erreur d'authentification OAuth2 : " + ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(String registrationId, OAuth2User oAuth2User, String userAccessToken) {
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());

        if (userInfo.getEmail() == null || userInfo.getEmail().isBlank()) {
            throw new IllegalArgumentException("No email provided by provider: " + registrationId);
        }

        // Cas 1 : Liaison explicite de compte déclenchée par un apprenant connecté (Sprint 11)
        String linkEmail = extractLinkingEmailFromContext();
        User user;

        if (linkEmail != null && !linkEmail.isBlank()) {
            Optional<User> linkedUserOpt = userRepository.findByEmail(linkEmail);
            if (linkedUserOpt.isPresent()) {
                user = linkedUserOpt.get();
                if (registrationId.equalsIgnoreCase("discord") && discordService != null) {
                    user = discordService.linkDiscordAccount(user, userInfo.getId(), userInfo.getName(), userInfo.getImageUrl(), userAccessToken);
                } else {
                    if (userInfo.getImageUrl() != null && !userInfo.getImageUrl().isBlank()) {
                        user.setAvatarUrl(userInfo.getImageUrl());
                    }
                    user.setProvider(registrationId.toUpperCase());
                    user.setProviderId(userInfo.getId());
                    user = userRepository.save(user);
                }
                return new CustomOAuth2User(user, oAuth2User.getAttributes());
            }
        }

        // Cas 2 : Connexion ou inscription standard via OAuth2
        Optional<User> userOptional = userRepository.findByEmail(userInfo.getEmail());

        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (userInfo.getImageUrl() != null && !userInfo.getImageUrl().isBlank()) {
                user.setAvatarUrl(userInfo.getImageUrl());
            }
            if (user.getProvider() == null || user.getProvider().equalsIgnoreCase("LOCAL")) {
                user.setProvider(registrationId.toUpperCase());
                user.setProviderId(userInfo.getId());
            }
            user = userRepository.save(user);
        } else {
            user = registerNewOAuth2User(registrationId, userInfo);
        }

        // Si connexion directe avec Discord, synchroniser automatiquement le compte Discord & serveur
        if (registrationId.equalsIgnoreCase("discord") && discordService != null) {
            try {
                user = discordService.linkDiscordAccount(user, userInfo.getId(), userInfo.getName(), userInfo.getImageUrl(), userAccessToken);
            } catch (Exception ex) {
                log.warn("Liaison automatique Discord non bloquante lors du login pour {}: {}", user.getEmail(), ex.getMessage());
            }
        }

        return new CustomOAuth2User(user, oAuth2User.getAttributes());
    }

    private String extractLinkingEmailFromContext() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                if (request != null) {
                    if (request.getCookies() != null) {
                        for (Cookie c : request.getCookies()) {
                            if (OAuth2RedirectUriFilter.LINK_USER_EMAIL_COOKIE_NAME.equals(c.getName())) {
                                return c.getValue();
                            }
                        }
                    }
                    HttpSession session = request.getSession(false);
                    if (session != null) {
                        Object sessionVal = session.getAttribute(OAuth2RedirectUriFilter.LINK_USER_EMAIL_COOKIE_NAME);
                        if (sessionVal instanceof String s && !s.isBlank()) {
                            return s;
                        }
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private User registerNewOAuth2User(String registrationId, OAuth2UserInfo userInfo) {
        String baseUsername = (userInfo.getFirstName() != null ? userInfo.getFirstName() : "user")
                .toLowerCase()
                .replaceAll("[^a-z0-9]", "");
        if (baseUsername.length() < 3) baseUsername = "user" + baseUsername;

        String finalUsername = baseUsername;
        int count = 1;
        while (userRepository.findByUserName(finalUsername).isPresent()) {
            finalUsername = baseUsername + (count++);
        }

        String firstName = userInfo.getFirstName() != null ? userInfo.getFirstName() : "Apprenant";
        String lastName = userInfo.getLastName() != null ? userInfo.getLastName() : "NoSeumCode";

        User user = new User(
                finalUsername,
                firstName,
                lastName,
                userInfo.getEmail(),
                null, // No password for OAuth2 users
                Role.STUDENT
        );
        user.setProvider(registrationId.toUpperCase());
        user.setProviderId(userInfo.getId());
        user.setAvatarUrl(userInfo.getImageUrl());

        return userRepository.save(user);
    }
}
