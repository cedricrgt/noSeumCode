package com.codebangers.backend.discord.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record DiscordStatusResponse(
        boolean linked,
        String discordUserId,
        String discordUsername,
        String discordAvatar,
        LocalDateTime discordLinkedAt,
        boolean serverJoined,
        List<String> assignedRoleNames,
        String inviteUrl,
        String stageChannelUrl,
        Map<String, String> mangaVoiceChannels
) {
    public DiscordStatusResponse {
        if (mangaVoiceChannels == null) {
            mangaVoiceChannels = Map.of();
        }
    }

    public DiscordStatusResponse(
            boolean linked,
            String discordUserId,
            String discordUsername,
            String discordAvatar,
            LocalDateTime discordLinkedAt,
            boolean serverJoined,
            List<String> assignedRoleNames,
            String inviteUrl
    ) {
        this(linked, discordUserId, discordUsername, discordAvatar, discordLinkedAt,
                serverJoined, assignedRoleNames, inviteUrl, null, Map.of());
    }
}
