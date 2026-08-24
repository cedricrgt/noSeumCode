package com.codebangers.backend.auth.oauth2;

import java.util.Map;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equalsIgnoreCase("google")) {
            return new GoogleOAuth2UserInfo(attributes);
        } else if (registrationId.equalsIgnoreCase("github")) {
            return new GithubOAuth2UserInfo(attributes);
        } else if (registrationId.equalsIgnoreCase("facebook")) {
            return new FacebookOAuth2UserInfo(attributes);
        } else if (registrationId.equalsIgnoreCase("discord")) {
            return new DiscordOAuth2UserInfo(attributes);
        } else {
            throw new IllegalArgumentException("Fournisseur de connexion non supporté : " + registrationId);
        }
    }

    public static class GoogleOAuth2UserInfo extends OAuth2UserInfo {
        public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
            super(attributes);
        }

        @Override
        public String getId() {
            return (String) attributes.get("sub");
        }

        @Override
        public String getName() {
            return (String) attributes.get("name");
        }

        @Override
        public String getFirstName() {
            return (String) attributes.get("given_name");
        }

        @Override
        public String getLastName() {
            return (String) attributes.get("family_name");
        }

        @Override
        public String getEmail() {
            return (String) attributes.get("email");
        }

        @Override
        public String getImageUrl() {
            return (String) attributes.get("picture");
        }
    }

    public static class GithubOAuth2UserInfo extends OAuth2UserInfo {
        public GithubOAuth2UserInfo(Map<String, Object> attributes) {
            super(attributes);
        }

        @Override
        public String getId() {
            return String.valueOf(attributes.get("id"));
        }

        @Override
        public String getName() {
            return (String) attributes.get("name");
        }

        @Override
        public String getFirstName() {
            String name = (String) attributes.get("name");
            if (name != null && name.contains(" ")) {
                return name.split(" ")[0];
            }
            return (String) attributes.get("login");
        }

        @Override
        public String getLastName() {
            String name = (String) attributes.get("name");
            if (name != null && name.contains(" ")) {
                String[] parts = name.split(" ");
                return parts[parts.length - 1];
            }
            return "Dev";
        }

        @Override
        public String getEmail() {
            String email = (String) attributes.get("email");
            if (email == null || email.isBlank()) {
                // Fallback username-based email if private on GitHub
                return attributes.get("login") + "@users.noreply.github.com";
            }
            return email;
        }

        @Override
        public String getImageUrl() {
            return (String) attributes.get("avatar_url");
        }
    }

    public static class FacebookOAuth2UserInfo extends OAuth2UserInfo {
        public FacebookOAuth2UserInfo(Map<String, Object> attributes) {
            super(attributes);
        }

        @Override
        public String getId() {
            return (String) attributes.get("id");
        }

        @Override
        public String getName() {
            return (String) attributes.get("name");
        }

        @Override
        public String getFirstName() {
            return (String) attributes.get("first_name");
        }

        @Override
        public String getLastName() {
            return (String) attributes.get("last_name");
        }

        @Override
        public String getEmail() {
            return (String) attributes.get("email");
        }

        @Override
        public String getImageUrl() {
            if (attributes.containsKey("picture")) {
                Map<String, Object> pictureObj = (Map<String, Object>) attributes.get("picture");
                if (pictureObj != null && pictureObj.containsKey("data")) {
                    Map<String, Object> dataObj = (Map<String, Object>) pictureObj.get("data");
                    if (dataObj != null) {
                        return (String) dataObj.get("url");
                    }
                }
            }
            return null;
        }
    }

    public static class DiscordOAuth2UserInfo extends OAuth2UserInfo {
        public DiscordOAuth2UserInfo(Map<String, Object> attributes) {
            super(attributes);
        }

        @Override
        public String getId() {
            return String.valueOf(attributes.get("id"));
        }

        @Override
        public String getName() {
            return (String) attributes.get("global_name") != null ? (String) attributes.get("global_name") : (String) attributes.get("username");
        }

        @Override
        public String getFirstName() {
            String name = getName();
            if (name != null && name.contains(" ")) {
                return name.split(" ")[0];
            }
            return name != null ? name : "DiscordUser";
        }

        @Override
        public String getLastName() {
            String name = getName();
            if (name != null && name.contains(" ")) {
                String[] parts = name.split(" ");
                return parts[parts.length - 1];
            }
            return "Member";
        }

        @Override
        public String getEmail() {
            String email = (String) attributes.get("email");
            if (email == null || email.isBlank()) {
                return attributes.get("id") + "@discord.user";
            }
            return email;
        }

        @Override
        public String getImageUrl() {
            String id = (String) attributes.get("id");
            String avatar = (String) attributes.get("avatar");
            if (id != null && avatar != null) {
                return "https://cdn.discordapp.com/avatars/" + id + "/" + avatar + ".png";
            }
            return null;
        }
    }
}
