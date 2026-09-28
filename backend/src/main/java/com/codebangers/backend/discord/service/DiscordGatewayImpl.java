package com.codebangers.backend.discord.service;

import com.codebangers.backend.discord.dto.DiscordMemberDto;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.*;

/**
 * Adaptateur d'intégration HTTP avec l'API Discord v10 (ADR-010).
 * Gère l'ajout d'utilisateurs au serveur Discord (OAuth2 access token + guilds.join)
 * et l'attribution dynamique de rôles par le Bot NoSeumCode.
 */
@Component
public class DiscordGatewayImpl implements DiscordGateway {

    private static final Logger log = LoggerFactory.getLogger(DiscordGatewayImpl.class);
    private static final String DISCORD_API_BASE_URL = "https://discord.com/api/v10";

    private final String botToken;
    private final String guildId;
    private final String starterRoleId;
    private final String webRoleId;
    private final String vipRoleId;
    private final String defaultRoleId;
    private final String inviteUrl;
    private final RestClient restClient;

    public DiscordGatewayImpl(
            @Value("${discord.bot.token:}") String botToken,
            @Value("${discord.guild.id:}") String guildId,
            @Value("${discord.roles.starter:}") String starterRoleId,
            @Value("${discord.roles.web:}") String webRoleId,
            @Value("${discord.roles.vip:}") String vipRoleId,
            @Value("${discord.roles.default:}") String defaultRoleId,
            @Value("${discord.community.invite-url:https://discord.gg/noseumcode}") String inviteUrl,
            RestClient.Builder restClientBuilder) {
        this.botToken = botToken != null ? botToken.trim() : "";
        this.guildId = guildId != null ? guildId.trim() : "";
        this.starterRoleId = starterRoleId != null ? starterRoleId.trim() : "";
        this.webRoleId = webRoleId != null ? webRoleId.trim() : "";
        this.vipRoleId = vipRoleId != null ? vipRoleId.trim() : "";
        this.defaultRoleId = defaultRoleId != null ? defaultRoleId.trim() : "";
        this.inviteUrl = inviteUrl != null && !inviteUrl.isBlank() ? inviteUrl.trim() : "https://discord.gg/noseumcode";

        this.restClient = restClientBuilder
                .baseUrl(DISCORD_API_BASE_URL)
                .defaultHeader(HttpHeaders.USER_AGENT, "NoSeumCode-Backend/1.0")
                .build();
    }

    @Override
    public boolean isConfigured() {
        return !botToken.isBlank() && !guildId.isBlank()
                && !"mock-discord-client-id".equalsIgnoreCase(botToken)
                && !"mock".equalsIgnoreCase(botToken);
    }

    @Override
    public boolean addMemberToGuild(String discordUserId, String userAccessToken, List<String> roleIds) {
        if (!isConfigured()) {
            log.info("ℹ️ Discord bot ou guild non configuré (mode mock/dev) : simulation ajout guild pour Discord user {}", discordUserId);
            return true;
        }

        if (discordUserId == null || discordUserId.isBlank() || userAccessToken == null || userAccessToken.isBlank()) {
            log.warn("Tentative d'ajout Discord guild avec identifiants manquants (user: {})", discordUserId);
            return false;
        }

        try {
            Map<String, Object> body = new HashMap<>();
            body.put("access_token", userAccessToken);
            if (roleIds != null && !roleIds.isEmpty()) {
                body.put("roles", roleIds);
            }

            ResponseEntity<JsonNode> response = restClient.put()
                    .uri("/guilds/{guildId}/members/{userId}", guildId, discordUserId)
                    .header(HttpHeaders.AUTHORIZATION, "Bot " + botToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toEntity(JsonNode.class);

            if (response.getStatusCode() == HttpStatus.CREATED) {
                log.info("✅ Apprenant Discord {} ajouté avec succès au serveur Discord (statut 201)", discordUserId);
                return true;
            } else if (response.getStatusCode() == HttpStatus.NO_CONTENT) {
                log.info("ℹ️ L'apprenant Discord {} est déjà membre du serveur (statut 204). Synchronisation des rôles...", discordUserId);
                if (roleIds != null) {
                    for (String roleId : roleIds) {
                        addRoleToMember(discordUserId, roleId);
                    }
                }
                return true;
            }

            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception ex) {
            log.error("❌ Erreur lors de l'ajout du membre Discord {} au serveur : {}", discordUserId, ex.getMessage());
            return false;
        }
    }

    @Override
    public boolean addRoleToMember(String discordUserId, String roleId) {
        if (!isConfigured()) {
            log.info("ℹ️ Discord non configuré : simulation attribution rôle {} pour Discord user {}", roleId, discordUserId);
            return true;
        }

        if (roleId == null || roleId.isBlank()) {
            return false;
        }

        try {
            ResponseEntity<Void> response = restClient.put()
                    .uri("/guilds/{guildId}/members/{userId}/roles/{roleId}", guildId, discordUserId, roleId)
                    .header(HttpHeaders.AUTHORIZATION, "Bot " + botToken)
                    .retrieve()
                    .toBodilessEntity();

            boolean success = response.getStatusCode().is2xxSuccessful();
            if (success) {
                log.info("✅ Rôle Discord {} attribué avec succès à {}", roleId, discordUserId);
            }
            return success;
        } catch (Exception ex) {
            log.error("❌ Erreur lors de l'attribution du rôle Discord {} à {} : {}", roleId, discordUserId, ex.getMessage());
            return false;
        }
    }

    @Override
    public boolean removeRoleFromMember(String discordUserId, String roleId) {
        if (!isConfigured()) {
            log.info("ℹ️ Discord non configuré : simulation retrait rôle {} pour Discord user {}", roleId, discordUserId);
            return true;
        }

        if (roleId == null || roleId.isBlank()) {
            return false;
        }

        try {
            ResponseEntity<Void> response = restClient.delete()
                    .uri("/guilds/{guildId}/members/{userId}/roles/{roleId}", guildId, discordUserId, roleId)
                    .header(HttpHeaders.AUTHORIZATION, "Bot " + botToken)
                    .retrieve()
                    .toBodilessEntity();

            boolean success = response.getStatusCode().is2xxSuccessful();
            if (success) {
                log.info("✅ Rôle Discord {} retiré avec succès pour {}", roleId, discordUserId);
            }
            return success;
        } catch (Exception ex) {
            log.error("❌ Erreur lors du retrait du rôle Discord {} pour {} : {}", roleId, discordUserId, ex.getMessage());
            return false;
        }
    }

    @Override
    public Optional<DiscordMemberDto> getGuildMember(String discordUserId) {
        if (!isConfigured()) {
            return Optional.of(new DiscordMemberDto(discordUserId, "UserMock", null, null, List.of(starterRoleId), "2026-09-28T00:00:00Z"));
        }

        if (discordUserId == null || discordUserId.isBlank()) {
            return Optional.empty();
        }

        try {
            JsonNode node = restClient.get()
                    .uri("/guilds/{guildId}/members/{userId}", guildId, discordUserId)
                    .header(HttpHeaders.AUTHORIZATION, "Bot " + botToken)
                    .retrieve()
                    .body(JsonNode.class);

            if (node == null) {
                return Optional.empty();
            }

            JsonNode userNode = node.path("user");
            String id = userNode.path("id").asText(discordUserId);
            String username = userNode.path("username").asText("");
            String nick = node.hasNonNull("nick") ? node.path("nick").asText() : null;
            String avatar = userNode.hasNonNull("avatar") ? userNode.path("avatar").asText() : null;
            String joinedAt = node.path("joined_at").asText("");

            List<String> roles = new ArrayList<>();
            JsonNode rolesNode = node.path("roles");
            if (rolesNode.isArray()) {
                for (JsonNode r : rolesNode) {
                    roles.add(r.asText());
                }
            }

            return Optional.of(new DiscordMemberDto(id, username, nick, avatar, roles, joinedAt));
        } catch (Exception ex) {
            log.warn("Impossible de récupérer les informations du membre Discord {} sur le serveur : {}", discordUserId, ex.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public String getInviteUrl() {
        return inviteUrl;
    }

    @Override
    public String getStarterRoleId() {
        return starterRoleId;
    }

    @Override
    public String getWebRoleId() {
        return webRoleId;
    }

    @Override
    public String getVipRoleId() {
        return vipRoleId;
    }

    @Override
    public String getDefaultRoleId() {
        return defaultRoleId;
    }
}
