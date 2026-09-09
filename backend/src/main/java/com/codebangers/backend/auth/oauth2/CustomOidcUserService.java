package com.codebangers.backend.auth.oauth2;

import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service OIDC personnalisé pour les providers qui utilisent OpenID Connect (Google…).
 * Appelé à la place du DefaultOidcUserService pour créer/mettre à jour l'utilisateur en base.
 */
@Service
@Transactional
public class CustomOidcUserService extends OidcUserService {

    private final UserRepository userRepository;

    public CustomOidcUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        try {
            return processOidcUser(registrationId, oidcUser);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException("Erreur d'authentification OIDC : " + ex.getMessage());
        }
    }

    private OidcUser processOidcUser(String registrationId, OidcUser oidcUser) {
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, oidcUser.getAttributes());

        if (userInfo.getEmail() == null || userInfo.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email non fourni par le service OIDC " + registrationId);
        }

        Optional<User> userOptional = userRepository.findByEmail(userInfo.getEmail());
        User user;

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
            user = registerNewOidcUser(registrationId, userInfo);
        }

        return new CustomOAuth2User(user, oidcUser.getAttributes(), oidcUser.getIdToken(), oidcUser.getUserInfo());
    }

    private User registerNewOidcUser(String registrationId, OAuth2UserInfo userInfo) {
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
        String lastName  = userInfo.getLastName()  != null ? userInfo.getLastName()  : "NoSeumCode";

        User user = new User(
                finalUsername,
                firstName,
                lastName,
                userInfo.getEmail(),
                null, // Pas de mot de passe pour OAuth2/OIDC
                Role.STUDENT
        );
        user.setProvider(registrationId.toUpperCase());
        user.setProviderId(userInfo.getId());
        user.setAvatarUrl(userInfo.getImageUrl());

        return userRepository.save(user);
    }
}
