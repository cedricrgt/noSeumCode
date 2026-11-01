package com.codebangers.backend.discord.dto;

import java.util.List;

public record DiscordMemberDto(
        String id,
        String username,
        String nick,
        String avatar,
        List<String> roles,
        String joinedAt
) {}
