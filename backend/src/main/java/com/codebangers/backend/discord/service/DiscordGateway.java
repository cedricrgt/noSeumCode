package com.codebangers.backend.discord.service;

import com.codebangers.backend.discord.dto.DiscordMemberDto;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Port pour l'intégration avec l'API Discord v10 (ADR-010 Ports/Adapters).
 */
public interface DiscordGateway {

    boolean isConfigured();

    boolean addMemberToGuild(String discordUserId, String userAccessToken, List<String> roleIds);

    boolean addRoleToMember(String discordUserId, String roleId);

    boolean removeRoleFromMember(String discordUserId, String roleId);

    Optional<DiscordMemberDto> getGuildMember(String discordUserId);

    String getInviteUrl();

    String getStarterRoleId();

    String getWebRoleId();

    String getVipRoleId();

    String getDefaultRoleId();

    // Salons vocaux et scéniques globaux (Discord Stage & Manga Voice Lounges)
    String getStageStarterChannelId();

    String getStageWebChannelId();

    String getVoiceLuffyChannelId();

    String getVoiceGokuChannelId();

    String getVoiceNarutoChannelId();

    // Salons de scène dédiés par cours (Lives et ateliers pratiques)
    String getStageHtmlCssChannelId();

    String getStageJavascriptChannelId();

    String getStageGitFondationChannelId();

    String getStageGitProChannelId();

    // Liens profonds (Deep links) vers les salons de formation Discord
    String getStarterStageChannelUrl();

    String getWebStageChannelUrl();

    String getHtmlCssStageChannelUrl();

    String getJavascriptStageChannelUrl();

    String getGitDeployStageChannelUrl();

    String getGitCicdStageChannelUrl();

    String getLuffyVoiceChannelUrl();

    String getGokuVoiceChannelUrl();

    String getNarutoVoiceChannelUrl();

    Map<String, String> getMangaVoiceChannelUrls();
}
