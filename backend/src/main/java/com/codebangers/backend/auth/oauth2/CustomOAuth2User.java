package com.codebangers.backend.auth.oauth2;

import com.codebangers.backend.user.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

/**
 * Wrapper unifié pour les utilisateurs OAuth2 (GitHub, Discord…) et OIDC (Google, Facebook…).
 * Implémente OidcUser (qui étend OAuth2User) pour être compatible avec les deux flux.
 */
public class CustomOAuth2User implements OidcUser {

    private final User user;
    private final Map<String, Object> attributes;
    private final OidcIdToken idToken;
    private final OidcUserInfo userInfo;

    /** Constructeur pour les providers OIDC (Google) */
    public CustomOAuth2User(User user, Map<String, Object> attributes, OidcIdToken idToken, OidcUserInfo userInfo) {
        this.user = user;
        this.attributes = attributes;
        this.idToken = idToken;
        this.userInfo = userInfo;
    }

    /** Constructeur pour les providers OAuth2 classiques (GitHub, Discord) */
    public CustomOAuth2User(User user, Map<String, Object> attributes) {
        this(user, attributes, null, null);
    }

    public User getUser() {
        return user;
    }

    // ── OAuth2User ──────────────────────────────────────────────────────────

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getName() {
        return user.getEmail();
    }

    // ── OidcUser ─────────────────────────────────────────────────────────────

    @Override
    public Map<String, Object> getClaims() {
        return attributes;
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return userInfo;
    }

    @Override
    public OidcIdToken getIdToken() {
        return idToken;
    }
}
