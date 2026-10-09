package com.codebangers.backend.config;

import com.codebangers.backend.auth.oauth2.CustomOAuth2UserService;
import com.codebangers.backend.auth.oauth2.CustomOidcUserService;
import com.codebangers.backend.auth.oauth2.OAuth2AuthenticationSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.Nullable;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

        private final CustomOAuth2UserService customOAuth2UserService;
        private final CustomOidcUserService customOidcUserService;
        private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
        private final com.codebangers.backend.auth.oauth2.OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
        private final com.codebangers.backend.auth.oauth2.OAuth2RedirectUriFilter oAuth2RedirectUriFilter;
        private final List<String> allowedOrigins;

        @Autowired
        public SecurityConfig(CustomOAuth2UserService customOAuth2UserService,
                        CustomOidcUserService customOidcUserService,
                        OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler,
                        com.codebangers.backend.auth.oauth2.OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler,
                        com.codebangers.backend.auth.oauth2.OAuth2RedirectUriFilter oAuth2RedirectUriFilter,
                        @Value("${app.cors.allowed-origins:http://localhost:3000,https://noseumcode.fr,https://www.noseumcode.fr,https://develop.noseumcode.fr}") String corsOrigins,
                        @Nullable Environment environment) {
                this.customOAuth2UserService = customOAuth2UserService;
                this.customOidcUserService = customOidcUserService;
                this.oAuth2AuthenticationSuccessHandler = oAuth2AuthenticationSuccessHandler;
                this.oAuth2AuthenticationFailureHandler = oAuth2AuthenticationFailureHandler;
                this.oAuth2RedirectUriFilter = oAuth2RedirectUriFilter;

                boolean isProd = environment != null && environment.acceptsProfiles(Profiles.of("prod"));

                Set<String> origins = java.util.Arrays.stream(corsOrigins.split(","))
                                .map(String::trim)
                                .filter(s -> !s.isBlank())
                                .collect(Collectors.toSet());

                if (isProd) {
                        // Strict production CORS policy (P1): strictly noseumcode.fr origins, no wildcards, no localhost/LAN IPs
                        Set<String> prodOrigins = new java.util.LinkedHashSet<>();
                        for (String origin : origins) {
                                if ("https://noseumcode.fr".equals(origin) || "https://www.noseumcode.fr".equals(origin)) {
                                        prodOrigins.add(origin);
                                }
                        }
                        if (prodOrigins.isEmpty()) {
                                prodOrigins.add("https://noseumcode.fr");
                                prodOrigins.add("https://www.noseumcode.fr");
                        }
                        this.allowedOrigins = new java.util.ArrayList<>(prodOrigins);
                } else {
                        // Non-production (dev, staging, test): allow local development, localhost, and LAN subnets
                        origins.add("https://noseumcode.fr");
                        origins.add("https://www.noseumcode.fr");
                        origins.add("https://develop.noseumcode.fr");
                        origins.add("https://*.noseumcode.fr");
                        origins.add("http://localhost");
                        origins.add("http://localhost:*");
                        origins.add("https://localhost");
                        origins.add("https://localhost:*");
                        origins.add("http://127.0.0.1");
                        origins.add("http://127.0.0.1:*");
                        origins.add("https://127.0.0.1");
                        origins.add("https://127.0.0.1:*");
                        origins.add("http://192.168.*");
                        origins.add("https://192.168.*");
                        origins.add("http://10.*");
                        origins.add("https://10.*");
                        for (int i = 16; i <= 31; i++) {
                                origins.add("http://172." + i + ".*");
                                origins.add("https://172." + i + ".*");
                        }
                        this.allowedOrigins = new java.util.ArrayList<>(origins);
                }
        }

        public SecurityConfig(CustomOAuth2UserService customOAuth2UserService,
                        CustomOidcUserService customOidcUserService,
                        OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler,
                        com.codebangers.backend.auth.oauth2.OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler,
                        com.codebangers.backend.auth.oauth2.OAuth2RedirectUriFilter oAuth2RedirectUriFilter,
                        String corsOrigins) {
                this(customOAuth2UserService, customOidcUserService, oAuth2AuthenticationSuccessHandler,
                                oAuth2AuthenticationFailureHandler, oAuth2RedirectUriFilter, corsOrigins, null);
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .addFilterBefore(oAuth2RedirectUriFilter, org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter.class)
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers("/api/courses", "/api/courses/**", "/api/parcours", "/api/parcours/**").permitAll()
                                                .requestMatchers("/api/workshops/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/cohorts", "/api/cohorts/**").permitAll()
                                                .requestMatchers("/login/oauth2/**", "/oauth2/**").permitAll()
                                                .requestMatchers("/actuator/health").permitAll()
                                                .requestMatchers("/api/payments/webhook", "/api/payments/webhook/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/chapters/**", "/api/contents/**").permitAll()
                                                .requestMatchers("/api/**").authenticated()
                                                .anyRequest().authenticated())
                                .oauth2Login(oauth2 -> oauth2
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService) // GitHub,
                                                                                                      // Discord,
                                                                                                      // Facebook
                                                                .oidcUserService(customOidcUserService)) // Google
                                                                                                         // (OIDC)
                                                .successHandler(oAuth2AuthenticationSuccessHandler)
                                                .failureHandler(oAuth2AuthenticationFailureHandler))
                                .oauth2ResourceServer(oauth2 -> oauth2
                                                .jwt(jwt -> jwt.jwtAuthenticationConverter(
                                                                jwtAuthenticationConverter())));

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOriginPatterns(allowedOrigins);
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        @Bean
        public JwtAuthenticationConverter jwtAuthenticationConverter() {
                JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
                grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
                grantedAuthoritiesConverter.setAuthoritiesClaimName("role");

                JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
                converter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
                return converter;
        }
}
