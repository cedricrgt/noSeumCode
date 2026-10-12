# PROJECT_CONTEXT.md — NoSeumCode

_Last updated: 2026-10-12 | Conversation: adbaed0b-0e79-4902-90fa-bfd28b8917c7_

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
  index.html / dashboard.html / app.html / workshops.html
  formations/   starter.html / pack-web.html / index.html
  js/header.js dashboard.js cours.js script.js workshops.js analytics.js
  partials/     HTML fragments (header.html, popovers-shared.html, footer.html)
  .htaccess     Apache security headers + HTTPS redirect + compression mod_deflate + 301 rewrites
```

## Environments & CI/CD Topology
- **Production Frontend**: o2switch (`https://noseumcode.fr`) via push on `main` (`ftp.yml` -> `FTP_DIR`). Document Root cPanel: `noseumcode.fr/yefa3951/public_html` (ou `public_html`).
- **Staging / Dev Frontend**: o2switch (`https://develop.noseumcode.fr`) via push on `develop` (`ftp-dev.yml` -> `develop.noseumcode.fr/`). Document Root cPanel: `noseumcode.fr/yefa3951/develop.noseumcode.fr`.
- **Backend API**: Oracle Cloud VM (`https://api.noseumcode.fr`) via push on `develop` (`deploy.yml`).

## Active Branch: `fix/security-remediation-jackson-xss-secrets`
## Current State: Remédiation de Sécurité (Audit Aikido) validée : Dépendances Jackson contraintes en 3.1.7 et 2.21.7 (CVEs P0 corrigées) ; Sinks DOM XSS P0 neutralisés dans dashboard.js, article.js et cours.js ; Éradication P1 de la clé Stripe hardcodée avec mise en place du endpoint sécurisé GET /api/config/stripe-key et résolution dynamique côté frontend ; pr-preview/ exclu dans .gitignore ; 217 tests backend Spring Boot et 20 tests E2E Playwright au vert sans régression.
## Next Steps: Soumission de la PR vers develop, rotation manuelle de la clé Stripe sur le Dashboard Stripe (acct_1GYAtuAmRX1Xf5vu), et résolution des 29 sous-issues sur Aikido Security.
## Git Governance: Never push directly to `develop` (triggers auto-deploy to Oracle VM and o2switch dev). Work on dedicated branches (`feat/*`, `fix/*`, `docs/*`) and open PRs to `develop` for manual merge (ADR-009). All commit messages and PR descriptions must be written strictly in English (Conventional Commits, zero emojis, zero boilerplate).

## Roles: STUDENT | TEACHER | ADMIN
## Modèle Relationnel Formateurs & Endpoints Dédiés:
- Rôle utilisateur: `Role.TEACHER` (distinct et indépendant des flux de facturation).
- Statut de paiement: `PaymentStatus` (`PAID`, `PENDING`, `FAILED`, `REFUNDED`) strictement réservé aux transactions financières (aucun détournement pour désigner un rôle enseignant).
- Affectation aux cours: Table de liaison Many-to-Many `course_teacher` (`course_id`, `teacher_id`, `assigned_at`, `assigned_by_id`).
- Endpoints REST Formateur / Admin :
  * `GET /api/courses/my-assigned-courses` : réservé à `ROLE_TEACHER` (liste filtrée des cours assignés) et `ROLE_ADMIN` (catalogue complet).
  * `POST /api/courses/{id}/teachers/{teacherId}` : réservé à `ROLE_ADMIN` (assignation formateur).
  * `DELETE /api/courses/{id}/teachers/{teacherId}` : réservé à `ROLE_ADMIN` (retrait formateur).
- Cloisonnement d'accès: `@PreAuthorize("hasRole('ADMIN') or @courseSecurity.canManageCourse(#id, authentication)")` sur mutations de cours et chapitres.

## Salons Discord Pédagogiques:
- Cours Live: Salons Scène (`GUILD_STAGE_VOICE`, Type 13) — Formateurs modérateurs avec voix prioritaire, apprenants auditeurs avec `REQUEST_TO_SPEAK`.
- Projets Collectifs: 3 salons vocaux libres (`GUILD_VOICE`, Type 2) ouverts à tous les apprenants avec partage d'écran (`STREAM`) autorisé : `luffy-code-lab`, `goku-dojo-live`, `naruto-team-hub`.


