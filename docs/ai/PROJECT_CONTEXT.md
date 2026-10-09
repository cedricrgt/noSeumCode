# PROJECT_CONTEXT.md — NoSeumCode

_Last updated: 2026-10-03 | Conversation: d2701bcf-ed1f-4e38-bb5e-52a921b4ec35_

> ⚠️ **VERITÉ TECHNIQUE ABSOLUE** : Les agents IA intervenant sur ce projet DOIVENT considérer le code source actuel et les fichiers de configuration de l'infrastructure (comme les .yml, .htaccess, Dockerfile) comme l'unique vérité technique absolue. La documentation AI (y compris ce fichier) reflète l'intention architecturale, mais en cas de conflit apparent, c'est le code réel et les configurations du dépôt qui priment.

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

## Active Branch: `feat/sprint-26-e2e-cors-hygiene`
## Current State: Sprint 26 (Intégration E2E Playwright, CORS prod, cookies HttpOnly, nettoyage bruit Git) terminé, tests validés localement (161 tests unitaires OK, 2 tests E2E Playwright OK).
## Next Steps: Ouverture de la PR vers develop pour validation et déploiement.
## Git Governance: Never push directly to `develop` (triggers auto-deploy to Oracle VM and o2switch dev). Work on dedicated branches (`feat/*`, `fix/*`, `docs/*`) and open PRs to `develop` for manual merge (ADR-009). All commit messages and PR descriptions must be written strictly in English (Conventional Commits, zero emojis, zero boilerplate).

## Roles: STUDENT | TEACHER | ADMIN


