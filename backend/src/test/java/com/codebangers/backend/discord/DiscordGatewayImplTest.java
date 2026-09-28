package com.codebangers.backend.discord;

import com.codebangers.backend.discord.dto.DiscordMemberDto;
import com.codebangers.backend.discord.service.DiscordGatewayImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class DiscordGatewayImplTest {

    private DiscordGatewayImpl gateway;

    @BeforeEach
    void setUp() {
        gateway = new DiscordGatewayImpl(
                "mock-bot-token",
                "mock-guild-id",
                "role-starter",
                "role-web",
                "role-vip",
                "role-default",
                "https://discord.gg/noseumcode",
                RestClient.builder()
        );
    }

    @Test
    @DisplayName("Devrait s'initialiser correctement avec les rôles et liens Discord")
    void shouldInitializeCorrectly() {
        assertEquals("https://discord.gg/noseumcode", gateway.getInviteUrl());
        assertEquals("role-starter", gateway.getStarterRoleId());
        assertEquals("role-web", gateway.getWebRoleId());
        assertEquals("role-vip", gateway.getVipRoleId());
        assertEquals("role-default", gateway.getDefaultRoleId());
    }

    @Test
    @DisplayName("Devrait identifier si les identifiants Discord réels sont configurés ou non")
    void shouldDetectIfConfigured() {
        DiscordGatewayImpl unconfigured = new DiscordGatewayImpl(
                "", "", "", "", "", "", "", RestClient.builder()
        );
        assertFalse(unconfigured.isConfigured());

        DiscordGatewayImpl configured = new DiscordGatewayImpl(
                "real-bot-token-secret-12345", "123456789012345678", "s", "w", "v", "d", "invite", RestClient.builder()
        );
        assertTrue(configured.isConfigured());
    }

    @Test
    @DisplayName("Devrait simuler avec succès l'ajout et l'attribution de rôles en mode non configuré")
    void shouldSimulateGracefullyWhenNotConfigured() {
        DiscordGatewayImpl mockGateway = new DiscordGatewayImpl(
                "", "", "s", "w", "v", "d", "invite", RestClient.builder()
        );

        assertTrue(mockGateway.addMemberToGuild("user123", "token123", List.of("s")));
        assertTrue(mockGateway.addRoleToMember("user123", "s"));
        assertTrue(mockGateway.removeRoleFromMember("user123", "s"));

        Optional<DiscordMemberDto> member = mockGateway.getGuildMember("user123");
        assertTrue(member.isPresent());
        assertEquals("user123", member.get().id());
    }
}
