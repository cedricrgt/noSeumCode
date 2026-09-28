package com.codebangers.backend.discord.dto;

import java.time.LocalDateTime;
import java.util.List;

public record DiscordStatusResponse(
        boolean linked,
        String discordUserId,
        String discordUsername,
        String discordAvatar,
        LocalDateTime discordLinkedAt,
        boolean serverJoined,
        List<String> assignedRoleNames,
        String inviteUrl
) {}
