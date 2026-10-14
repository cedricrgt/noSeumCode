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

    // Identifiants des salons (Sprint 29)
    String getStageStarterChannelId();

    String getStageWebChannelId();

    String getVoiceLuffyChannelId();

    String getVoiceGokuChannelId();

    String getVoiceNarutoChannelId();

    // Identifiants des salons Scène par cours (Sprint 31)
    String getStageHtmlCssChannelId();

    String getStageJavascriptChannelId();

    String getStageGitFondationChannelId();

    String getStageGitProChannelId();

    // URLs directes des salons (Sprint 29 & 31)
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
