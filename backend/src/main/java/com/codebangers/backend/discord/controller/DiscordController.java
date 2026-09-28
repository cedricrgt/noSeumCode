package com.codebangers.backend.discord.controller;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.discord.dto.DiscordStatusResponse;
import com.codebangers.backend.discord.service.DiscordGateway;
import com.codebangers.backend.discord.service.DiscordService;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * Endpoints REST pour la gestion de l'intégration Discord et de la communauté apprenante.
 */
@RestController
@RequestMapping("/api/discord")
public class DiscordController {

    private static final Logger log = LoggerFactory.getLogger(DiscordController.class);

    private final DiscordService discordService;
    private final UserService userService;
    private final DiscordGateway discordGateway;
    private final String backendBaseUrl;

    public DiscordController(
            DiscordService discordService,
            UserService userService,
            DiscordGateway discordGateway,
            @Value("${app.backend.url:${SERVER_URL:https://api.noseumcode.fr}}") String backendBaseUrl) {
        this.discordService = discordService;
        this.userService = userService;
        this.discordGateway = discordGateway;
        this.backendBaseUrl = backendBaseUrl;
    }

    /**
     * Récupère le statut Discord du compte apprenant actuellement connecté.
     */
    @GetMapping("/status")
    public ResponseEntity<?> getStatus(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentification requise pour consulter le statut Discord."));
        }

        String email = jwt.getSubject();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));

        DiscordStatusResponse status = discordService.getDiscordStatus(user);
        return ResponseEntity.ok(status);
    }

    /**
     * Génère l'URL d'autorisation OAuth2 pour lier le compte Discord de l'utilisateur connecté.
     */
    @GetMapping("/link-url")
    public ResponseEntity<?> getLinkUrl(
            @RequestParam(value = "redirect_uri", required = false) String redirectUri,
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest request) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentification requise pour générer l'URL de liaison Discord."));
        }

        String token = jwt.getTokenValue();
        String targetRedirect = (redirectUri != null && !redirectUri.isBlank())
                ? redirectUri
                : "https://noseumcode.fr/dashboard.html";

        String effectiveBaseUrl = resolveBaseUrl(request);

        String linkUrl = UriComponentsBuilder.fromUriString(effectiveBaseUrl)
                .path("/oauth2/authorization/discord")
                .queryParam("redirect_uri", URLEncoder.encode(targetRedirect, StandardCharsets.UTF_8))
                .queryParam("link_token", token)
                .build()
                .toUriString();

        return ResponseEntity.ok(Map.of("url", linkUrl));
    }

    private String resolveBaseUrl(HttpServletRequest request) {
        if (request != null) {
            String forwardedProto = request.getHeader("X-Forwarded-Proto");
            String forwardedHost = request.getHeader("X-Forwarded-Host");
            if (forwardedHost != null && !forwardedHost.isBlank()) {
                String proto = (forwardedProto != null && !forwardedProto.isBlank()) ? forwardedProto : "https";
                return proto + "://" + forwardedHost;
            }
        }
        return backendBaseUrl;
    }

    /**
     * Resynchronise manuellement les rôles Discord de l'apprenant (ex: après paiement ou adhésion).
     */
    @PostMapping("/sync")
    public ResponseEntity<?> syncRoles(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentification requise pour synchroniser les rôles Discord."));
        }

        String email = jwt.getSubject();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));

        if (!user.isDiscordLinked()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Votre compte NoSeumCode n'est pas encore lié à Discord."));
        }

        DiscordStatusResponse updatedStatus = discordService.syncUserRoles(user);
        return ResponseEntity.ok(updatedStatus);
    }

    /**
     * Dissocie le compte Discord du compte NoSeumCode.
     */
    @PostMapping("/unlink")
    public ResponseEntity<?> unlinkDiscord(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentification requise pour dissocier Discord."));
        }

        String email = jwt.getSubject();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));

        discordService.unlinkDiscordAccount(user);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Votre compte Discord a été dissocié avec succès."
        ));
    }
}
