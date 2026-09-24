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

## 2026-09-24 — Sprint 1 : Sécurité du Paywall Serveur & Webhook Stripe

**Conversation ID**: `4e560375-39fe-44c1-b9cb-7c6fabd79207`  
**Branche**: `feat/sprint-1-security-paywall`  
**Objectif**: Bloquer l'accès gratuit frauduleux aux cours, valider cryptographiquement le Webhook Stripe, et purger les failles de contournement côté client (`noseum_payments`).

### Réalisations & Corrections :
1. **Validation HMAC SHA-256 Webhook Stripe** (`PaymentController.java`, `StripeWebhookValidator.java`) :
   - Création du validateur cryptographique `StripeWebhookValidator` conforme aux spécifications Stripe (`t=timestamp,v1=signature`).
   - Protection anti-rejeu (replay attack) avec tolérance maximale de 300 secondes.
   - Comparaison en temps constant (`MessageDigest.isEqual`) pour neutraliser les attaques temporelles (timing attacks).
   - Consommation stricte de `application/json` et du payload JSON brut (`@RequestBody String rawPayload`) évitant toute altération de signature lors de la désérialisation.
   - Intégration de `STRIPE_WEBHOOK_SECRET` dans `application.properties` et `.github/workflows/deploy.yml`.
   - Résolution définitive de **ISSUE-003** 🔴 et **ISSUE-017** 🟡.

2. **Paywall Serveur sur Chapitres & Contenus** (`ChapterController.java`, `ContentController.java`, `EnrollmentService.java`, `Chapter.java`) :
   - Ajout de la méthode `hasPaidAccess(User user, UUID courseId)` dans `EnrollmentService` : accès total garanti pour `ADMIN` et `TEACHER`, et conditionné au statut `PAID` pour les apprenants `STUDENT`.
   - Définition formelle de la règle d'aperçu libre (`isFreePreview()`) : seule la section 1 (ou racine) d'une formation est accessible sans paiement.
   - Verrouillage HTTP 403 Forbidden sur `GET /api/chapters/{id}` et `GET /api/contents/{id}` pour toute section payante non validée.
   - Masquage serveur du corps des leçons (`content = null`) dans la liste des chapitres (`/api/chapters/course/{id}/all`) pour les utilisateurs non payants (seul le sommaire/titres reste consultable).

3. **Purge des Failles Côté Client** (`cours.js`, `dashboard.js`) :
   - Suppression intégrale de la clé vulnérable `noseum_payments` dans le `localStorage` de `dashboard.js` et `cours.js`.
   - Élimination de la logique d'émulation `isGlobalPaid` qui forçait artificiellement le statut `PAID` dans le navigateur.
   - Adaptation du Classroom Player (`cours.js`) : affichage d'un badge "Aperçu Gratuit" pour la section 1 et d'une carte d'accès verrouillé élégante ("Contenu Réservé aux Membres Payants") pour les sections suivantes.
   - Résolution définitive de **ISSUE-018** 🟡.

4. **Tests Unitaires & Validation de Sécurité** :
   - `PaymentWebhookSecurityTest.java` : tests de signature valide, charge utile falsifiée, secret erroné, rejeu expiré et JSON malformé.
   - `PaywallSecurityTest.java` : tests d'accès preview vs payant pour Admin, Teacher, Étudiant payé et Étudiant non payé sur chapitres et contenus.

