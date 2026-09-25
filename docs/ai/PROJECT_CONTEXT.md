# PROJECT_CONTEXT.md — NoSeumCode

_Last updated: 2026-09-24 | Conversation: 67344526-4298-4551-abb3-f061712dca15_

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

## Active Branch: `feat/sprint-2-stripe-checkout`
## Current State: Sprint 2 (Tunnel de Vente & Monétisation Stripe Checkout) implémenté, testé (39 tests au vert) et prêt pour fusion dans develop.
## Next Sprint: Sprint 3 (Auth, Comptes & E-mails transactionnels).
## Git Governance: Never push directly to `develop` (triggers auto-deploy to Oracle VM). Work on dedicated branches (`feat/*`, `fix/*`) and open PRs to `develop` for manual merge (ADR-009).

## Roles: STUDENT | TEACHER | ADMIN

