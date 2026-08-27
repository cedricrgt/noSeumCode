package com.codebangers.backend.auth.oauth2;

import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        try {
            return processOAuth2User(registrationId, oAuth2User);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException("Erreur d'authentification OAuth2 : " + ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(String registrationId, OAuth2User oAuth2User) {
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());

        if (userInfo.getEmail() == null || userInfo.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email non fourni par le service " + registrationId);
        }

        Optional<User> userOptional = userRepository.findByEmail(userInfo.getEmail());
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Mettre à jour les informations de profil si nécessaire
            if (userInfo.getImageUrl() != null && !userInfo.getImageUrl().isBlank()) {
                user.setAvatarUrl(userInfo.getImageUrl());
            }
            if (user.getProvider() == null || user.getProvider().equalsIgnoreCase("LOCAL")) {
                user.setProvider(registrationId.toUpperCase());
                user.setProviderId(userInfo.getId());
            }
            user = userRepository.save(user);
        } else {
            // Créer un nouvel utilisateur avec le rôle STUDENT par défaut
            user = registerNewOAuth2User(registrationId, userInfo);
        }

        return new CustomOAuth2User(user, oAuth2User.getAttributes());
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
                null, // Pas de mot de passe requis pour OAuth2
                Role.STUDENT
        );
        user.setProvider(registrationId.toUpperCase());
        user.setProviderId(userInfo.getId());
        user.setAvatarUrl(userInfo.getImageUrl());

        return userRepository.save(user);
    }
}
