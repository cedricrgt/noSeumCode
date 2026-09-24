# CHANGELOG.md — NoSeumCode

_Chronologique — plus récent en bas_

---

## 2026-09-16 | Conversation: e0c9f398-8522-470e-9df1-e11344331037

**Type**: Audit pré-production (sécurité, accessibilité, qualité du code)
**Auteur**: Antigravity (Agent IA)
**Branche**: `task/security-check`

**Ce qui a été analysé**:
- Backend complet : SecurityConfig, JwtConfig, JwtService, AuthController, AuthService, AuthResponse, RegisterRequest, LoginRequest, OAuth2AuthenticationSuccessHandler, CustomOAuth2UserService, GlobalExceptionHandler, AdminSeeder, SeedDataInitializer, PaymentController, UserController, User entity, pom.xml, application.properties, application-prod.properties, Flyway migrations V001-V010
- Frontend complet : index.html, dashboard.html, cours.html, header.js, dashboard.js, cours.js, script.js, .htaccess, .env (frontend + backend)

**Résultat**: Rapport d'audit créé (voir `docs/ai/AUDIT_REPORT.md`)
- 18 issues identifiées (4 critiques 🔴, 10 importantes 🟡, 4 mineures 🟢)
- Fichiers docs/ai/ créés : PROJECT_CONTEXT.md, KNOWN_ISSUES.md, DECISIONS.md, CHANGELOG.md

---

## 2026-09-16 | Conversation: aa61ba7c-508d-4d0b-bb50-cab1c40c0496

**Type**: Application des corrections post-audit (sécurité critique + majeure + qualité code)
**Auteur**: Antigravity (Agent IA)

**Corrections appliquées**:
- **SEC-B-001** ✅ — Suppression du fallback JWT secret hardcodé dans `JwtConfig.java` et `application.properties`
- **SEC-B-004** ✅ — JWT expiry réduit de 24h à 1h (`backend/.env`, `application.properties`)
- **SEC-B-005** ✅ — CORS lu depuis `${CORS_ALLOWED_ORIGINS}` env var (`SecurityConfig.java`), domaine `noseumcode.fr` correct
- **SEC-B-006** ✅ — Suppression du loop PII `findAll().forEach(log.info(...))` dans `AdminSeeder.java`
- **SEC-B-010** ✅ — BCrypt cost factor porté à 13 rounds (`JwtConfig.java`)
- **SEC-F-001** ✅ — Remplacement du `innerHTML` de `schedule.json` par construction DOM sécurisée (`header.js`)
- **SEC-F-003** ✅ — Suppression de la logique `normalizeRole(email)` côté client (`dashboard.js`)
- **CODE-001** ✅ — Commentaires redondants supprimés, tous traduits en anglais
- **CODE-002** ✅ — `logout()` dupliqué supprimé dans `dashboard.js`
- **JWT Secret** ✅ — Nouvelle clé 512-bit générée avec `crypto.randomBytes(64)` et mise en `.env`

**En attente (sprint suivant)**:
- ISSUE-003 : Stripe webhook signature validation
- ISSUE-006 : Rate limiting auth endpoints
- ISSUE-007 : Politique mot de passe renforcée (min 8 chars)
- ISSUE-016 : @Valid sur updateUser

---

## 2026-09-17 | Conversation: 76ca60d0-554b-43a6-a78b-9eb85f84ea73

**Type**: Mise en production Oracle Cloud VM + CI/CD GitHub Actions
**Auteur**: Cedric (manuel) + Antigravity (Agent IA)
**Branche**: `feat/git-oracle-workflow`

**Corrections appliquées**:
- **DB_PASSWORD** ✅ — `backend/.env` local renseigné (`DB_PASSWORD=778195`, était vide → SCRAM auth error)
- **@Value imbriqué** ✅ — `SecurityConfig.java` : `${cors.allowed-origins:${app.cors.allowed-origins:...}}` non supporté par Spring → simplifié en `${app.cors.allowed-origins:...}`
- **SecurityConfig routes** ✅ — Élargissement des matchers publics : `/api/auth/**`, `/api/courses/**`, `/api/workshops/**`, `/actuator/health`
- **forward-headers-strategy** ✅ — Ajouté dans `application-prod.properties` + VM `.env` (`SERVER_FORWARD_HEADERS_STRATEGY=framework`) → corrige le redirect_uri_mismatch OAuth2 derrière Nginx
- **deploy.yml** ✅ — Workflow GitHub Actions remplacé (GitHub Pages → SSH Oracle VM) : `git pull` + `docker compose up -d --build`
- **VM .env** ✅ — Nettoyé (doublons supprimés, `SPRING_PROFILES_ACTIVE=prod`, `DB_URL=jdbc:postgresql://postgres:5432/db`)
- **Nginx CORS** ✅ — Gestion du preflight OPTIONS directement dans Nginx (`add_header Access-Control-Allow-Origin $http_origin`)

**Architecture prod confirmée**:
- VM Oracle Cloud (Ubuntu) — IP : 145.241.165.164
- Nginx reverse-proxy → `http://127.0.0.1:8080` (Tomcat Spring Boot)
- PostgreSQL dans Docker Compose (service `postgres`, volume persisté)
- CI/CD : push sur `main` → GitHub Actions → SSH → `git pull` + `docker compose up --build`

**⚠️ Point d'attention — Double CORS (Nginx + Spring)**:
- Nginx gère le preflight OPTIONS et ajoute `Access-Control-Allow-Origin`
- Spring Security (`SecurityConfig.corsConfigurationSource()`) ajoute aussi ces headers
- Risque de **headers dupliqués** → peut bloquer certains navigateurs
- Solution recommandée : désactiver CORS dans Nginx et laisser uniquement Spring gérer (ou l'inverse)

---

## 2026-09-21 | Conversation: ac5b5240-0d5c-45c7-b2c2-734ee7676e30

**Type**: Audit frontend complet + corrections (workflow `frontend-design-development`)
**Auteur**: Antigravity (Agent IA)
**Branche**: `task/security-check`

**Audit réalisé** (9 phases du workflow `@frontend-design-development`):
- Score global : 6.2/10 avant correction
- Points forts : identité visuelle homepage, CSS Anchor Positioning, accessibilité de base, Popover API native, animations performantes
- Points critiques identifiés : CTA hero morts, rupture de couleur de marque (#2ecc71 ≠ #00ff87), styles inline non maintenables, tokens CSS dupliqués, `!important` en cascade

**Corrections appliquées**:

### `index.html`
- ✅ **CTA hero "Go coder"** → `onclick="openGlobalAuthModal('register')"` + `aria-haspopup="dialog"`
- ✅ **CTA hero "Teste et kiffe !"** → `onclick="openGlobalAuthModal('login')"` + `aria-haspopup="dialog"`
- ✅ **`fetchpriority="high"`** ajouté sur l'image hero above-the-fold (LCP)
- ✅ **Poppins weights réduits** : 300;400;500;600;700 → 400;600;700 (économie réseau ~20%)
- ✅ **5 occurrences** `card__textGreen` → `card__text-muted` (nom sémantiquement correct)

### `styles/components/popover.css`
- ✅ **3 couleurs `#2ecc71`** remplacées par `var(--primary-green)` → cohérence de marque
- ✅ **8 occurrences `!important`** supprimées — spécificité résolue par `[popover].auth-popover-box` (sélecteur attr + class)

### `styles/components/header.css`
- ✅ **Classes extraites** : `.user-profile-pill`, `.user-avatar-circle`, `.user-profile-name`, `.logout-btn` créées en CSS pur

### `partials/header.html`
- ✅ **Tous les styles inline** du bloc `.header__actions` supprimés → remplacés par les classes CSS ci-dessus
- ✅ **`aria-label`** ajouté sur le lien profil

### `styles/pages/dashboard.css`
- ✅ **Tokens dupliqués supprimés** : `--dash-bg`, `--dash-card-bg`, `--dash-text`, `--dash-text-muted`, `--dash-dark-navy`, `--dash-dark-blue`, `--dash-neon-green`, `--dash-neon-blue` → référencent maintenant les tokens globaux de `reset.css`

### `styles/components/cards.css`
- ✅ **`.card__text-muted`** ajouté comme alias sémantique de `.card__textGreen` (rétrocompatibilité maintenue)

### `styles/pages/homepage/hero.css`
- ✅ **`will-change: transform`** ajouté sur `.slider__track` pour optimiser l'animation GPU infinie

### `styles/pages/homepage/footer.css`
- ✅ **Styles `.footer__link` et `.footer__link:hover`** ajoutés (manquaient)
- ✅ **`.footer__link--disabled`** créé pour les liens légaux en attente de pages dédiées

### `partials/footer.html`
- ✅ **Liens légaux morts** (`index.html`) → remplacés par `href="#"` + `aria-disabled="true"` + classe `--disabled` (ne redirigent plus vers la homepage)

**Bundles CSS regénérés** via `node build.js` (homepage, article, thanks, en-construction)

**Résultat** : Score estimé après corrections → 7.8/10

---

## 2026-09-24 | Conversation: 67344526-4298-4551-abb3-f061712dca15

**Type**: Cadrage architectural du workflow de développement agentique autonome & gouvernance Git
**Auteur**: Antigravity (Agent IA)
**Contexte**: Mise en place d'un cycle de développement automatisé par agents pour NoSeumCode (`noseumcode.fr`).

**Actions réalisées**:
1. **Audit des workflows CI/CD & Déploiement**:
   - Analyse de `.github/workflows/deploy.yml` : vérifié que tout push sur la branche `develop` déclenche un déploiement SSH direct en production sur la VM Oracle Cloud (`145.241.165.164`).
   - Analyse de `.github/workflows/pr-preview.yml` : vérifié que les Pull Requests déclenchent la génération d'un aperçu dédié sur GitHub Pages (`gh-pages`).

2. **Établissement de la règle de protection de branche (ADR-009)**:
   - **Interdiction formelle de push direct sur `develop`** : empêche les déploiements accidentels sur la VM de production.
   - **Obligation de Pull Request (PR)** : chaque tâche/fonctionnalité doit s'exécuter sur une branche de travail dédiée (`feat/...`, `fix/...`, `task/...`). Une fois développée et testée de façon itérative, une PR est ouverte comparant la branche de travail à `develop` pour que Cedric puisse l'examiner et la fusionner lui-même.
   - **Cycle itératif autonome** : discussion et priorisation conjointe de la feature -> conception/planification -> développement -> tests et validation de non-régression -> mise à jour de la mémoire projet (`docs/ai/`) -> ouverture de la PR.

3. **Diagnostic d'environnement local**:
   - Vérification du repository Git distant (`git@github.com:cedricrgt/noSeumCode.git`).
   - Détection de l'absence de l'exécutable `git` dans le `PATH` actif du terminal PowerShell Windows (résolu par l'installation de Git 2.55.0 dans `C:\Program Files\Git`).

4. **Modification du workflow de déploiement o2switch (`.github/workflows/ftp.yml`)**:
   - Déclenchement automatique modifié : la branche cible pour le push est désormais `main` au lieu de `develop`.
   - Permet de réserver le déploiement FTP o2switch aux versions finalisées et mergées sur `main`.


