# PROJECT_CONTEXT.md — NoSeumCode

_Last updated: 2026-09-28 | Conversation: 435919e4-c088-4d3b-ab96-450cd0467e7d_

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
frontend/
  index.html / dashboard.html / cours.html
  js/header.js dashboard.js cours.js script.js
  partials/     HTML fragments (header.html, popovers-shared.html, footer.html)
  .htaccess     Apache security headers + HTTPS redirect
```

## Environments & CI/CD Topology
- **Production Frontend**: o2switch (`https://noseumcode.fr`) via push on `main` (`ftp.yml` -> `FTP_DIR`). Document Root cPanel: `noseumcode.fr/yefa3951/public_html` (ou `public_html`).
- **Staging / Dev Frontend**: o2switch (`https://develop.noseumcode.fr`) via push on `develop` (`ftp-dev.yml` -> `develop.noseumcode.fr/`). Document Root cPanel: `noseumcode.fr/yefa3951/develop.noseumcode.fr`.
- **Backend API**: Oracle Cloud VM (`https://api.noseumcode.fr`) via push on `develop` (`deploy.yml`).

## Active Branch: `feat/sprint-10-perf-and-a11y-tuning` (en cours de PR vers `develop`)
## Current State: Sprints 1 à 10 validés (Gamme Starter/Web/VIP, Cohortes jauge 6 max, Replays à vie Starter, Klarna BNPL, Flyway V015, Google Safe Browsing / Lookalike résolu, Performance Web & SEO Technique, Refonte Copywriting Hero "Apprendre à coder en construisant de vrais projets", Double regard Rassurance Parents/Jeunes, Section Ton Mentor Cédric, Analytics Cookieless & RGPD Plausible/Umami avec tracking complet des conversions, et Optimisation PageSpeed & Core Web Vitals : LCP < 1.5s, CLS 0.00 sur Hero, déferrement Stripe & minification JS, parallélisation Promise.all, rapatriement local WebP des visuels, compositing GPU sur gradient text) avec 112 tests unitaires et d'intégration Spring Boot réussis (0 échec).
## Next Steps: Lancement commercial, acquisition apprenants et suivi des conversions analytics en production.
## Git Governance: Never push directly to `develop` (triggers auto-deploy to Oracle VM and o2switch dev). Work on dedicated branches (`feat/*`, `fix/*`, `docs/*`) and open PRs to `develop` for manual merge (ADR-009). All commit messages and PR descriptions must be written strictly in English (Conventional Commits, zero emojis, zero boilerplate).

## Roles: STUDENT | TEACHER | ADMIN

