package com.codebangers.backend.auth;

import com.codebangers.backend.auth.oauth2.OAuth2UserInfo;
import com.codebangers.backend.auth.oauth2.OAuth2UserInfoFactory;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CustomOAuth2UserServiceTest {

    @Test
    void shouldExtractGoogleUserInfoCorrectly() {
        Map<String, Object> attributes = Map.of(
                "sub", "google-12345",
                "name", "Linus Torvalds",
                "given_name", "Linus",
                "family_name", "Torvalds",
                "email", "linus@linux.org",
                "picture", "https://google.com/pic.jpg"
        );

        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo("google", attributes);

        assertEquals("google-12345", userInfo.getId());
        assertEquals("Linus Torvalds", userInfo.getName());
        assertEquals("Linus", userInfo.getFirstName());
        assertEquals("Torvalds", userInfo.getLastName());
        assertEquals("linus@linux.org", userInfo.getEmail());
        assertEquals("https://google.com/pic.jpg", userInfo.getImageUrl());
    }

    @Test
    void shouldExtractGithubUserInfoCorrectly() {
        Map<String, Object> attributes = Map.of(
                "id", 98765,
                "login", "octocat",
                "name", "Mona Lisa Octocat",
                "email", "octocat@github.com",
                "avatar_url", "https://github.com/avatar.png"
        );

        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo("github", attributes);

        assertEquals("98765", userInfo.getId());
        assertEquals("Mona Lisa Octocat", userInfo.getName());
        assertEquals("Mona", userInfo.getFirstName());
        assertEquals("octocat@github.com", userInfo.getEmail());
        assertEquals("https://github.com/avatar.png", userInfo.getImageUrl());
    }

    @Test
    void shouldExtractDiscordUserInfoCorrectly() {
        Map<String, Object> attributes = Map.of(
                "id", "discord-55555",
                "username", "gamer99",
                "global_name", "Gamer Pro",
                "email", "gamer@discord.gg",
                "avatar", "avatar_hash_123"
        );

        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo("discord", attributes);

        assertEquals("discord-55555", userInfo.getId());
        assertEquals("Gamer Pro", userInfo.getName());
        assertEquals("gamer@discord.gg", userInfo.getEmail());
        assertTrue(userInfo.getImageUrl().contains("discordapp.com/avatars/discord-55555/avatar_hash_123.png"));
    }

    @Test
    void shouldExtractFacebookUserInfoCorrectly() {
        Map<String, Object> attributes = Map.of(
                "id", "fb-44444",
                "name", "Mark Zuckerberg",
                "first_name", "Mark",
                "last_name", "Zuckerberg",
                "email", "mark@fb.com"
        );

        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo("facebook", attributes);

        assertEquals("fb-44444", userInfo.getId());
        assertEquals("Mark Zuckerberg", userInfo.getName());
        assertEquals("mark@fb.com", userInfo.getEmail());
    }
}
