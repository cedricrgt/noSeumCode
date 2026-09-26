# PROJECT_CONTEXT.md — NoSeumCode

_Last updated: 2026-09-25 | Conversation: 81fa4873-a589-4692-878b-98cdc85b45b9_

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

## Active Branch: `develop`
## Current State: Sprints 1, 2, 3 finalisés et validés (Sécurité HMAC Stripe, Embedded Checkout, Auth Brevo/RTR). Restructuration complète de la feuille de route post-audit : Sprints 4 à 8 planifiés. Kanban GitHub Projects synchronisé (Projet #1).
## Next Sprint: Sprint 4 — Quick Wins Conversion, Déblocage Leads & Légal (Réparation CTA Hero, CSP HubSpot, sécurisation thanks.html, pages légales).
## Sprints Suivants:
- Sprint 5 : Workshops Gratuits Toussaint (Acquisition & Preuves Vidéos).
- Sprint 6 : Nouvelle Gamme & Accès Cohortes (Starter avec replays à vie, Web, VIP & Klarna).
- Sprint 7 : Performance Web & SEO Technique (Images <800Ko, SSG Statique, CLS).
- Sprint 8 : Refonte Copywriting & Rassurance Parents/Jeunes (Mentor & Analytics Plausible/Umami).
## Git Governance: Never push directly to `develop` (triggers auto-deploy to Oracle VM and o2switch dev). Work on dedicated branches (`feat/*`, `fix/*`, `docs/*`) and open PRs to `develop` for manual merge (ADR-009).

## Roles: STUDENT | TEACHER | ADMIN

