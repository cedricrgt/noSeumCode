# PROJECT_CONTEXT.md — NoSeumCode

_Last updated: 2026-09-30 | Conversation: e8ec6f84-8fe9-4797-b252-c7c4ae21f579_

## Project Overview

**NoSeumCode** is an online coding education platform (French-language) offering courses, workshops, and live sessions.

## Technology Stack

### Backend
- **Runtime**: Java 21 — **Framework**: Spring Boot 3.4.3
- **Security**: Spring Security 6 + OAuth2 Resource Server (JWT HS256) + OAuth2 Client (Google OIDC, GitHub, Discord, Facebook)
- **Database**: PostgreSQL via Spring Data JPA / Hibernate — **Migrations**: Flyway
- **Password Hashing**: BCrypt (`BCryptPasswordEncoder`) — **Crypto**: BouncyCastle 1.80
- **Build**: Maven

### Frontend
- **Stack**: Vanilla HTML + CSS + JavaScript (no framework)
- **Served via**: Apache (`.htaccess`) — **Build**: Custom Node.js bundler
- **Auth storage**: `localStorage` (`noseum_token`, `noseum_user`)
- **OAuth2 flow**: Auth Code → backend → JWT in URL fragment → JS `parseAuthFromUrl()`

## Architecture

```
code-bangers/
backend/src/main/java/com/codebangers/backend/
  auth/         AuthController, AuthService, OAuth2 handlers
  config/       SecurityConfig, JwtConfig, JwtService, GlobalExceptionHandler, AdminSeeder
  user/         User entity, UserController, UserService
  course/       Course, Enrollment
  chapter/      Chapter management + approval workflow
  payment/      PaymentController (Stripe webhook + manual admin)
  workshop/     Workshop + UserWorkshop
  cohort/       Cohort entity, CohortController, CohortService
  discord/      DiscordGateway (REST API v10), DiscordService, DiscordController
frontend/
  index.html / dashboard.html / parcours.html / workshops.html
  formations/   starter.html / pack-web.html / index.html
  js/header.js dashboard.js cours.js script.js workshops.js analytics.js
  partials/     HTML fragments (header.html, popovers-shared.html, footer.html)
  .htaccess     Apache security headers + HTTPS redirect + compression mod_deflate
```

## Environments & CI/CD Topology
- **Production Frontend**: o2switch (`https://noseumcode.fr`) via push on `main` (`ftp.yml` -> `FTP_DIR`). Document Root cPanel: `noseumcode.fr/yefa3951/public_html` (ou `public_html`).
- **Staging / Dev Frontend**: o2switch (`https://develop.noseumcode.fr`) via push on `develop` (`ftp-dev.yml` -> `develop.noseumcode.fr/`). Document Root cPanel: `noseumcode.fr/yefa3951/develop.noseumcode.fr`.
- **Backend API**: Oracle Cloud VM (`https://api.noseumcode.fr`) via push on `develop` (`deploy.yml`).

## Active Branch: `feat/sprint-13-technical-foundation-seo-assets`
## Current State: Sprints 1 à 13 validés. Sprint 13 complété avec succès (déblocage CSP HubSpot dans .htaccess, directives cache mod_expires 1 an et clean URLs, hygiène SEO robots.txt et sitemap.xml, compression WebP git.webp à 47.9 Ko, pages légales mentions-legales.html avec SIRET, cgv.html avec tarifs 3 packs et garanties, confidentialite.html avec conformité RGPD/Stripe/Brevo).
## Next Steps: Lancement du Sprint 14 (Nouvelle Architecture des Offres en 3 Packages : modélisation catalogue cours.js, alignement Stripe backend, refonte parcours.html et navigation header).
## Git Governance: Never push directly to `develop` (triggers auto-deploy to Oracle VM and o2switch dev). Work on dedicated branches (`feat/*`, `fix/*`, `docs/*`) and open PRs to `develop` for manual merge (ADR-009). All commit messages and PR descriptions must be written strictly in English (Conventional Commits, zero emojis, zero boilerplate).

## Roles: STUDENT | TEACHER | ADMIN

