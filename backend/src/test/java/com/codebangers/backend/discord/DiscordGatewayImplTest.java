package com.codebangers.backend.discord;

import com.codebangers.backend.discord.dto.DiscordMemberDto;
import com.codebangers.backend.discord.service.DiscordGatewayImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class DiscordGatewayImplTest {

    private DiscordGatewayImpl gateway;

    @BeforeEach
    void setUp() {
        gateway = new DiscordGatewayImpl(
                "mock-bot-token",
                "111222333444",
                "role-starter",
                "role-web",
                "role-vip",
                "role-default",
                "https://discord.gg/noseumcode",
                "chan-stage-starter-101",
                "chan-stage-web-102",
                "chan-voice-luffy-201",
                "chan-voice-goku-202",
                "chan-voice-naruto-203",
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
        assertEquals("chan-stage-starter-101", gateway.getStageStarterChannelId());
        assertEquals("chan-stage-web-102", gateway.getStageWebChannelId());
        assertEquals("chan-voice-luffy-201", gateway.getVoiceLuffyChannelId());
        assertEquals("chan-voice-goku-202", gateway.getVoiceGokuChannelId());
        assertEquals("chan-voice-naruto-203", gateway.getVoiceNarutoChannelId());
    }

    @Test
    @DisplayName("Devrait construire les URLs profondes directes des salons Scène et salons Manga")
    void shouldConstructDirectChannelUrls() {
        assertEquals("https://discord.com/channels/111222333444/chan-stage-starter-101", gateway.getStarterStageChannelUrl());
        assertEquals("https://discord.com/channels/111222333444/chan-stage-web-102", gateway.getWebStageChannelUrl());
        assertEquals("https://discord.com/channels/111222333444/chan-voice-luffy-201", gateway.getLuffyVoiceChannelUrl());
        assertEquals("https://discord.com/channels/111222333444/chan-voice-goku-202", gateway.getGokuVoiceChannelUrl());
        assertEquals("https://discord.com/channels/111222333444/chan-voice-naruto-203", gateway.getNarutoVoiceChannelUrl());

        Map<String, String> mangaUrls = gateway.getMangaVoiceChannelUrls();
        assertNotNull(mangaUrls);
        assertEquals("https://discord.com/channels/111222333444/chan-voice-luffy-201", mangaUrls.get("luffyCodeLabUrl"));
        assertEquals("https://discord.com/channels/111222333444/chan-voice-goku-202", mangaUrls.get("gokuDojoLiveUrl"));
        assertEquals("https://discord.com/channels/111222333444/chan-voice-naruto-203", mangaUrls.get("narutoTeamHubUrl"));
    }

    @Test
    @DisplayName("Devrait se replier sur inviteUrl quand les identifiants de salons sont vides")
    void shouldFallbackToInviteUrlWhenChannelsEmpty() {
        DiscordGatewayImpl fallbackGateway = new DiscordGatewayImpl(
                "mock-bot-token",
                "111222333444",
                "role-starter",
                "role-web",
                "role-vip",
                "role-default",
                "https://discord.gg/noseumcode",
                "",
                "",
                "",
                "",
                "",
                RestClient.builder()
        );

        assertEquals("https://discord.gg/noseumcode", fallbackGateway.getStarterStageChannelUrl());
        assertEquals("https://discord.gg/noseumcode", fallbackGateway.getWebStageChannelUrl());
        assertEquals("https://discord.gg/noseumcode", fallbackGateway.getLuffyVoiceChannelUrl());
        assertEquals("https://discord.gg/noseumcode", fallbackGateway.getGokuVoiceChannelUrl());
        assertEquals("https://discord.gg/noseumcode", fallbackGateway.getNarutoVoiceChannelUrl());
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
