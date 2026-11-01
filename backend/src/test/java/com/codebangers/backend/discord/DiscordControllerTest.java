package com.codebangers.backend.discord;

import com.codebangers.backend.discord.controller.DiscordController;
import com.codebangers.backend.discord.dto.DiscordStatusResponse;
import com.codebangers.backend.discord.service.DiscordGateway;
import com.codebangers.backend.discord.service.DiscordService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiscordControllerTest {

    @Mock
    private DiscordService discordService;

    @Mock
    private UserService userService;

    @Mock
    private DiscordGateway discordGateway;

    private DiscordController controller;
    private User testUser;
    private Jwt mockJwt;

    @BeforeEach
    void setUp() {
        controller = new DiscordController(discordService, userService, discordGateway, "http://localhost:8080");

        testUser = new User("student1", "Jean", "Dupont", "jean@example.com", "hash", Role.STUDENT);
        testUser.setId(UUID.randomUUID());

        mockJwt = mock(Jwt.class);
        lenient().when(mockJwt.getSubject()).thenReturn("jean@example.com");
        lenient().when(mockJwt.getTokenValue()).thenReturn("jwt-token-abc");
    }

    @Test
    @DisplayName("GET /api/discord/status devrait renvoyer 401 si non authentifié")
    void shouldReturn401WhenNotAuthenticatedOnStatus() {
        ResponseEntity<?> response = controller.getStatus(null);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    @DisplayName("GET /api/discord/status devrait renvoyer le statut Discord de l'utilisateur")
    void shouldReturnDiscordStatusForAuthenticatedUser() {
        when(userService.getUserByEmail("jean@example.com")).thenReturn(Optional.of(testUser));
        DiscordStatusResponse status = new DiscordStatusResponse(
                true, "discord-123", "jean_dev", "avatar.png",
                LocalDateTime.now(), true, List.of("Starter"), "https://discord.gg/noseumcode"
        );
        when(discordService.getDiscordStatus(testUser)).thenReturn(status);

        ResponseEntity<?> response = controller.getStatus(mockJwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(status, response.getBody());
    }

    @Test
    @DisplayName("GET /api/discord/link-url devrait générer l'URL OAuth2 de liaison avec le link_token")
    void shouldGenerateLinkUrlWithTokenAndRedirect() {
        ResponseEntity<?> response = controller.getLinkUrl("http://localhost:3000/dashboard.html", mockJwt, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof Map);
        Map<?, ?> map = (Map<?, ?>) response.getBody();
        String url = (String) map.get("url");

        assertNotNull(url);
        assertTrue(url.contains("/oauth2/authorization/discord"));
        assertTrue(url.contains("link_token=jwt-token-abc"));
        assertTrue(url.contains("redirect_uri="));
    }

    @Test
    @DisplayName("POST /api/discord/sync devrait refuser si l'utilisateur n'est pas lié")
    void shouldRejectSyncWhenUserNotLinked() {
        when(userService.getUserByEmail("jean@example.com")).thenReturn(Optional.of(testUser));

        ResponseEntity<?> response = controller.syncRoles(mockJwt);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    @DisplayName("POST /api/discord/sync devrait synchroniser les rôles quand l'utilisateur est lié")
    void shouldSyncRolesWhenUserIsLinked() {
        testUser.setDiscordUserId("discord-123");
        when(userService.getUserByEmail("jean@example.com")).thenReturn(Optional.of(testUser));
        DiscordStatusResponse updated = new DiscordStatusResponse(
                true, "discord-123", "jean_dev", null, null, true, List.of("Web"), "https://discord.gg/noseumcode"
        );
        when(discordService.syncUserRoles(testUser)).thenReturn(updated);

        ResponseEntity<?> response = controller.syncRoles(mockJwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updated, response.getBody());
        verify(discordService).syncUserRoles(testUser);
    }

    @Test
    @DisplayName("POST /api/discord/unlink devrait dissocier le compte Discord")
    void shouldUnlinkDiscordAccount() {
        when(userService.getUserByEmail("jean@example.com")).thenReturn(Optional.of(testUser));

        ResponseEntity<?> response = controller.unlinkDiscord(mockJwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(discordService).unlinkDiscordAccount(testUser);
    }
}
