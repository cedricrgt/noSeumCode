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
   - Validation 100% au vert : 16 tests exécutés avec succès (`BUILD SUCCESS`) via JDK 21.

5. **Ajustements de Routage & Intégration Stripe** :
   - Câblage multi-routes dans `PaymentController.java` (`/api/payments/webhook` et `/api/payments/webhook/stripe`) et mise à jour de `SecurityConfig.java`.
   - Autorisation publique du `GET` sur `/api/chapters/**` et `/api/contents/**` pour laisser le paywall serveur évaluer les prévisualisations gratuites.
   - Création de [`frontend/success.html`](file:///d:/Archive-mac/dev/code-bangers/frontend/success.html) : page post-paiement dédiée aux apprenants, alignée avec la charte NoSeumCode.
   - Intégration et validation en mode Test du serveur MCP Stripe et de Stripe CLI.
   - Test d'intégration de bout en bout validé : création d'une session Checkout Stripe réelle de test et simulation de webhook HMAC SHA-256 avec succès (`received: true`).


---

## 2026-09-25 — CI/CD : Déclencheur FTP o2switch & Synchronisation Automatique DB PostgreSQL

**Conversation ID**: `4e560375-39fe-44c1-b9cb-7c6fabd79207`  
**Branche**: `fix/ci-deploy-db-auth`  
**Objectif**: Rétablir le déploiement continu du frontend sur o2switch (`ftp.yml`) et éliminer l'erreur 502 Bad Gateway / échec d'authentification PostgreSQL sur la VM Oracle Cloud (`deploy.yml`).

### Réalisations & Corrections :
1. **Workflow FTP o2switch (`ftp.yml`)** :
   - Rétablissement du déclenchement automatique sur push vers `develop` en plus de `main`.
   - Déclenchement manuel (`workflow_dispatch`) exécuté pour publier immédiatement les fichiers frontend à jour (`success.html`, `header.js`, `dashboard.js`, `cours.js`) sur `noseumcode.fr` (HTTP 200).

2. **Workflow Oracle VM (`deploy.yml`)** :
   - Scoping strict des variables passées à `envsubst` (`VARS_TO_SUBST`) évitant toute corruption de mot de passe ou clé contenant des caractères spéciaux.
   - Alignement de `DB_URL` sur `jdbc:postgresql://postgres:5432/noseumcode` (nom de service réseau Docker Compose).
   - Ajout de la synchronisation automatique et idempotente des identifiants PostgreSQL via socket Unix (`docker compose exec -T postgres psql ... ALTER USER ... / CREATE USER ...`).
   - Ajout d'une vérification de disponibilité HTTP Actuator post-démarrage.

---

## 2026-09-25 — Sprint 2 : Tunnel de Vente & Monétisation Stripe Checkout

**Conversation ID**: `9815351c-ad9c-429a-8a17-f626092e953f`  
**Branche**: `feat/sprint-2-stripe-checkout`  
**Objectif**: Intégrer le SDK Stripe officiel, implémenter la création de session Stripe Checkout sécurisée, étendre le catalogue des formations avec prix/niveaux/slugs, et connecter les flux d'achat et webhooks de manière ciblée par formation.

### Réalisations & Corrections :
1. **Intégration du SDK Stripe Java (`backend/pom.xml`)** :
   - Ajout de la dépendance officielle `com.stripe:stripe-java` (v26.0.0).
   - Configuration des propriétés `stripe.secret.key`, `stripe.success.url` et `stripe.cancel.url` dans `application.properties`.

2. **Modèle Économique & Migration Flyway V011 (`Course.java`, `V011__add_course_monetization_fields.sql`)** :
   - Ajout des attributs de monétisation et de catalogue dans `Course` : `priceInCents` (Long), `currency` (String), `slug` (String, unique), `thumbnailUrl` (String), `level` (String), `isPublished` (boolean).
   - Création de la migration idempotente `V011` initialisant les prix des formations existantes (49 € pour Fullstack Java 21, 69 € pour Clean Architecture & DDD) avec index unique sur `slug`.
   - Mise à jour des DTOs `CourseRequest` et `CourseResponse`, de `CourseRepository` (`findBySlug`) et de `CourseService`.

3. **Tunnel de Vente & Endpoint Stripe Checkout Session (`PaymentController.java`, `PaymentService.java`, `StripeGateway.java`)** :
   - Implémentation du pattern Ports & Adapters (`StripeGateway` / `StripeGatewayImpl`) utilisant `RequestOptions` pour des appels thread-safe.
   - Endpoint sécurisé `POST /api/payments/create-checkout-session` (authentifié par JWT) générant une Checkout Session Stripe hébergée avec métadonnées (`userId`, `courseId`, `userEmail`).
   - Gestion des cas limites : blocage des doubles paiements si déjà `PAID`, validation immédiate gratuite si `priceInCents <= 0`, et interdiction d'achat sur cours non publiés ou supprimés.
   - Extension du webhook Stripe : extraction des métadonnées `courseId` et `userId` pour débloquer spécifiquement la formation achetée.

4. **Expérience Apprenant & Boutons d'Achat Frontend (`cours.js`, `success.html`)** :
   - Affichage dynamique du prix et du niveau sur chaque carte du catalogue de cours.
   - Intégration du bouton "💳 Acheter / Débloquer" sur le catalogue, sur le panneau de cours verrouillé, et sur la bannière de prévisualisation dans la classe virtuelle.
   - Création de la fonction `initiateStripeCheckout(courseId)` avec redirection automatique vers Stripe Checkout et retour vers `success.html` ou `cours.html`.
   - Amélioration de `success.html` avec lecture du paramètre `course_id` pour proposer un bouton direct "Commencer la formation immédiatement 🚀".

5. **Tests & Validation Locale** :
   - Création de `PaymentCheckoutServiceTest.java` (8 tests unitaires couvrant la création de session, cours déjà payé, cours gratuit, cours non publié, webhook ciblé, sécurité JWT).
   - Exécution complète de la suite de tests : 39 tests réussis (`BUILD SUCCESS`, 0 erreur, 0 échec).