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
   - Configuration du catalogue et des tarifs officiels NoSeumCode :
     * **HTML & CSS – Les Fondations indispensables au Web** : 579 € (`priceInCents = 57900`)
     * **JavaScript – L'interactivité au bout des doigts** : 579 € (`priceInCents = 57900`)
     * **Git & GitHub – L'outil n°1 des devs pro** : 279 € (`priceInCents = 27900`)
   - Initialisation des chapitres et contenus markdown (Chapitre 1 en aperçu gratuit, Chapitres 2 et 3 verrouillés pour les membres payants).
   - Mise à jour des DTOs `CourseRequest` et `CourseResponse`, de `CourseRepository` (`findBySlug`) et de `CourseService`.

3. **Tunnel de Vente & Endpoint Stripe Checkout Session (`PaymentController.java`, `PaymentService.java`, `StripeGateway.java`)** :
   - Implémentation du pattern Ports & Adapters (`StripeGateway` / `StripeGatewayImpl`) utilisant `RequestOptions` pour des appels thread-safe.
   - Endpoint sécurisé `POST /api/payments/create-checkout-session` (authentifié par JWT) générant une Checkout Session Stripe hébergée avec métadonnées (`userId`, `courseId`, `userEmail`).
   - Gestion des cas limites : blocage des doubles paiements si déjà `PAID`, validation immédiate gratuite si `priceInCents <= 0`, et interdiction d'achat sur cours non publiés ou supprimés.
   - Extension du webhook Stripe : extraction des métadonnées `courseId` et `userId` pour débloquer spécifiquement la formation achetée.
   - Support de Stripe Embedded Checkout : ajout du mode `uiMode: EMBEDDED` avec `setMode(SessionCreateParams.Mode.PAYMENT)` (obligatoire avec l'API Stripe pour les sessions avec tarification), `returnUrl`, retour du `clientSecret` et de la `publishableKey` via `CheckoutSessionResponse` pour permettre un affichage 100% in-app sans redirection externe.
   - Résolution de l'ambiguïté de constructeur Spring Boot : annotation `@Autowired` explicite sur le constructeur multi-arguments de `PaymentController`.

4. **Expérience Apprenant & Paywall In-App Frontend (`index.html`, `cours.js`, `header.js`, `popovers-shared.html`, `success.html`)** :
   - Intégration de la modale Paywall In-App `#stripe-paywall-modal` : montage direct du formulaire Stripe via `stripe.initEmbeddedCheckout({ clientSecret })` dans une modale Cyber Dark élégante sans jamais quitter le site `noseumcode.fr`.
   - Suppression du fallback de redirection externe vers `checkout.stripe.com` pour garantir la persistance in-app du paywall Stripe.
   - Affichage dynamique du titre de formation, du tarif officiel (579 € pour HTML & CSS et JavaScript, 279 € pour Git & GitHub) et des badges de garantie dans l'en-tête du Paywall.
   - Gestion du cycle de vie du composant : chargement asynchrone sécurisé de Stripe.js v3, skeleton de chargement initial et destruction propre de l'instance (`checkout.destroy()`) à la fermeture.
   - Déclenchement automatique post-connexion : à la validation du login ou du register, la modale d'authentification cède instantanément la place au Paywall in-app du cours ciblé.
   - Sécurisation CSP et Permissions-Policy (`frontend/.htaccess`) : autorisation des scripts, frames et connexions API Stripe (`js.stripe.com`, `hooks.stripe.com`, `api.stripe.com`) et de l'API Payment Request.
   - Affichage dynamique et badges des tarifs officiels sur la page d'accueil (`index.html`), dans les cartes et dans les modales popover avec CTA d'inscription/achat.
   - Intégration du bouton "💳 Acheter / Débloquer" sur le catalogue, sur le panneau de cours verrouillé, et sur la bannière de prévisualisation dans la classe virtuelle.

5. **Tests & Validation Locale** :
   - Mise à jour et validation de `PaymentCheckoutServiceTest.java` (10 tests unitaires couvrant le mode embedded, `clientSecret`, tarifs officiels 579 € et 279 €, cours déjà payé, cours gratuit, webhook ciblé, sécurité JWT).
   - Exécution complète de la suite de tests : 41 tests réussis (`BUILD SUCCESS`, 0 erreur, 0 échec).
   - Test réel de création de session Stripe Checkout Embedded validé de bout en bout avec retour de `clientSecret` et `amount=57900`.

---

## 2026-09-25 | Conversation: 81fa4873-a589-4692-878b-98cdc85b45b9

**Type**: Correctif de bug (JPA Enum ContentType.TEXT & Déblocage post-paiement Stripe)
**Auteur**: Antigravity (Agent IA)
**Branche**: `fix/content-type-enum-text`

**Contexte & Problème**:
- L'appel API `GET /api/chapters/course/c1000000-0000-0000-0000-000000000001/all` (chargement des chapitres du cours HTML & CSS) échouait avec HTTP 400 Bad Request :
  `No enum constant com.codebangers.backend.content.model.Content.ContentType.TEXT`.
- Les migrations Flyway V007 et V011 inséraient des contenus pédagogiques avec la valeur `'TEXT'`, absente de l'énumération Java `Content.ContentType`.
- En environnement de test Stripe (et en cas de retard/absence du webhook), le déblocage du cours ne se synchronisait pas immédiatement côté client au retour sur `success.html` ou `cours.html`.

**Corrections appliquées**:
1. **Énumération `Content.ContentType` (`Content.java`)** :
   - Ajout de la constante `TEXT` dans l'énumération `ContentType`.
   - Ajout de la méthode annotée `@JsonCreator fromString(String)` pour une désérialisation JSON robuste et insensible à la casse.
2. **Synchronisation directe Stripe Checkout (`PaymentController.java`, `PaymentService.java`, `StripeGateway.java`, `StripeGatewayImpl.java`)** :
   - Ajout de l'endpoint sécurisé `GET /api/payments/confirm-session?session_id=...` interrogeant l'API Stripe (`Session.retrieve`) pour valider et basculer l'inscription en `PAID` immédiatement en cas de webhook différé ou non configuré en dev/test.
3. **Frontend (`success.html`, `cours.js`)** :
   - Appel automatique de `/api/payments/confirm-session` dès l'arrivée sur `success.html` ou `cours.html` avec le paramètre `session_id`.
   - Rafraîchissement automatique des inscriptions de l'apprenant pour déverrouiller instantanément le lecteur de cours.
4. **Tests & Validation** :
   - Ajout de tests unitaires pour `ContentType.TEXT` (`DomainModelTest.java`, `PaywallSecurityTest.java`).
   - Ajout de tests unitaires pour la confirmation de session Stripe (`PaymentCheckoutServiceTest.java`).
   - Suite complète au vert : 44 tests validés (`BUILD SUCCESS`, 0 échec, 0 erreur).

---

## 2026-09-25 — Sprint 3 : Comptes Apprenants, Sécurité de Session & E-mails Transactionnels

**Conversation ID**: `f6e9bae5-b228-429e-84f0-f0081a3ab81b`  
**Branche**: `feat/sprint-3-auth-emails`  
**Objectif**: Self-service de mot de passe oublié, pérennité des sessions via Refresh Tokens (RTR), notifications emails transactionnelles, rate limiting et durcissement OWASP.

### Réalisations & Corrections :
1. **E-mails Transactionnels (`EmailService.java`, `EmailServiceImpl.java`)** :
   - Abstraction `EmailService` avec intégration de `spring-boot-starter-mail` (JavaMailSender / SMTP / Brevo).
   - Template HTML responsive de réinitialisation de mot de passe au design Cyber Dark NoSeumCode avec bouton d'action sécurisé et expiration à 30 minutes.
   - Mode simulation sans échec si SMTP non configuré (environnements dev/tests).

2. **Flux Mot de Passe Oublié (`PasswordResetService.java`, `PasswordResetToken.java`, `AuthController.java`)** :
   - Migration Flyway `V012__create_password_reset_and_refresh_tokens.sql` créant les tables `password_reset_tokens` et `refresh_tokens`.
   - Stockage cryptographique sécurisé du token sous forme de hachage SHA-256 (`token_hash`) dans PostgreSQL.
   - Endpoint `POST /api/auth/forgot-password` conforme OWASP : protection anti-énumération d'adresses (renvoie toujours HTTP 200 avec message générique).
   - Endpoint `POST /api/auth/reset-password` vérifiant l'intégrité, l'expiration et l'usage unique du jeton, mettant à jour le hash BCrypt (13 rounds), et révoquant automatiquement toutes les sessions actives.
   - Page dédiée `frontend/reset-password.html` avec vérification de token, confirmation de mot de passe et bascule d'affichage œil.
   - Lien "Mot de passe oublié ?" et vue dédiée `#global-auth-forgot-view` intégrés dans `frontend/partials/popovers-shared.html`.

3. **Pérennité de Session & Refresh Token (`RefreshTokenService.java`, `RefreshToken.java`, `AuthResponse.java`)** :
   - Implémentation du pattern Refresh Token Rotation (RTR) conforme OWASP ASVS : chaque utilisation d'un refresh token révoque l'ancien et en émet un nouveau.
   - Détection proactive des attaques par rejeu : la réutilisation d'un token révoqué déclenche l'invalidation immédiate de toutes les sessions de l'utilisateur.
   - Endpoints `POST /api/auth/refresh` et `POST /api/auth/logout`.
   - Frontend (`header.js`, `dashboard.js`) : sauvegarde de `noseum_refresh_token`, actualisation automatique en cas de token expiré (HTTP 401).

4. **Durcissement de Sécurité OWASP (Issues Clôturées)** :
   - **ISSUE-001** ✅ : Secret JWT obligatoire sans fallback faible dans `JwtConfig.java`.
   - **ISSUE-002** ✅ : Access token 1h max + Refresh Token 7 jours avec rotation RTR.
   - **ISSUE-006** ✅ : `AuthRateLimitingFilter` protégeant les endpoints sensibles contre les attaques brute-force (15 requêtes/min par IP, HTTP 429 Too Many Requests).
   - **ISSUE-007** ✅ : Exigence minimale de 8 caractères pour les mots de passe (`RegisterRequest.java`, `ResetPasswordRequest.java`).
   - **ISSUE-016** ✅ : Ajout de `@Valid` sur `updateUser` dans `UserController.java`.

5. **Tests & Validation** :
   - Ajout de suites de tests unitaires dédiées : `PasswordResetServiceTest` (5 tests), `RefreshTokenServiceTest` (4 tests), `AuthRateLimitingFilterTest` (3 tests), `AuthControllerTest` (6 tests), enrichissement de `AuthServiceTest` (5 tests).
   - 64 tests unitaires au vert (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

## 2026-09-25 — Déploiement Frontend Multi-Environnements : Sous-domaine develop.noseumcode.fr sur o2switch

**Conversation ID**: `81fa4873-a589-4692-878b-98cdc85b45b9`  
**Branche**: `feat/ci-cd-develop-subdomain-o2switch`  
**Objectif**: Isoler les déploiements du frontend pour que la branche `develop` soit publiée sur le sous-domaine de test `develop.noseumcode.fr` sur o2switch sans impacter la production `noseumcode.fr` (réservée à `main`).

### Réalisations & Configurations :
1. **Séparation Stricte des Workflows FTP GitHub Actions** :
   - `.github/workflows/ftp.yml` : Déploiement Production réservé exclusivement aux pushs sur la branche `main` vers `${{ secrets.FTP_DIR }}` (noseumcode.fr).
   - `.github/workflows/ftp-dev.yml` : Déploiement Dev dédié déclenché sur la branche `develop` vers `${{ secrets.FTP_DIR_DEV }}` (avec repli automatique sur `develop.noseumcode.fr/`).
   - Isolation totale : aucun risque qu'un commit ou merge sur `develop` ne touche le site de production.
   - Support optionnel de credentials FTP dédiés pour le dev (`FTP_SERVER_DEV`, `FTP_USERNAME_DEV`, `FTP_PASSWORD_DEV`) avec repli sur les identifiants standards.
2. **CORS Backend Spring Security (`SecurityConfig.java`, `.github/workflows/deploy.yml`)** :
   - Ajout explicite de `https://develop.noseumcode.fr` et du pattern `https://*.noseumcode.fr` dans les origines autorisées du backend Spring Boot.
   - Mise à jour du fallback `CORS_ALLOWED_ORIGINS` dans le script de déploiement VM Oracle Cloud (`deploy.yml`).
3. **Sécurité Frontend & SEO Apache (`frontend/.htaccess`)** :
   - Ajout de `https://develop.noseumcode.fr` dans la directive `connect-src` de la Content Security Policy (CSP).
   - En-tête conditionnel `X-Robots-Tag: noindex, nofollow, noarchive` appliqué sur le sous-domaine `develop.noseumcode.fr` pour prévenir tout risque d'indexation prématurée ou de duplicate content par les moteurs de recherche.
4. **Validation Locale** :
   - 64 tests unitaires exécutés et validés avec succès (`BUILD SUCCESS`, 0 échec, 0 erreur).

---

## 2026-09-25 — Déploiement Dev o2switch (local-dir frontend) & Synchronisation .env Oracle

**Conversation ID**: `81fa4873-a589-4692-878b-98cdc85b45b9`  
**Branche**: `fix/ftp-dev-workflow-and-oracle-env`  
**Objectif**: Déployer uniquement les fichiers du site (`frontend/`) à la racine du sous-domaine develop, et propager les variables FTP de développement dans le `.env` de la VM Oracle lors du déploiement.

### Réalisations & Configurations :
1. **Optimisation Workflow FTP Dev (`.github/workflows/ftp-dev.yml`)** :
   - Ajout de `local-dir: ./frontend/` pour publier directement les fichiers web (`index.html`, `js`, `styles`, `.htaccess`) à la racine du sous-domaine o2switch.
   - Évite le téléversement du backend Java et des documents internes, réduisant le temps de déploiement à une quinzaine de secondes.
2. **Synchronisation .env sur la VM Oracle (`.github/workflows/deploy.yml`)** :
   - Propagation des secrets `FTP_USERNAME_DEV`, `FTP_PASSWORD_DEV` et `FTP_DIR_DEV` dans l'étape SSH et génération automatique dans `~/noSeumCode/backend/.env`.

---

## 2026-09-26 — Restructuration Stratégique, Audit Externe & Nouveaux Sprints 4 à 8

**Conversation ID**: `67344526-4298-4551-abb3-f061712dca15`  
**Branche**: `docs/update-roadmap-and-sprints`  
**Objectif**: Intégrer l'audit consolidé SEO/Marketing/Tech, restructurer le Kanban GitHub Projects et préparer le démarrage du Sprint 4 dans une conversation dédiée.

### Réalisations & Arbitrages :
1. **Création et Synchronisation du Kanban GitHub Projects** :
   - Création du projet GitHub Projects v2 : `NoSeumCode — Roadmap & Sprints Live` (Projet #1, lié au dépôt `cedricrgt/noSeumCode`).
   - Sprints 1, 2, 3 marqués comme terminés (`Done`).
   - Sprints 4 à 8 réorganisés et alimentés en draft issues / items (`In Progress` pour le Sprint 4, `Todo` pour les suivants).
2. **Décisions Métier & Architecturales (ADR-013, ADR-014, ADR-015)** :
   - **ADR-013** : Gamme par cohortes (petits groupes de 6 max). Pack Starter (6 semaines) avec **accès à vie illimité aux replays du tronc commun** conservé, et verrouillage des modules avancés (JavaScript, API, CI/CD) réservés au Pack Web.
   - **ADR-014** : Paiement fractionné BNPL via Klarna intégré nativement dans Stripe Checkout (fonds garantis immédiatement, zéro risque d'impayé).
   - **ADR-015** : Choix d'un système d'analytics cookieless privacy-first conforme RGPD (Plausible / Umami).
3. **Mise à Jour de la Documentation Persistante (`docs/ai/`)** :
   - `docs/ai/ROADMAP.md` : Diagramme de Gantt Mermaid natif mis à jour avec les 8 sprints et détail des livrables.
   - `docs/ai/PROJECT_CONTEXT.md` : Mise à jour de l'état actuel et cadrage du Sprint 4 (Quick Wins Conversion & Légal).
   - `docs/ai/DECISIONS.md` : Formalisation des ADR-013, ADR-014 et ADR-015.

---

## 2026-09-26 — Sprint 4 : Quick Wins Conversion, Déblocage Leads & Conformité Légale

**Conversation ID**: `ff966115-1f67-4e85-9d6d-2cc844285723`  
**Branche**: `feat/sprint-4-conversion-leads-legal`  
**Objectif**: Réparer les CTA orphelins du Hero, débloquer l'intégration CSP HubSpot, sécuriser les pages privées/PDFs et instaurer les pages légales complètes conformes au droit français et RGPD.

### Réalisations & Livrables :
1. **CTA du Hero (`frontend/index.html`, `frontend/styles/components/buttons.css`)** :
   - Bouton « Go coder » câblé avec redirection fluide vers `cours.html`.
   - Bouton « Teste et kiffe ! » configuré avec `popovertarget="promo-popup"` pour ouvrir directement la modale des sessions découvertes et réserver sa place.
   - Ajout de `text-decoration: none;` sur `.button` pour un rendu parfait des balises `<a>`.
2. **Déblocage CSP HubSpot & Lead Magnet (`frontend/.htaccess`, `frontend/js/popover-hubspot.js`)** :
   - Whitelist CSP dans `.htaccess` des domaines HubSpot (`js-eu1.hsforms.net`, `js.hsforms.net`, `forms-eu1.hsforms.com`, `forms.hsforms.com`, `api-eu1.hubspot.com`, `api.hubspot.com`) pour `script-src`, `frame-src`, `connect-src`, `form-action` et `img-src`.
   - `popover-hubspot.js` amélioré : indicateur de chargement animé, callback `onFormSubmitted` confirmant la réception du programme par e-mail, et messages d'erreur gracieux.
3. **Sécurisation de `thanks.html`, `robots.txt` et `sitemap.xml`** :
   - Ajout de `<meta name="robots" content="noindex, nofollow" />` sur `thanks.html`, `dashboard.html`, `reset-password.html` et `success.html`.
   - Suppression du tableau de bord privé (`dashboard.html`) de `sitemap.xml` et ajout des règles `Disallow` dans `robots.txt`.
   - Correction du bouton Git & GitHub dans `thanks.html` qui téléchargeait le PDF JavaScript par erreur (désormais lié à `documents/git&github.pdf`).
4. **Pages Légales & Conformité RGPD** :
   - Création de `frontend/mentions-legales.html` (LCEN, éditeur Cédric Ragot, hébergeurs o2switch et Oracle Cloud).
   - Création de `frontend/cgv.html` (modalités de vente, Klarna BNPL, droit de rétractation et règles des replays ADR-013).
   - Création de `frontend/politique-confidentialite.html` (conformité RGPD, conservation, sous-traitants Stripe/Brevo/HubSpot, politique de cookies privacy-first).
   - Mise à jour du footer (`partials/footer.html`) avec les liens légaux fonctionnels.
   - Retrait des boutons sociaux non implémentés (Facebook, GitHub) dans les vues de connexion et d'inscription (`popovers-shared.html`, `header.js`), et alignement de la longueur minimale du mot de passe à 8 caractères.
5. **Validation & Tests** :
   - Recompilation complète des bundles CSS (`node frontend/build.js`).
   - 64 tests unitaires et d'intégration Spring Boot validés avec succès (`BUILD SUCCESS`, 0 échec).

---

## 2026-09-26 — Sprint 5 : Portail Client Stripe (Factures & Abonnements Apprenant)

**Conversation ID**: `ff966115-1f67-4e85-9d6d-2cc844285723`  
**Branche**: `feat/sprint-5-stripe-customer-portal`  
**Objectif**: Permettre à chaque élève de télécharger en toute autonomie ses factures certifiées PDF, consulter ses reçus d'achat et administrer ses moyens de paiement en toute sécurité via le Portail Client officiel Stripe.

### Réalisations & Livrables :
1. **Intégration Stripe Billing Portal API (`backend/`)** :
   - Interface `StripeGateway` enrichie avec `createCustomerPortalSession(User user, String returnUrl)`.
   - Implémentation `StripeGatewayImpl` avec résolution dynamique du Customer Stripe par email (`Customer.list`), création instantanée si inexistant, et génération thread-safe de session `com.stripe.model.billingportal.Session` via `RequestOptions`.
   - Service applicatif `PaymentService` & contrôleur REST `PaymentController` exposant l'endpoint sécurisé `POST /api/payments/create-customer-portal-session` sous authentification JWT (`@AuthenticationPrincipal Jwt jwt`).
   - Couverture par tests unitaires dans `PaymentCheckoutServiceTest` (scénarios passant avec mock Stripe et non-authentifié HTTP 401).
2. **Interface Tableau de Bord (`frontend/`)** :
   - Ajout d'un bouton d'accès rapide « Factures » avec icône SVG dans la barre d'outils supérieure de `dashboard.html`.
   - Ajout d'une section dédiée « Facturation & Abonnements » avec carte descriptive dans la vue Apprenant de `dashboard.html`.
   - Implémentation de la fonction cliente `openStripeCustomerPortal()` dans `frontend/js/dashboard.js` avec état de chargement visuel, gestion des erreurs et redirection fluide vers Stripe.
3. **Validation & Tests** :
   - Recompilation des bundles CSS dist (`node frontend/build.js`).
   - 66 tests unitaires et d'intégration Maven exécutés avec succès (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

## 2026-09-26 — Sprint 6 : Workshops Gratuits Toussaint (Jauge 6 Élèves, Acquisition & Synchronisation Apprenant)

**Conversation ID**: `4e2adcdb-309a-40f9-9c4d-715b084694af`  
**Branche**: `feat/sprint-workshops-toussaint`  
**Objectif**: Mettre en place les ateliers découvertes gratuits de la Toussaint (26 au 29 octobre 2026) avec limitation stricte à 6 places par session côté backend, bandeau promo animé, page dédiée `workshops.html` et synchronisation dans le tableau de bord apprenant.

### Réalisations & Livrables :
1. **Backend & Modèle de Données (`backend/`)** :
   - Enrichissement de l'entité `Workshop` avec `theme` et `maxParticipants` (défaut à 6).
   - Migration Flyway `V013__seed_toussaint_workshops.sql` initialisant les 4 sessions Toussaint 2026 (Web & IA, Algorithmie, Cyber, Fullstack).
   - DTOs `WorkshopRequest`, `WorkshopResponse` et `UserWorkshopResponse` enrichis avec calcul dynamique des places (`registeredCount`, `remainingSeats`, `isFull`, `isUserRegistered`).
   - Contrôle strict de jauge dans `UserWorkshopService` : rejet avec exception métier (`IllegalStateException` -> HTTP 400 Bad Request) dès que 6 élèves sont inscrits.
   - Protection contre les doublons (`DuplicateResourceException`) et suppression sécurisée anti-IDOR avec `DELETE /api/user-workshops/workshop/{workshopId}`.
   - 14 nouveaux tests unitaires (`UserWorkshopServiceTest` et `WorkshopServiceTest`).
2. **Frontend & Expérience Utilisateur (`frontend/`)** :
   - Réactivation du bandeau promotionnel header avec animation gradient et compte à rebours vers la Toussaint.
   - Création de la page dédiée `frontend/workshops.html` et de sa feuille de style responsive `frontend/styles/pages/workshops.css` (bundle minifié `workshops.min.css`).
   - Client dynamique `frontend/js/workshops.js` : interrogation de `/api/workshops`, jauge visuelle de 6 places, synchronisation de l'état d'inscription, fallback élégant si déconnecté.
   - Inscription automatique post-connexion/inscription via double stockage (`localStorage` et `sessionStorage` : `noseum_pending_workshop_id`) dans `header.js`, `workshops.js` et finalisation automatique avec toast dans `dashboard.js`.
   - Intégration dans `dashboard.html` et `dashboard.js` de la section « Mes Ateliers Découvertes » avec désinscription en 1 clic.
3. **Export CRM HubSpot pour les Inscrits aux Ateliers** :
   - Ajout de l'endpoint sécurisé `GET /api/user-workshops/export/hubspot-csv` sous contrôle de rôle (`ADMIN`, `TEACHER`).
   - Formatage conforme aux exigences techniques HubSpot : fichier `.csv`, encodage UTF-8 avec BOM (`\uFEFF`), en-têtes standard (`Email`, `First Name`, `Last Name`, `Lifecycle Stage`, `Atelier`, `Thématique`, `Date Atelier`, `Date Inscription`).
   - Bouton de téléchargement 1-clic intégré dans l'espace administrateur de `dashboard.html` et barre d'actions admin dynamique sur `workshops.html`.
4. **Validation & Tests** :
   - Recompilation des bundles CSS dist (`node frontend/build.js`).
   - 82 tests unitaires et d'intégration Maven exécutés avec succès (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

## 2026-09-27 — Correctif : Syntaxe UUID PostgreSQL Flyway V013 & Auto-Clean Déploiement Oracle VM

**Conversation ID**: `4e2adcdb-309a-40f9-9c4d-715b084694af`  
**Branche**: `fix/oracle-flyway-uuid-syntax`  
**Objectif**: Corriger l'échec de démarrage du conteneur Spring Boot sur la VM Oracle Cloud suite à l'erreur PostgreSQL 22P02 (`invalid input syntax for type uuid: "w1000000-0000-0000-0000-000000000001"`) et fiabiliser les déploiements continus.

### Réalisations & Corrections :
1. **Migration Flyway V013 (`backend/src/main/resources/db/migration/V013__seed_toussaint_workshops.sql`)** :
   - Remplacement des identifiants avec préfixe non hexadécimal `w1000000-...` par des UUIDs hexadécimaux valides `b1000000-0000-0000-0000-000000000001` à `...0004` strictement conformes à la norme UUID de PostgreSQL.
2. **Synchronisation Frontend (`frontend/js/workshops.js`)** :
   - Mise à jour des identifiants des ateliers de secours (`FALLBACK_WORKSHOPS`) avec les nouveaux UUIDs hexadécimaux `b1000000-...`.
3. **Auto-Clean Flyway dans le Workflow CI/CD (`.github/workflows/deploy.yml`)** :
   - Ajout d'une commande de purge automatique et idempotente des migrations échouées (`DELETE FROM flyway_schema_history WHERE success = false;`) avant le redémarrage du conteneur backend, permettant le rejeu immédiat et évitant le blocage `Detected failed migration`.
4. **Validation & Tests** :
   - 82 tests unitaires et d'intégration Spring Boot validés avec succès (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

## 2026-09-27 — Correctif : Inscription Workshop Post-Connexion & Affichage Dashboard

**Conversation ID**: `4e2adcdb-309a-40f9-9c4d-715b084694af`  
**Branche**: `fix/workshop-registration-post-login`  
**Objectif**: Corriger l'absence de confirmation et la non-apparition de l'atelier découverte dans le dashboard après connexion d'un utilisateur existant (ou création de compte).

### Réalisations & Corrections :
1. **Initialisation Session et Token Dashboard (`frontend/js/dashboard.js`)** :
   - Correction de l'ordre d'initialisation dans `loadStoredAuth()` : `currentAuth.token` et `currentAuth.user` sont désormais initialisés AVANT tout appel `apiFetch`. Auparavant, l'auto-inscription post-redirection appelait l'API avec un token `null`, provoquant un HTTP 401 Unauthorized silencieux et la perte de l'identifiant d'atelier en attente.
   - Prise en charge du flag de session `noseum_workshop_just_registered` pour déclencher systématiquement le toast de confirmation de réservation au montage du tableau de bord.
   - Amélioration de `showGlobalDashboardToast` avec support du type `info`.
2. **Tunnel d'Authentification Post-Clic Atelier (`frontend/js/header.js`)** :
   - Dans `handleGlobalEmailLogin` et `handleGlobalEmailRegister`, exécution immédiate de la requête `POST /api/user-workshops/{id}` avec le jeton d'accès tout juste reçu (`data.accessToken`), nettoyage des clés `localStorage` / `sessionStorage`, puis redirection directe vers `dashboard.html` avec le flag de confirmation.
3. **Gestion des Statuts d'Inscription (`frontend/js/workshops.js`)** :
   - Prise en charge gracieuse du code HTTP 409 Conflict (`DuplicateResourceException`) dans `registerToWorkshop` pour confirmer à l'utilisateur sa place déjà réservée au lieu d'afficher une erreur rouge générique.
4. **Validation Locale & Tests** :
   - Recompilation complète des bundles CSS (`node frontend/build.js`).
   - 82 tests unitaires et d'intégration Spring Boot validés avec succès (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

## 2026-09-27 — Correctif : Redirection Dynamique OAuth2 Multi-Environnements & Inscription Ateliers

**Conversation ID**: `4e2adcdb-309a-40f9-9c4d-715b084694af`  
**Branche**: `fix/oauth2-dynamic-redirect-uri`  
**Objectif**: Permettre la redirection dynamique du callback OAuth2 vers l'origine frontend initiatrice (`develop.noseumcode.fr`, `noseumcode.fr` ou `localhost:3000`), évitant ainsi le basculement forcé vers la production lors d'un login Google sur le site de dev et préservant les données de session (inscriptions ateliers en attente dans `localStorage`).

### Réalisations & Corrections :
1. **Filtre d'Origine et de Sécurité OAuth2 (`OAuth2RedirectUriFilter.java`)** :
   - Capture du paramètre `redirect_uri` (ou de l'en-tête `Referer`) sur les routes d'initiation `/oauth2/authorization/**`.
   - Contrôle strict anti-Open Redirect par liste blanche (`https://noseumcode.fr`, `https://develop.noseumcode.fr`, `https://*.noseumcode.fr`, `localhost:3000/5500/8080`).
   - Stockage sécurisé dans un cookie HTTP-only `SameSite=Lax` et en session pour transmission au callback.
2. **Gestionnaire de Succès d'Authentification OAuth2 (`OAuth2AuthenticationSuccessHandler.java`)** :
   - Récupération de la cible de redirection autorisée, suppression immédiate du cookie (durée 0), et redirection vers le dashboard de l'environnement source avec transmission des claims JWT dans le fragment d'URL (`token`, `refreshToken`, `role`, `userName`, `firstName`, `email`).
3. **Configuration de Sécurité (`SecurityConfig.java`, `application.properties`)** :
   - Injection de `OAuth2RedirectUriFilter` avant `OAuth2AuthorizationRequestRedirectFilter`.
   - Ajout explicite de `https://develop.noseumcode.fr` dans les origines CORS autorisées par défaut.
4. **Frontend (`frontend/js/header.js`)** :
   - Passage dynamique de `?redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard.html')}` sur les liens des fournisseurs sociaux Google et Discord.
5. **Tests & Validation** :
   - Ajout des suites de tests unitaires `OAuth2RedirectUriFilterTest` (6 tests) et `OAuth2AuthenticationSuccessHandlerTest` (4 tests).
   - 92 tests unitaires et d'intégration Spring Boot validés avec succès (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

## 2026-09-27 — Sprint 7 : Nouvelle Gamme & Accès Cohortes (Starter Replay à Vie, Pack Web, Mentorat VIP & Klarna BNPL)

**Conversation ID**: `7af84ac3-b5b9-431f-8c77-e4358acf88bf`  
**Branche**: `feat/sprint-6-cohorts-plans-klarna`  
**Objectif**: Nettoyage des faux cours d'essai de la base et du frontend, introduction des promotions/cohortes limitées à 6 élèves max (ADR-013), structuration des offres (Starter 279 €, Pack Web 579 €, Mentorat VIP 879 €) avec accès à vie aux replays de fondation pour Starter, et intégration du paiement fractionné Klarna BNPL via Stripe Checkout (ADR-014).

### Réalisations & Livrables :
1. **Base de Données & Migration Flyway V014 (`V014__clean_dummy_courses_and_create_cohorts_and_tiers.sql`)** :
   - Soft delete des deux faux cours d'essai Java 21 / Clean Architecture (`is_deleted = true`).
   - Ajout de la colonne `required_tier` (STARTER / WEB) sur la table `course` avec index dédié.
   - Création de la table `cohort` avec `max_students` = 6, statut enum (`UPCOMING`, `OPEN`, `FULL`, `IN_PROGRESS`, `COMPLETED`), slugs uniques et seed de cohortes (Novembre 2026 Alpha, Janvier 2027 Beta).
   - Enrichissement de `enrollment` avec `tier` (STARTER / WEB / VIP) et clé étrangère `cohort_id`.
2. **Backend & Architecture Métier (`backend/`)** :
   - Création du package `cohort` avec entité JPA `Cohort`, `CohortRepository`, DTOs `CohortRequest`/`CohortResponse` (calcul dynamique `remainingSeats` et `isFull`), `CohortService` et `CohortController` (`GET /api/cohorts`, `GET /api/cohorts/{slug}`, `GET /api/cohorts/available`).
   - Enums `CourseTier` et `EnrollmentTier` pour la hiérarchisation des droits.
   - Contrôle d'accès et paywall serveur (`EnrollmentService.hasPaidAccess`) : vérification du palier souscrit. Les élèves Starter conservent l'accès perpétuel aux replays/cours de fondation (HTML/CSS, Git) et sont rejetés (HTTP 403 Forbidden) sur les modules avancés (JavaScript, APIs). Les élèves Web et VIP disposent de l'accès intégral.
   - Intégration Stripe & Klarna BNPL (`StripeGatewayImpl`, `PaymentService`, `PaymentController`) : support des modes `card`, `klarna`, `link` dans `payment_method_types`, transmission des métadonnées `tier` et `cohortId` lors de la session Stripe Checkout, synchronisation automatique de la cohorte et du plan dans `Enrollment` à la réception du webhook `checkout.session.completed`.
3. **Frontend & Expérience Apprenant (`frontend/`)** :
   - `header.html` & `footer.html` : remplacement de « Formations » par « Parcours » dans le menu de navigation principal (Navbar) et de pied de page.
   - `index.html` : remplacement du titre de section « Nos Cours » par « Choisis ton Pack » et substitution des 3 cartes de cours isolés par les 3 offres phares : **Pack Fondations** (Niveau 1, 279 €), **Pack Dynamique** (Niveau 2, 579 €) et **Pack Mentorat VIP** (Niveau 3, 879 €) avec descriptifs orientés bénéfices et rassurance (promotions 6 élèves max, replay à vie garanti).
   - Modales popovers immersives : refonte exhaustive au clic sur « Plonge dans le design web » (Pack Fondations) avec programme complet détaillé (HTML5 sémantique, CSS3 Flexbox/Grid, Git/GitHub, projet fil rouge, Discord promo) et CTA d'inscription direct. Enrichissement identique des modales Pack Dynamique et Pack Mentorat VIP (4h de coaching one-to-one avec Cédric).
   - `cours.html` & `cours.js` : titre mis à jour en « Nos Parcours de Formation - NoSeumCode », harmonisation des libellés de paliers (`Pack Fondations`, `Pack Dynamique`, `Pack Mentorat VIP`).
   - `dashboard.js` : synchronisation des badges de paliers et affichage de la mention `♾️ Replay à vie` pour le tronc commun Fondations.
   - Recompilation complète des bundles CSS dist (`node frontend/build.js`).
4. **Tests & Validation Qualité** :
   - Ajout des suites de tests unitaires `CohortServiceTest` (9 tests) et `CohortControllerTest` (6 tests).
   - Enrichissement de `PaywallSecurityTest` (11 tests validant l'accès à vie Starter et le verrouillage Web) et `PaymentCheckoutServiceTest` (16 tests validant Klarna et la synchronisation des métadonnées cohorte/tier).
   - 112 tests unitaires et d'intégration Spring Boot validés avec succès (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

## 2026-09-27 — Refactor Parcours : Endpoint Dédié /parcours, Pack VIP Catalogue & UX Modales Mobile

**Conversation ID**: `7af84ac3-b5b9-431f-8c77-e4358acf88bf`  
**Branche**: `feat/sprint-6-cohorts-plans-klarna`  
**Objectif**: Passage à l'endpoint dédié `/parcours` (`parcours.html` avec redirection 301 de l'ancien `/cours`), intégration du Pack Mentorat VIP (879 €) dans le catalogue à la place du cours Git isolé, refonte mobile-first des modales d'accueil (suppression du scrollbox encombrant au profit de 3 à 4 points clés percutants), et transfert du programme pédagogique exhaustif directement sur la vue de paiement / paywall Stripe du pack.

### Réalisations & Livrables :
1. **Endpoint & Routage Dédié `/parcours`** :
   - Création de `frontend/parcours.html` et redirection 301 de `cours.html` et `course.html` vers `parcours.html` avec conservation des paramètres d'URL.
   - Configuration Apache `.htaccess` : redirection 301 de `^cours/?$` et `^cours\.html$` vers `/parcours`, et réécriture interne transparente de `^parcours/?$` vers `parcours.html`.
   - Backend Spring Boot : alias `@RequestMapping({"/api/courses", "/api/parcours"})` sur `CourseController` et autorisation `permitAll()` sur `/api/parcours/**` dans `SecurityConfig`.
   - Mise à jour de tous les liens internes (`header.html`, `footer.html`, `index.html`, `dashboard.html`, `success.html`, `dashboard.js`, `cours.js`, `header.js`).
2. **Intégration du Pack Mentorat VIP au Catalogue** :
   - Migration Flyway `V015__transform_course3_to_vip_pack.sql` : alignement des intitulés officiels (Starter Pack Fondations 279 €, Pack Dynamique 579 €) et transformation de la formation 3 en Pack Mentorat VIP (879 €, tier VIP, 4h de coaching individuel avec Cédric).
   - `cours.js` : mise à jour des fallbacks et de la logique d'affichage du catalogue pour présenter les 3 packs officiels sans aucun cours isolé résiduel.
3. **Refonte UX Mobile des Modales d'Accueil (`index.html`)** :
   - Suppression du conteneur déroulant à défilement vertical (`overflow-y: auto`), source de friction majeure sur smartphone (conforme à `rule-19-mobile-best-pratices`).
   - Remplacement par 3 à 4 puces synthétiques à fort impact (compétences cibles, promotion de 6 élèves max, replay illimité garanti, projet concret déployé ou 4h de coaching individuel).
   - Préservation des cibles tactiles supérieures à 44x44pt et du bouton d'action principal.
4. **Déplacement du Programme Détaillé sur la Page/Vue de Paiement (`popovers-shared.html`, `header.js`)** :
   - Intégration d'un bloc dépliable `<details open>` dans la modale de paiement in-app (`#stripe-paywall-modal`).
   - Injection dynamique du syllabus complet (modules, descriptifs détaillés, rassurance cohorte/replays) via `openStripePaywall()` en fonction du pack sélectionné (`STARTER`, `WEB`, `VIP`) avant le terminal Stripe Embedded.
5. **Validation & Tests** :
   - Recompilation complète des bundles CSS dist via `node frontend/build.js`.
   - 112 tests unitaires et d'intégration validés avec succès sous Maven (`BUILD SUCCESS`, 0 échec).

---

## 2026-09-27 — Correctif : Résolution Avertissement Google Safe Browsing / Lookalike (develop.noseumcode.fr)

**Conversation ID**: `5eff324b-9634-487e-a43d-fbc635b0c995`  
**Branche**: `fix/google-safe-browsing-deceptive-warning`  
**Objectif**: Supprimer l'avertissement de sécurité Google Chrome (« Site dangereux / Site trompeur » ou Lookalike « Attention : faux site ») sur `https://develop.noseumcode.fr` en déclarant officiellement l'association des domaines NoSeumCode, en isolant le sous-domaine de dev des crawlers et en durcissant la sécurité HTTP.

### Réalisations & Livrables :
1. **Digital Asset Links (`frontend/.well-known/assetlinks.json`)** :
   - Création de la déclaration officielle Google Digital Asset Links associant bidirectionnellement `noseumcode.fr`, `www.noseumcode.fr` et `develop.noseumcode.fr` pour les permissions `get_login_creds` et `handle_all_urls`.
   - Permet à Chrome et aux algorithmes Safe Browsing de valider formellement la légitimité du sous-domaine et de supprimer les alertes heuristiques d'hameçonnage / lookalike.
2. **Isolation Robots & Staging (`frontend/robots-dev.txt`, `frontend/.htaccess`)** :
   - Création de `robots-dev.txt` (`User-agent: * \n Disallow: /`).
   - Règle de réécriture Apache transparente servant `robots-dev.txt` sur `develop.noseumcode.fr`, interdisant ainsi formellement à Googlebot et autres robots l'exploration du site de pré-production.
3. **Durcissement Sécurité Apache (`frontend/.htaccess`)** :
   - Règle d'exemption dédiée pour `/.well-known/` évitant tout conflit de redirection.
   - En-tête MIME `Content-Type: application/json; charset=utf-8` et en-tête `Access-Control-Allow-Origin: *` garantis pour `assetlinks.json`.
   - Blocage HTTP strict (403 Forbidden) des scripts de build (`*.sh`, `*.ps1`, `build.js`), manifestes npm (`package.json`, `package-lock.json`), documentation (`README.md`), fichiers `.env*` et dotfiles résiduels.
4. **Filtrage Workflows CI/CD FTP (`.github/workflows/ftp-dev.yml` et `ftp.yml`)** :
   - Configuration d'un filtre `exclude:` exhaustif pour empêcher l'envoi vers le serveur FTP de tous les fichiers internes hors production (`.git`, `node_modules`, `*.sh`, `*.ps1`, `build.js`, `package*.json`, `README.md`, `.env*`).
5. **Indicateur Visuel de Pré-production (`frontend/js/header.js`)** :
   - Injection dynamique d'un bandeau subtil et mobile-friendly en haut de page lorsque le domaine est `develop.noseumcode.fr` (« 🛠️ Environnement de test NoSeumCode — Espace réservé à la pré-production ») assurant une transparence totale pour les visiteurs et les auditeurs de sécurité Google.
6. **Validation Locale & Tests** :
   - Recompilation complète des bundles CSS dist (`node frontend/build.js`).
   - Exécution intégrale de la suite de 112 tests unitaires et d'intégration Spring Boot (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

## 2026-09-28 — Sprint 8 : Performance Web & SEO Technique (Images <800Ko, SSG Statique, CLS, Cache Apache)

**Conversation ID**: `935e91a7-2d44-44b3-82bb-f9975fc875cf`  
**Branche**: `feat/sprint-web-performance-seo`  
**Objectif**: Réduction drastique du poids des images du frontend (passage sous le seuil strict de 800 Ko total pour l'ensemble du dossier images), création de pages statiques (SSG) dédiées aux formations avec métadonnées Open Graph (1200x630 px) et Schema.org Course, suppression du Cumulative Layout Shift (CLS), et configuration de la compression `mod_deflate` et de l'expiration du cache Apache dans `.htaccess`.

### Réalisations & Livrables :
1. **Compression Drastique des Images & Formats Next-Gen (<800 Ko total)** :
   - Remplacement du faux `git.webp` (JPEG non compressé de 2,73 Mo) par un vrai WebP optimisé (83,9 Ko, -96,9%).
   - Conversion et compression de tous les assets visuels de cours : `html.webp` (23,3 Ko), `javascript.webp` (41,8 Ko), `git.jpg` (64,4 Ko).
   - Optimisation avec quantification palette des logos et icônes : `logo-css.png` (18,4 Ko), `logo-html.png` (11,2 Ko), `logo-js.png` (11,1 Ko), `logo-react.png` (14,2 Ko), `favicon.png` (7,3 Ko, était 235 Ko), `logo.png` (28,2 Ko, était 274 Ko), `student-female-smiling.png` (71,3 Ko, était 899 Ko).
   - Génération de 3 bannières Open Graph haute définition 1200x630 px : `og-main.png` (107 Ko), `og-starter.png` (102,6 Ko), `og-pack-web.png` (105,1 Ko).
   - **Bilan Poids** : Poids total de l'ensemble du répertoire `frontend/images/` ramené de **11,68 Mo** à **711 Ko** (-94% de réduction globale, et 379 Ko pour les images de contenu pur). Objectif < 800 Ko pleinement atteint.
2. **Pages Statiques Formations & Données Structurées SSG** :
   - Création de `frontend/formations/starter.html` : landing page statique dédiée au Pack Starter (HTML5, CSS3, Git), intégrant le Schema.org `Course` JSON-LD officiel (tarif 279 €, débutant, formateur Cédric Ragot), meta Open Graph 1200x630 px et Twitter Cards.
   - Création de `frontend/formations/pack-web.html` : landing page statique pour le Pack Web complet (JavaScript ES6+, APIs REST, option VIP à 879 €), balisage Schema.org `Course` complet avec offres multiples et meta Open Graph dédiées.
   - Création de `frontend/formations/index.html` : hub comparatif des offres avec matrice détaillée (tarifs, jauge 6 max, horaires, replays à vie, support Discord).
   - Réécriture d'URL propres dans `.htaccess` : `/formations/starter`, `/formations/pack-web`, `/formations`.
3. **Optimisation Core Web Vitals & Élimination du CLS** :
   - Hauteur déterministe assignée à l'en-tête `.header` (`height: var(--header-height)` soit 153px desktop, 118px mobile) et au conteneur `.header__container`.
   - Dimensionnement explicite et `aspect-ratio: 320 / 239` sur le logo NoSeumCode (`.logo__img`), garantissant un calcul de boîte immédiat par le moteur de rendu navigateur avant le téléchargement des images.
   - Résilience multi-profondeur dans `header.js` via la fonction `resolveAssetPath` pour charger de manière fiable les partiels (`header.html`, `footer.html`, `popovers-shared.html`, `schedule.json`) sur les routes imbriquées `/formations/*`.
4. **Compression Apache `mod_deflate` & Caching `mod_expires` (`frontend/.htaccess`)** :
   - Activation de `mod_deflate` pour tous les types MIME textuels (HTML, CSS, JS, JSON, XML, SVG, WOFF, WOFF2).
   - Durées d'expiration `mod_expires` et en-têtes `Cache-Control` : 1 an pour les assets statiques immuables (images, favicons, polices web WOFF2), 1 mois pour CSS/JS, et 0 seconde (`no-cache, must-revalidate`) pour les documents HTML afin de garantir un déploiement instantané.
5. **SEO Technique & Sitemap** :
   - Mise à jour de `frontend/sitemap.xml` : ajout des routes propres `/formations/starter`, `/formations/pack-web`, `/formations`, intégration de `workshops.html`, et alignement des priorités et dates de modification.
   - Balises Open Graph 1200x630 px généralisées sur `index.html`, `parcours.html` et `workshops.html`.
   - Ajout des liens internes vers les formations dans le footer partagé (`footer.html`).
6. **Pipeline de Build & Validation Locale** :
   - Mise à jour de `frontend/build.sh` pour intégrer la compilation et minification de `formations.min.css` (24 Ko) et `workshops.min.css` (21 Ko).
   - Exécution complète de la suite de 112 tests unitaires et d'intégration Spring Boot (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

## 2026-09-28 — Sprint 9 : Refonte Copywriting & Rassurance Parents/Jeunes (Mentor & Analytics Plausible/Umami)

**Conversation ID**: `75f79e74-a07a-434f-8d80-e223f416f4b8`  
**Branche**: `feat/sprint-9-copywriting-analytics`  
**Objectif**: Repositionnement du message d'accroche et du hero (« Apprendre à coder en construisant de vrais projets »), mise en place du double discours jeunes (16-25 ans) et parents, création de la section dédiée « Ton Mentor » (Cédric Ragot), intégration d'une solution d'analytics cookieless privacy-first (Plausible / Umami) conforme au RGPD, et mesure automatisée des conversions (clics CTA, soumissions formulaires HubSpot, checkouts Stripe).

### Réalisations & Livrables :
1. **Repositionnement Copywriting & Hero (`frontend/index.html`, `hero.css`)** :
   - Titre principal aligné sur la proposition de valeur : *« Apprendre à coder en construisant de vrais projets ! »*.
   - Sous-titre et descriptif clarifiés : cours en direct en promotions de 6 élèves max, 2h de cours interactif + 2h d'atelier projet par semaine pour maîtriser le web sans décrocher.
   - Ajout d'une barre de badges de rassurance visuelle dans le hero (promotions de 6 élèves max, 2h+2h / semaine, replays à vie illimités).
   - Micro-copie de réassurance sous les CTAs : sans prérequis, facilités de paiement 3x/4x via Klarna, et encadrement bienveillant garanti.
   - Balisage SEO & OpenGraph / Twitter Cards synchronisé avec le nouveau message d'accroche.

2. **Section Double Regard : Rassurance Parents & Jeunes (`frontend/index.html`, `rassurance.css`)** :
   - Création de la section `#rassurance` avec grille comparative double perspective :
     * **Côté Jeunes (16-25 ans)** : Du concret sans théorie assommante (code dès la 1ère heure), zéro solitude face aux bugs (aide en temps réel), portfolio professionnel déployé sur GitHub pour impressionner les recruteurs, et salon d'entraide Discord 7j/7.
     * **Côté Parents** : Rythme structuré et compatible avec les études (soirées/samedis, 2h cours + 2h atelier), promotions limitées à 6 élèves max (garantie d'écoute et de suivi individuel), mentor senior expérimenté (+10 ans d'expertise logicielle), et replays à vie avec paiement sécurisé Stripe & Klarna.

3. **Section "Ton Mentor" — Cédric Ragot (`frontend/index.html`, `mentor.css`, `mentor-cedric.webp`)** :
   - Création de la section `#mentor` valorisant l'expertise technique et la pédagogie active de Cédric (fondateur et ingénieur logiciel senior avec plus de 10 ans d'expérience).
   - Intégration d'un portrait WebP optimisé (8,2 Ko) avec badge vérifié « Formateur & Lead Dev ».
   - Présentation des 3 piliers de la méthode NoSeumCode :
     1. *Code First (Pratique immédiate)* : apprentissage par la pratique directe, manipulation des outils pros dès la première heure.
     2. *Résolution sans Jugement* : dédramatisation des bugs, apprentissage de la console et du débogage méthodique.
     3. *Accompagnement & Suivi 7j/7* : disponibilité en direct sur Discord et révision personnalisée du code.
   - Encadré de mise en valeur de l'option **Mentorat VIP** (4h de coaching individuel 1-to-1).
   - Ajout de l'entrée « Ton Mentor » dans la barre de navigation du header partagé (`frontend/partials/header.html`).

4. **Analytics Cookieless & Privacy-First Conforme RGPD (`frontend/js/analytics.js`, `frontend/.htaccess`)** :
   - Création d'un module d'orchestration analytics ultra-léger (<1,5 Ko) et respectueux de la vie privée, exempté de consentement cookies (CNIL) car 100% cookieless et sans collecte de données personnelles (PII).
   - Support natif et simultané de Plausible Analytics (`window.plausible`) et d'Umami Analytics (`window.umami.track`), avec repli de développement fluide (`console.debug`) et respect du flag Do Not Track (`navigator.doNotTrack`).
   - Mesure automatisée des 3 grands objectifs de conversion :
     * **Clics CTA** : écoute déléguée des boutons d'action (`cta_click`) avec identification du bouton, du texte et de l'emplacement (`hero_go_coder`, `hero_workshop_promo`, `mentor_vip_reserve`, etc.).
     * **Soumissions formulaires HubSpot** : écoute native des messages postMessage HubSpot (`hsFormCallback` / `onFormSubmitted`) et callback direct dans `popover-hubspot.js` (`hubspot_form_submitted`).
     * **Tunnel de paiement Stripe** : déclenchement de `checkout_initiate` à chaque sélection de pack dans `header.js` (`initiateCourseEnrollment`), et déclenchement de `checkout_completed` à l'atterrissage sur `success.html` (avec `course_id` et `session_id`).
     * **Téléchargements de documents** : suivi automatique des téléchargements de brochures PDF (`pdf_download`).
   - Durcissement de la Content Security Policy dans `.htaccess` : autorisation de `https://plausible.io`, `https://cloud.umami.is` et `https://api-gateway.umami.dev` dans `script-src` et `connect-src`.
   - Déploiement du script de tracking sur l'ensemble des pages de l'application (`index.html`, `formations/index.html`, `formations/starter.html`, `formations/pack-web.html`, `workshops.html`, `parcours.html`, `success.html`, `thanks.html`, `dashboard.html`).

5. **Build CSS & Tests** :
   - Mise à jour de `build.js` et `build.sh` pour intégrer `rassurance.css` et `mentor.css` dans le bundle minifié `homepage.min.css` (28,5 Ko).
   - Validation de la syntaxe JavaScript avec Node.js.
   - Exécution complète des 112 tests unitaires et d'intégration Spring Boot (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

### 2026-09-28 — Sprint 10 : Optimisation PageSpeed & Core Web Vitals (LCP < 1.5s, CLS 0.00, Déferrement Stripe & GPU Compositing)
**Conversation**: `435919e4-c088-4d3b-ab96-450cd0467e7d`  
**Branche**: `feat/sprint-10-pagespeed-web-vitals`

#### Ce qui a changé :
1. **Déferrement & Suppression Tiers Bloquants (Task 10.1 / ADR-017)** :
   - Retrait du SDK synchrone `https://js.stripe.com/v3/` de la page d'accueil `frontend/index.html` (-278 Ko, élimination de plus de 3 150 ms de temps de blocage du thread principal).
   - Le SDK Stripe est désormais chargé uniquement et de manière dynamique à la demande via `ensureStripeJsLoaded()` lors du déclenchement du paywall ou sur `parcours.html`.

2. **Élimination des Ressources Bloquant le Rendu & Minification JS (Task 10.2)** :
   - Ajout de l'attribut `defer` sur tous les scripts de la page d'accueil (`analytics.js`, `script.min.js`, `header.min.js`, `popover-hubspot.min.js`).
   - Automatisation de la minification JS avec Terser dans `build.js`, `build.sh` et `build.ps1` (`header.min.js` à 38,4 Ko, `script.min.js` à 3,8 Ko, `popover-hubspot.min.js` à 2,7 Ko).
   - Ajout du script `"build": "node build.js"` dans `frontend/package.json`.

3. **Éradication Complète du CLS sur le Hero & Compositing GPU (Task 10.3)** :
   - Remplacement de l'animation non-composée `gradientShift` (qui animait `background-position-x` et déclenchait des repaints continus CPU) par l'animation accélérée sur GPU `gradientGlow` avec `transform: translateZ(0)` et `opacity` dans `frontend/styles/typo/typography.css`, avec désactivation automatique sous `prefers-reduced-motion`.
   - Suppression de la mutation dynamique de style `backgroundSize = "200% 200%"` au runtime dans `frontend/js/script.js`.
   - Calibrage strict de la hauteur déterministe d'en-tête (153px desktop, 118px mobile) dans `updateHeaderHeightVar()` de `header.js` afin d'éviter toute recalculation de marge et affaissement brutal du Hero au chargement.

4. **Optimisation du Waterfall Réseau & Assets Locaux (Task 10.4)** :
   - Parallélisation complète du chargement des partials HTML (`header.html`, `footer.html`, `popovers-shared.html`) via `Promise.all()` dans `header.js` (`loadPartials()`), réduisant la cascade réseau de 3 requêtes en série à 1 seul aller-retour HTTP.
   - Redimensionnement et optimisation du logo en WebP natif (8,9 Ko) et PNG optimisé (8,2 Ko au lieu de 28,8 Ko) avec dimensions explicites `width="141"` `height="105"` et balise `<picture>` dans `header.html` et `footer.html`.
   - Rapatriement local et compression WebP des 3 visuels de cartes de services (`images/card/card-live.webp`, `card-projects.webp`, `card-coaching.webp`), des cartes de blog (`images/blogCards/blog-html.webp`, `blog-js.webp`), et du visuel étudiant SVG Hero (`images/hero/student-female-smiling.webp`, 26 Ko au lieu de 73 Ko).

5. **Résolution des Insights PageSpeed & Conformité Accessibilité WCAG AA (Task 10.5)** :
   - **Élimination du délai LCP (1 100 ms)** : Ajout de `<link rel="preload" as="image" href="images/hero/student-female-smiling.webp" type="image/webp" fetchpriority="high">` dans le `<head>` et ajout des attributs `fetchpriority="high" loading="eager" decoding="async"` sur la balise `<image>` SVG.
   - **Élimination du CLS Hero (0.081)** :
     * Remplacement de l'animation SMIL SVG (`<animate attributeName="startOffset">`), qui forçait la recalculation continue de mise en page des glyphes, par une rotation de groupe `<g class="hero__blob-text-rotate">` accélérée par GPU (`animation: heroBlobRotate 25s linear infinite` avec `transform-origin: 100px 100px`).
     * Exclusion de `.hero` de l'IntersectionObserver dans `script.js` (`section:not(.hero)`), éliminant l'application tardive de `fadeIn` (`translateY(20px)`) sur la zone above-the-fold qui masquait l'élément LCP et décalait le layout.
   - **Suppression des ajustements forcés de mise en page (Forced Reflow - 136 ms)** :
     * Déferrement de l'injection du script Plausible Analytics (`script.tagged-events.outbound-links.js`) sur `window.load` via `requestIdleCallback` (avec stub d'accumulation `window.plausible.q` pour ne perdre aucun événement) sur toutes les pages (`index.html`, `formations/*.html`, `workshops.html`, `parcours.html`).
     * Encadrement de la lecture/écriture géométrique du header (`updateHeaderHeightVar`) dans `window.requestAnimationFrame` dans `header.js`.
   - **Correction Accessibilité & Conformité RGAA / WCAG AA** :
     * Suppression de l'attribut prohibé `aria-label` sur `<label for="burger-toggle">` dans `header.html` et insertion d'un intitulé accessible via la nouvelle classe `.sr-only` (`utilities.css`).
     * Correction des ratios de contraste inférieurs à 4.5:1 : `.section-tag` configuré en `#047857` sur fond clair (>5.1:1) et `#00ff87` sur fond sombre ; badge parents `.rassurance__badge` basculé en `#1d4ed8` (>5.8:1) ; pastille Pack 1 passée en `#1d4ed8` et Pack 3 en `#92400e` (>7.2:1) ; liens de pied de page `.footer__link` configurés en `#cbd5e1` (>11.6:1).
     * Différenciation des liens identiques pointant vers des destinations différentes : attribution d'`aria-label` contextuels uniques pour chaque carte d'article de blog (`index.html`).
   - **Compression d'Assets** :
     * Recompression sans perte de `images/header/logo.webp` (7,5 Ko au lieu de 8,9 Ko).

6. **Validation & Tests** :
   - Compilation et minification réussie de tous les bundles CSS et JS via `node build.js`.
   - Contrôle syntaxique rigoureux de tous les scripts avec Node.js (`node -c`).
   - Exécution complète des 112 tests Spring Boot (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

### 2026-09-28 — Sprint 11 : Intégration Discord & Automatisation Rôles Communauté (ADR-018)
**Conversation**: `090e821d-c81b-4b96-80d1-ddc3085e6fe8`  
**Branche**: `feat/sprint-11-discord-integration`

#### Ce qui a changé :
1. **Scopes OAuth2 & Persistance Base de Données (Task 11.1)** :
   - Ajout des scopes Discord `identify,email,guilds.join` dans `application.properties`.
   - Migration Flyway `V016__add_discord_integration_fields_to_users.sql` : ajout des colonnes `discord_user_id`, `discord_username`, `discord_avatar`, `discord_linked_at` avec index de recherche sur `discord_user_id`.
   - Mise à jour de l'entité JPA `User` et de `UserRepository` (`findByDiscordUserId`).

2. **Architecture Hexagonale Ports/Adapters (`DiscordGateway`) (Task 11.2 / ADR-018)** :
   - Définition du port `DiscordGateway` et de l'implémentation adaptateur `DiscordGatewayImpl` (`RestClient` Spring Boot).
   - Intégration de l'API REST Discord v10 :
     * `joinGuildMember(guildId, userId, userAccessToken, roleIds)` via `PUT /guilds/{guildId}/members/{userId}` (gestion de `201 Created` pour nouvelle adhésion et `204 No Content` pour membre déjà présent avec assignation itérative des rôles).
     * `addRoleToMember(guildId, userId, roleId)` via `PUT /guilds/{guildId}/members/{userId}/roles/{roleId}`.
     * `removeRoleFromMember(guildId, userId, roleId)` via `DELETE /guilds/{guildId}/members/{userId}/roles/{roleId}`.
     * `getGuildMember(guildId, userId)` via `GET /guilds/{guildId}/members/{userId}`.
   - Mode simulation gracieuse non-bloquant en dev et test si le bot token ou l'ID de guilde ne sont pas renseignés.

3. **Liaison de Compte, Anti-collision OWASP & Calcul des Rôles (Task 11.3)** :
   - `DiscordService` : calcul hiérarchique cumulatif des rôles selon le palier maximal payé (`VIP` -> VIP + Web + Starter + Membre ; `WEB` -> Web + Starter + Membre ; `STARTER` -> Starter + Membre ; `NONE` -> Membre).
   - Vérification stricte anti-collision : interdiction d'associer un compte Discord déjà lié à un autre compte élève (`DuplicateResourceException` HTTP 409).
   - Flux d'authentification étendu : `OAuth2RedirectUriFilter` capture `link_token` et pose `oauth2_link_email` en cookie HTTP-only/session pour autoriser la liaison à chaud sans perte de session.
   - `CustomOAuth2UserService` et `OAuth2AuthenticationSuccessHandler` traitent le jeton d'accès utilisateur pour adjoindre le membre à la guilde et synchroniser ses rôles avec redirection `#discord_status=linked`.
   - Gestionnaire d'échec `OAuth2AuthenticationFailureHandler` avec retour gracieux `#discord_error=access_denied`.
   - Câblage automatique post-paiement Stripe dans `PaymentService` (`checkout.session.completed` et confirmation directe).

4. **Tableau de Bord Apprenant & Expérience Utilisateur (Task 11.4)** :
   - Bouton d'accès rapide dans l'en-tête du tableau de bord (`#btn-discord-header`) avec indicateur d'état connecté / déconnecté.
   - Section dédiée et carte responsive Cyber Dark dans `dashboard.html` : affichage du tag Discord, avatar utilisateur, badges des rôles actifs, lien direct vers le salon, bouton de synchronisation manuelle et déliaison en 1 clic.
   - Contrôleur REST `DiscordController` (`/api/discord/status`, `/api/discord/link-url`, `/api/discord/sync`, `/api/discord/unlink`).

5. **Validation & Tests** :
   - Ajout des suites de tests unitaires : `DiscordGatewayImplTest` (3 tests), `DiscordServiceTest` (8 tests), `DiscordControllerTest` (6 tests).
   - Exécution de la suite complète de 129 tests Spring Boot (`BUILD SUCCESS`, 0 échec, 0 erreur).

---

### 2026-09-28 — Sprint 11 : Déploiement Serveur Discord & Harmonisation UI Dashboard
**Conversation**: `090e821d-c81b-4b96-80d1-ddc3085e6fe8`  
**Branche**: `feat/sprint-11-discord-integration`

#### Ce qui a changé :
1. **Architecture Serveur Discord Live via MCP (`1554111429106339931`)** :
   - Création de la hiérarchie de rôles avec couleurs et permissions restreintes (évitant l'erreur 50013 d'escalade de privilèges) :
     * `Teacher` (`1554196347773657118`, `#F59E0B`) — Attribué à l'enseignant Cédric (`admin.noseumcode`).
     * `Student` (`1554196414354030812`, `#3B82F6`) — Rôle de base pour tout apprenant vérifié.
     * `Student Starter` (`1554196429143150673`, `#10B981`) — Accès Pack Fondations.
     * `Student Web` (`1554196443906969752`, `#06B6D4`) — Accès Pack Dynamique Web.
     * `Student VIP` (`1554196465533067346`, `#8B5CF6`) — Accès Mentorat VIP.
   - Création des catégories et salons privés verrouillés (`@everyone` denied) :
     * `ESPACE ENSEIGNANTS` : `#salle-des-profs`, `#ressources-cours` (Teacher & Bot).
     * `ESPACE ÉTUDIANTS` : `#salon-étudiants`, `#projets-portfolio` (Student, Teacher & Bot).
     * `PACK STARTER` : `#starter-cours-et-projets` (Student Starter/Web/VIP, Teacher & Bot).
     * `PACK WEB` : `#web-cours-et-projets` (Student Web/VIP, Teacher & Bot).
     * `MENTORAT VIP` : `#vip-salon-coaching` (Student VIP, Teacher & Bot).

2. **Résolution de la Redirection OAuth2 Discord (`DiscordController.java`, `application.properties`, `dashboard.js`)** :
   - Problème : Clic sur « Associer mon compte Discord » depuis `develop.noseumcode.fr` redirigeait vers `http://localhost:8080`.
   - Cause : Fallback `@Value("${app.backend.url:${SERVER_URL:http://localhost:8080}}")` sur les environnements sans variable `SERVER_URL`.
   - Correction backend : Valeur par défaut basculée sur `https://api.noseumcode.fr` avec résolution dynamique du proxy reverse via en-têtes `X-Forwarded-Host` et `X-Forwarded-Proto`.
   - Correction frontend : Construction directe de l'URL OAuth2 dans `connectDiscordAccount()` avec `window.API_BASE_URL` ou fallback `https://api.noseumcode.fr`, évitant tout appel préliminaire renvoyant un host erroné.

3. **Harmonisation Graphique de la Carte Discord (`dashboard.html`, `dashboard.js`)** :
   - Refonte visuelle de la carte Discord pour l'aligner sur la charte NoSeumCode : fond blanc épuré (`--dash-card-bg: #ffffff`), suppression des gradients sombres Cyber Dark inadaptés au reste du dashboard.
   - Typographie et contrastes conformes : titres en `--dash-dark-navy` (`#0a1628`), descriptions en `--dash-text-muted` (`#718096`), pastilles de statuts et rôles claires (`rgba(88, 101, 242, 0.08)`, texte `#4752c4`).
   - Boutons d'action harmonisés (primaire Discord, secondaire synchronisation, destructif dissociation avec styles d'alerte discrets).

4. **Validation & Tests** :
   - 129 tests unitaires Maven validés avec succès (`BUILD SUCCESS`, 0 erreur, 0 échec).
   - Build frontend minifié validé (`npm run build`).

---

### 2026-09-28 — Correctif CI/CD : Propagation des Secrets Discord OAuth2 & Rôles sur la VM Oracle Cloud
**Conversation**: `090e821d-c81b-4b96-80d1-ddc3085e6fe8`  
**Branche**: `fix/ci-discord-env-secrets`

#### Ce qui a changé :
1. **Résolution de l'Erreur Snowflake Client ID Discord** :
   - Problème : Discord rejetait la redirection OAuth2 avec l'erreur `{"client_id": ["La valeur « mock-discord-client-id » n’est pas snowflake."]}`.
   - Cause : Le workflow CI/CD `.github/workflows/deploy.yml` écrivait en dur `DISCORD_CLIENT_ID=mock-discord-client-id` et `DISCORD_CLIENT_SECRET=mock-discord-client-secret` dans le `.env` de production de la VM Oracle Cloud, et n'injectait pas les variables du bot et des rôles.
   - Solution :
     * Configuration des secrets GitHub Actions manquants via GitHub CLI : `DISCORD_BOT_TOKEN`, `DISCORD_INVITE_URL`, `DISCORD_ROLE_DEFAULT_ID`, `DISCORD_ROLE_STARTER_ID`, `DISCORD_ROLE_WEB_ID`, `DISCORD_ROLE_VIP_ID`, et validation de `DISCORD_CLIENT_ID` (`1554118371501412422`), `DISCORD_CLIENT_SECRET`, `DISCORD_GUILD_ID` (`1554111429106339931`).
     * Mise à jour de `.github/workflows/deploy.yml` pour transmettre ces secrets à l'étape SSH, les déclarer dans `envs:`, les injecter dans le template `backend/.env.tpl` et les substituer via `envsubst`.
2. **Documentation & Prévention** :
   - Ajout d'une règle dans la section « Fausses Hypothèses à Éviter » de `docs/ai/KNOWN_ISSUES.md`.

---

### 2026-09-28 — Correctif : Pack VIP, Révocation Rôles Discord & Gestion des Statuts de Paiement Admin
**Conversation**: `090e821d-c81b-4b96-80d1-ddc3085e6fe8`  
**Branche**: `fix/vip-enrollment-admin-status-and-icons`

#### Ce qui a changé :
1. **Synchronisation Inscription & Pack Mentorat VIP** :
   - Correction sur `frontend/index.html` : le bouton d'inscription VIP pointe désormais vers le cours Pack VIP (`c3000000-0000-0000-0000-000000000003`) au lieu du Pack Web (`c2`).
   - Correction dans `frontend/js/header.js` : le slug `"vip"` et ses alias (`pack-vip`, `mentorat-vip`, `goat`) pointent vers `c3000000-0000-0000-0000-000000000003`.
   - Ajout de la méthode `enrollInBundleCourses` dans `PaymentService.java` et `EnrollmentService.java` : l'achat ou l'octroi d'un pack VIP inscrit immédiatement l'étudiant aux 3 cours (`c3`, `c2`, `c1`) avec le tier `VIP`.
   - Ajout de la synchronisation proactive synchrone dans `frontend/js/dashboard.js` : inspection de `session_id` Stripe Checkout à l'arrivée sur le dashboard et déblocage immédiat via `/api/payments/confirm-session`.

2. **Révocation du Statut de Paiement & Rôles Discord** :
   - `DiscordService.java` : implémentation de la suppression effective des rôles (`discordGateway.removeRoleFromMember`) pour tout rôle tier (`vipRoleId`, `webRoleId`, `starterRoleId`) non détenu lors de la synchronisation.
   - `EnrollmentService.java` : injection de `DiscordService` et appel systématique de `syncUserRoles(user)` lors des mises à jour (`updatePaymentStatus`, `setCoursePaymentStatusForUser`, `deleteEnrollment`).
   - `EnrollmentService.java` : renforcement de `hasPaidAccess` avec verrouillage prioritaire `explicitDenied` (si une inscription est `FAILED` ou `REFUNDED`, l'accès au cours est immédiatement rejeté même si un bundle partagé était actif).
   - `EnrollmentService.java` : propagation en cascade des statuts `FAILED` et `REFUNDED` sur les inscriptions sœurs partageant le même tier bundle.
   - `PaymentService.java` : levée de la restriction `status == PAID` sur `syncDiscordRolesIfLinked` et déclenchement de la synchronisation Discord lors des mises à jour manuelles de statut de paiement (`processPaymentStatusUpdate`).
   - `UserController.java` : cartographie fidèle des statuts de paiement (`ÉCHOUÉ`, `REMBOURSÉ`, `PAYÉ`, `EN ATTENTE`, `GRATUIT`).

3. **Gestion Interactive du Statut de Paiement Admin** :
   - `frontend/js/dashboard.js` : ajout du sélecteur interactif de statut de paiement global dans le tableau des utilisateurs de l'administration et dans la vue détaillée déroulante.
   - Implémentation de `handleUpdateUserGlobalPaymentStatus` appelant `PATCH /api/payments/user/{userId}/status` avec rafraîchissement réactif de la liste et toasts de notification.
   - Amélioration de `handleUpdateCoursePaymentStatus` pour notifier immédiatement l'administrateur et synchroniser l'affichage.

4. **Élimination des Emojis IA & Intégration d'Icônes Vectorielles NoSeumCode** :
   - Purge intégrale de tous les emojis Unicode génériques sur `frontend/dashboard.html` et `frontend/js/dashboard.js`.
   - Création d'une bibliothèque de composants vectoriels SVG personnalisés (`ICONS`) respectant l'identité visuelle comic/cyberpunk NoSeumCode (`#00ff87`, `#0a1628`, `#5865F2`) pour tous les badges de rôles, statuts de paiement, indicateurs de cohorte, cartes d'ateliers, boutons et états vides.

5. **Validation & Tests** :
   - Suite complète de 130 tests unitaires et d'intégration validée avec 100% de succès (`BUILD SUCCESS`).
   - Build des bundles CSS et JS frontend exécuté avec succès (`npm run build`).

---

### 2026-09-29 — Correctif : Résolution de l'Erreur 404 sur l'Endpoint Webhook Stripe
**Conversation**: `e1260507-cd0d-4086-9f94-d405535e6d71`  
**Branche**: `fix/stripe-webhook-endpoint-routing`

#### Ce qui a changé :
1. **Mise à Jour de l'Endpoint Webhook dans Stripe (Dashboard/API)** :
   - Problème : Stripe a notifié 36 échecs de livraison HTTP 404 sur `https://noseumcode.fr/api/payments/webhook`.
   - Cause : Le webhook Stripe (`we_1UJIZZAmRX1Xf5vuArlYEPHR`) ciblait le domaine racine de production (`noseumcode.fr`), qui héberge exclusivement les fichiers statiques du frontend sur Apache o2switch, au lieu du sous-domaine de l'API Spring Boot (`https://api.noseumcode.fr/api/payments/webhook`).
   - Solution : Mise à jour immédiate de l'endpoint webhook Stripe via l'API Stripe pour pointer vers `https://api.noseumcode.fr/api/payments/webhook`.
2. **Redirection de Secours HTTP 307 sur Apache (`frontend/.htaccess`)** :
   - Ajout d'une règle Apache `RewriteRule ^api/(.*)$ https://api.noseumcode.fr/api/$1 [R=307,L,QSA]` pour intercepter toute requête accidentelle vers `noseumcode.fr/api/*` et la rediriger de manière transparente vers l'API backend sur Oracle Cloud tout en préservant la méthode HTTP (POST, GET, etc.) et le corps de la requête.
3. **Endpoint GET de Diagnostic / Health Check Webhook (`PaymentController.java`)** :
   - Ajout d'un point de terminaison `@GetMapping(value = {"/webhook", "/webhook/stripe"})` renvoyant un statut `200 OK` avec `{"status":"UP", "service":"stripe-webhook"}`.
   - Permet de diagnostiquer et vérifier immédiatement la joignabilité publique de l'endpoint dans un navigateur ou via un outil de monitoring sans générer d'erreur HTTP 405 Method Not Allowed.
4. **Validation & Tests** :
   - Test unitaire dédié ajouté dans `PaymentWebhookSecurityTest.java` (`getWebhookHealthShouldReturnStatusUp`).
   - Exécution complète des 131 tests unitaires et d'intégration Spring Boot (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

### 2026-09-29 — Correctif : Intégration de la Communauté Discord sur le Dashboard Formateur et Administrateur
**Conversation**: `e1260507-cd0d-4086-9f94-d405535e6d71`  
**Branche**: `fix/teacher-dashboard-discord-integration`

#### Ce qui a changé :
1. **Ajout des Sections Discord dans les Vues Formateur et Administrateur (`frontend/dashboard.html`)** :
   - Insertion de `#discord-section-teacher` et `#discord-card-container-teacher` dans le panneau `#view-teacher`.
   - Insertion de `#discord-section-admin` et `#discord-card-container-admin` dans le panneau `#view-admin`.
   - Utilisation de la classe partagée `.discord-card-container` pour l'injection dynamique multi-vues.

2. **Rendu Dynamique Multi-Vues & Copywriting Adapté (`frontend/js/dashboard.js`)** :
   - Refactorisation de `loadDiscordStatus()` et `renderDiscordCard(data, targetContainer)` pour interroger et mettre à jour tous les conteneurs `.discord-card-container`.
   - En état non associé, génération d'un contenu adapté au rôle du panneau actif :
     * **Formateur** : Titre « Espace Discord Formateur NoSeumCode », présentation de l'accompagnement pédagogique et des salons formateurs privés (`#salle-des-profs`, `#ressources-cours`), badges dédiés et bouton « Associer mon compte Formateur ➔ ».
     * **Administrateur** : Titre « Administration Serveur Discord NoSeumCode », description de la modération globale et de la gestion communautaire, bouton « Associer mon compte Administrateur ➔ ».
     * **Apprenant** : Contenu apprenant existant.
   - En état associé, affichage des informations du profil Discord, des badges de rôles actifs (incluant `@Formateur` et `@Administrateur`), et des actions (Ouvrir Discord, Synchroniser, Dissocier).
   - Prise en charge des boutons multiples dans `connectDiscordAccount()` et `syncDiscordRoles()`.
   - Amélioration de `scrollToDiscordSection()` pour cibler dynamiquement l'ancre de la vue affichée (`#discord-section-teacher`, `#discord-section-admin`, ou `#discord-section`).
   - Appel inconditionnel de `loadDiscordStatus()` dans `refreshDashboardData()` et dans `manuallySwitchDashboardView()` pour maintenir à jour les cartes et le bouton d'en-tête `#btn-discord-header`.

3. **Résolution Backend des Rôles Formateur et Administrateur (`DiscordService.java`)** :
   - Mise à jour de `resolveRoleNamesForUser(User user)` pour attribuer le libellé `"Formateur"` pour `Role.TEACHER` et `"Administrateur"` pour `Role.ADMIN`.
   - Ajout d'un test unitaire dans `DiscordServiceTest.java` (`shouldResolveTeacherRoleNameForTeacherUser`).

4. **Validation & Tests** :
   - Validation syntaxique JavaScript réussie (`node -c frontend/js/dashboard.js`).
   - Exécution complète de la suite de tests Spring Boot : 132 tests réussis (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

### 2026-09-29 — Correctif : Résolution du Blocage Infini du Statut Discord et Sécurisation de scrollToDiscordSection
**Conversation**: `090e821d-c81b-4b96-80d1-ddc3085e6fe8`  
**Branche**: `fix/dashboard-discord-status-and-scroll`

#### Ce qui a changé :
1. **Éradication de l'erreur `ReferenceError: email is not defined` (`frontend/js/dashboard.js`)** :
   - Ajout de l'extraction de `email` dans `parseAuthFromUrl()` et dans le gestionnaire OAuth2 de `frontend/dashboard.html`.
   - Simplification de tous les appels `normalizeRole(role)` (passage d'un argument unique).
2. **Élimination du blocage infini du loader Discord (`frontend/js/dashboard.js`)** :
   - Suppression du `return;` silencieux en cas de réponse HTTP 401 ou d'absence de jeton dans `loadDiscordStatus()`.
   - Rendu automatique de l'état d'invitation propre (`renderDiscordCard({ linked: false })`) pour inviter l'utilisateur à associer son compte sans bloquer sur le spinner.
3. **Sécurisation de la navigation `#btn-discord-header` (`frontend/dashboard.html`, `frontend/js/dashboard.js`)** :
   - Déclaration précoce de `scrollToDiscordSection()` dans le `<head>` de `dashboard.html` et au sommet de `dashboard.js`.
   - Enregistrement immédiat sur `window.scrollToDiscordSection` et ajout d'un écouteur `click` direct dans `setupEventListeners()`.
4. **Prévention de la Temporal Dead Zone (TDZ) et initialisation robuste (`frontend/js/dashboard.js`)** :
   - Déplacement des variables d'état `activeDashboardView` et `cachedDiscordData` au sommet du fichier.
   - Adaptation de `initDashboard()` pour s'exécuter que `document.readyState` soit `loading`, `interactive` ou `complete`.
   - Définition dynamique et robuste de `getApiBaseUrl()` garantissant la validité des requêtes API même si `window.API_BASE_URL` n'est pas encore instancié.
   - Sécurisation de `fetchNotifications()` avec garde-fou contre les réponses non tabulaires.
5. **Invalidation du cache HTTP navigateur (`frontend/dashboard.html`)** :
   - Ajout du tag de versioning `js/dashboard.js?v=sprint11.2` pour forcer le rafraîchissement immédiat par les navigateurs clients.
6. **Validation & Tests** :
   - Tests de simulation du cycle de vie du navigateur en environnement Node (`node -e`).
   - Suite complète Maven Spring Boot au vert : 132 tests exécutés, 0 échec, 0 erreur.

---

### 2026-09-29 — Sprint 12 : Optimisations Web Performance, BFCache & Politique de Cache Apache
**Conversation**: `6cc4f067-52cf-47fa-8a14-4b60fd93f304`  
**Branche**: `feat/web-performance-caching-bfcache`

#### Ce qui a changé :
1. **Déblocage du Back/Forward Cache (BFCache) sur Apache (`frontend/.htaccess`)** :
   - Remplacement de la directive `Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"` par `Header set Cache-Control "no-cache, must-revalidate"` sur tous les fichiers `.html`.
   - Élimination des deux causes de disqualification BFCache signalées par Lighthouse/GTmetrix : navigation principale désormais stockable en mémoire vive par Chromium et disparition de l'en-tête `no-store` sur les requêtes fetch internes des partials (`header.html`, `popovers-shared.html`, `footer.html`).
2. **Extension de la politique de cache des assets statiques CSS & JS à 1 an (`frontend/.htaccess`)** :
   - Passage de `max-age=2592000` (30 jours) à `max-age=31536000, public` (1 an) pour tous les fichiers `.css` et `.js` dans `mod_headers` et `mod_expires`.
   - Résolution de l'audit Lighthouse « Serve static assets with an efficient cache policy ».
3. **Mise en place du versioning d'assets (Cache Busting) (`frontend/index.html`, `parcours.html`, `workshops.html`, etc.)** :
   - Ajout du paramètre de versioning `?v=sprint12` sur l'ensemble des stylesheets et scripts clients (`homepage.min.css?v=sprint12`, `header.min.js?v=sprint12`, `script.min.js?v=sprint12`, `popover-hubspot.min.js?v=sprint12`, `analytics.js?v=sprint12`).
   - Priorisation du CSS critique `homepage.min.css` en tête de `<head>` pour accélérer le déclenchement de son téléchargement.
4. **Allègement des polices Google Fonts & Nettoyage des 404 (`frontend/*.html`, `frontend/formations/*.html`)** :
   - Élagage des graisses non utilisées de la police Poppins (`300` et `500`), ne conservant que `wght@400;600;700` et `Bangers` : économie estimée de ~35-40 Ko sur le payload global des polices (~92.6 Ko initial).
   - Suppression de l'appel vers `js/footer.js` (fichier inexistant) dans `workshops.html` et remplacement de `js/popovers.js` (inexistant) par `js/popover-hubspot.min.js` dans les pages de formations.
5. **Validation & Tests** :
   - Exécution du script de build `npm run build` dans `frontend/` (recompilation et minification sans erreur).
   - Suite complète Spring Boot validée via `mvnw.cmd test` : 132 tests réussis (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

### 2026-09-30 — Planification des Sprints 13 à 16 : Refonte SEO, Copywriting & Offres NoSeumCode
**Conversation**: `d2701bcf-ed1f-4e38-bb5e-52a921b4ec35`  
**Branche**: `docs/roadmap-sprints-seo-copywriting-offers`

#### Ce qui a changé :
1. **Découpage en 4 Sprints autonomes et séquentiels** :
   - **Sprint 13** : Socle Technique, Sécurité Serveur & Assainissement des Assets (CSP HubSpot `.htaccess`, cache `mod_expires` 1 an, `robots.txt` & `sitemap.xml`, compression WebP de `git.webp` et `javascript.webp` >5 Mo gagnés, création de `mentions-legales.html`, `cgv.html`, `confidentialite.html`).
   - **Sprint 14** : Nouvelle Architecture des Offres (Les 3 Packages) & Refonte Navigation (catalogue `cours.js` avec Starter 89 €, Web Pro 179 €, Mentorat VIP 389 €, alignement Stripe backend, page `parcours.html`, navigation `header.html`).
   - **Sprint 15** : Refonte Copywriting Homepage & Optimisation Sémantique SEO (métadonnées `<head>`, H1 percutant sans le seum, Trustbar outils pros, suppression du double regard Parents/Jeunes au profit des 3 piliers, intégration de la grille des 3 offres `#parcours`, FAQ 6 questions cibles).
   - **Sprint 16** : Tunnel Lead Magnet, Onboarding Apprenant & Cocon Blog (sécurisation `thanks.html` avec liens PDF réparés et upsell doux, onboarding `success.html` en 3 étapes, structure sémantique blog `article.html`, plan de test global et audit PageSpeed LCP < 2,5s).
2. **Mise à jour de la mémoire projet (`docs/ai/ROADMAP.md` & `PROJECT_CONTEXT.md`)** :
   - Sprint 12 clôturé et marqué `Terminé`.
   - Tableau récapitulatif, diagramme de Gantt Mermaid et spécifications détaillées page par page enrichis pour les Sprints 13 à 16.
3. **Synchronisation du Kanban GitHub Projects (Projet 1)** :
   - Sprint 12 passé à `Done`.
   - Création des Draft Issues pour les Sprints 13, 14, 15 et 16 avec statut `Todo`.

---

### 2026-09-30 — Sprint 13 : Socle Technique, Sécurité Serveur & Assainissement des Assets
**Conversation**: `e8ec6f84-8fe9-4797-b252-c7c4ae21f579`  
**Branche**: `feat/sprint-13-technical-foundation-seo-assets`

#### Ce qui a changé :
1. **Déblocage CSP HubSpot & Directives Apache (`frontend/.htaccess`)** :
   - Mise à jour de la directive Content-Security-Policy autorisant l'affichage et la soumission des popovers HubSpot sans violation : intégration de `https://forms.eu1.hsforms.com`, `https://forms.hubspot.com`, `https://api.hsforms.com` et domaines associés dans `script-src`, `frame-src`, `connect-src`, `img-src` et `form-action`.
   - Conservation des directives `mod_expires` 1 an pour les assets statiques et médias modernes (`image/webp`, `image/avif`, `image/svg+xml`, `font/woff2`).
   - Ajout des règles de réécriture d'URL propres pour les pages légales (`/mentions-legales`, `/cgv`, `/confidentialite`) et redirection 301 automatique de `/politique-confidentialite` vers `/confidentialite.html`.
2. **Hygiène SEO Technique (`frontend/robots.txt` & `frontend/sitemap.xml`)** :
   - `robots.txt` : interdiction formelle d'exploration des dossiers privés (`Disallow: /documents/`, `Disallow: /data/`) et des pages transactionnelles (`/dashboard.html`, `/thanks.html`, `/success.html`, `/reset-password.html`), maintien de `Allow: /` et déclaration du sitemap canonique.
   - `sitemap.xml` : suppression de `/dashboard.html`, maintien de la racine canonique `https://noseumcode.fr/`, et remplacement de l'URL de confidentialité par `https://noseumcode.fr/confidentialite.html` (avec `lastmod: 2026-09-30`).
3. **Assainissement des Assets Graphiques (`frontend/images/courses/git.webp`)** :
   - Compression WebP Sharp de `git.webp` à 47,9 Ko (qualité 75%, effort 6), conforme à la fourchette cible de 45 à 65 Ko (gain direct de 2,68 Mo par rapport au fichier original non optimisé).
   - Validation de conformité pour `javascript.webp` (42,7 Ko) et `favicon.png` (7,4 Ko, <15 Ko).
4. **Pages Légales & Conformité RGPD (`frontend/mentions-legales.html`, `cgv.html`, `confidentialite.html`)** :
   - `mentions-legales.html` : ajout du numéro SIRET (921 584 712 00014) sous le responsable de publication et mentions des hébergeurs o2switch (Frontend) et Oracle Cloud Infrastructure (Backend API).
   - `cgv.html` : formalisation des 3 Packages (Starter 89 €, Web Pro 179 € ou 2x 95 €, Mentorat VIP 389 € ou 3x 135 €), paiements échelonnés Stripe / Klarna BNPL, droit de rétractation légal et garantie commerciale satisfait ou remboursé 14 jours, et médiation de la consommation (L. 612-1).
   - `confidentialite.html` : création de la page complète de politique de confidentialité conforme RGPD (mention des sous-traitants Stripe PCI-DSS, Brevo pour les e-mails transactionnels, HubSpot, hébergement ISO 27001 en UE, analytics Plausible cookieless, droits CNIL).
   - `politique-confidentialite.html` : synchronisation et ajout de l'URL canonique vers `confidentialite.html`.
   - `footer.html` : mise à jour du lien de confidentialité vers `confidentialite.html`.
5. **Validation Locale & Tests** :
   - Recompilation et minification des bundles CSS et JS sans erreur (`node build.js`).
   - Suite complète Spring Boot validée via `.\mvnw.cmd test` : 132 tests réussis (`BUILD SUCCESS`, 0 erreur, 0 échec).

---

### 2026-09-30 — Sprint 14 : Nouvelle Architecture des Offres (Les 3 Packages) & Refonte Navigation
**Conversation**: `e8ec6f84-8fe9-4797-b252-c7c4ae21f579`  
**Branche**: `feat/sprint-14-offers-architecture-navigation`

#### Ce qui a changé :
1. **Modélisation Catalogue & Base de Données des 3 Packages (`V017__align_three_packages_catalog_pricing.sql`)** :
   - Migration Flyway V017 alignant les 3 offres officielles progressives :
     * **Pack Starter** (`pack-starter`, 89 € / `price_in_cents = 8900`, niveau `DEBUTANT`, tier `STARTER`) : structure HTML5, design CSS3, Flexbox & Grid, responsive mobile et 2 projets portfolio complets.
     * **Pack Web Pro** (`pack-web-pro`, 179 € / `price_in_cents = 17900`, niveau `INTERMEDIAIRE`, tier `WEB`) : tout le Pack Starter + JavaScript ES6+, manipulation du DOM, requêtes API et bonus Git & GitHub offert (6 projets portfolio).
     * **Pack Mentorat VIP** (`pack-mentorat-vip`, 389 € / `price_in_cents = 38900`, niveau `ACCOMPAGNE`, tier `VIP`) : tout le Pack Web Pro + 4h de mentorat individuel en visio, revues de code ligne par ligne et coaching carrière (10 places max/mois).
2. **Backend Stripe & Passerelle de Paiement (`StripeGatewayImpl.java` & `PaymentCheckoutServiceTest.java`)** :
   - Synchronisation des montants de repli dans `StripeGatewayImpl.java` (VIP: 38900L, STARTER: 8900L, WEB: 17900L).
   - Prise en charge native de Klarna pour les paiements fractionnés (2x 95 € sans frais et 3x 135 € sans frais).
   - Mise à jour et validation des tests unitaires `PaymentCheckoutServiceTest` (Starter 89 €, Web Pro 179 €, 16 tests passants).
3. **Composant Catalogue Frontend & Salle de Cours (`frontend/js/cours.js`)** :
   - Mise à jour de `formatCoursePrice` (Starter 89 €, Web Pro 179 €, Mentorat VIP 389 €).
   - Alignement du mapping API et du seed de repli `allCourses` sur les 3 nouveaux packages.
   - Refonte de `renderCourseCatalog()` : mise en valeur du Pack Web Pro (Recommandé / Le Plus Populaire avec bordure verte et shadow dédiée), affichage des options de paiement en plusieurs fois Klarna, badges de niveau clairs et listes de bénéfices concrets.
   - Support des nouveaux slugs dans le sélecteur de chapitres de `loadSingleCourse`.
4. **Tunnel de Vente & Paywall In-App (`frontend/js/header.js`)** :
   - Ajout des slugs `pack-starter`, `pack-web-pro`, `pack-mentorat-vip` dans `COURSE_SLUG_MAP`.
   - Heuristiques de détection de niveau et prix dans `openStripePaywall` (89 €, 179 €, 389 €).
   - Réécriture complète de `getPaywallSyllabusHtml(tier)` pour refléter fidèlement le contenu modulaire des 3 nouveaux packages.
   - Prise en charge de la route `parcours.html` dans `setActiveNavLink()`.
5. **Navigation Principale & En-tête (`frontend/partials/header.html`)** :
   - Alignement des liens du menu de navigation : Accueil (`index.html`), Nos Parcours (`index.html#parcours`), La Méthode (`index.html#services`), FAQ (`index.html#faq`).
   - Boutons d'action unifiés : « Se connecter » (secondaire) et « Télécharger le programme » (primaire popover).
6. **Harmonisation Sémantique de la Page Parcours (`frontend/parcours.html`)** :
   - Remplacement des termes académiques (« cursus », « formations ») par « Nos Parcours ».
   - Métadonnées SEO `<head>` et Open Graph alignées sur les 3 packages d'apprentissage.
   - Versioning des assets mis à jour à `?v=sprint14`.
7. **Validation Locale & Tests** :
   - Compilation et minification des assets clients (`node build.js`).
   - Suite complète des 132 tests Spring Boot exécutée et validée avec succès (`mvnw.cmd test` : 0 échec, 0 erreur).

---

### 2026-09-30 — Sprint 15 : Refonte Copywriting Homepage & Optimisation Sémantique SEO
**Conversation**: `e8ec6f84-8fe9-4797-b252-c7c4ae21f579`  
**Branche**: `feat/sprint-15-homepage-copywriting-seo`

#### Ce qui a changé :
1. **Métadonnées SEO `<head>` & Cocon Sémantique (`frontend/index.html`)** :
   - Titre optimisé : `NoSeumCode | Apprends le Développement Web Sans le Seum (HTML, CSS, JS)`.
   - Meta description ciblée bénéfices apprenants : `Passe de zéro à tes premiers sites web en ligne. Des formations pratiques HTML, CSS et JavaScript avec projets réels, entraide active et mentorat individuel.`.
   - Balise canonique stricte `https://noseumcode.fr/`.
   - Balises OpenGraph & Twitter Cards complètes avec image dédiée `https://noseumcode.fr/images/og/partage-noseumcode.png`.
   - Enrichissement du schéma JSON-LD Schema.org `EducationalOrganization`.
2. **Refonte Section Hero & Trustbar Preuve Sociale (`frontend/index.html`)** :
   - Tag supérieur : `<span class="section-tag">Formations Web Débutant & Intermédiaire</span>`.
   - H1 percutant : `Apprends à coder pour de vrai. <span class="gradient-text">Sans le seum.</span>`.
   - Paragraphe sous-titre anti-théorie et boutons CTA directs (*Voir les 3 Packs d'Apprentissage ↓* vers `#parcours`, *Télécharger le Programme (PDF)* via popover HubSpot).
   - Puces de rassurance immédiates : *✓ Projets 100% pratiques • ✓ Accès à vie aux mises à jour • ✓ Garantie 14 jours satisfait ou remboursé*.
   - Intégration de la Trustbar des technologies maîtrisées : HTML5 Sémantique, CSS3 & Flexbox, JavaScript ES6+, Git & GitHub, VS Code, Responsive Design.
3. **Section « La Méthode NoSeumCode » & Abandon du Double Regard** :
   - Remplacement de l'en-tête de section `#services` : Tag `La Méthode NoSeumCode`, Titre `Trois piliers pour apprendre vite, sans décrocher`.
   - Déploiement des 3 piliers :
     1. *Zéro théorie inutile, 100% de création* (outils pro dès la première heure, interfaces réelles).
     2. *Des projets que tu seras fier de montrer* (code en ligne, Git/GitHub, portfolio recruteurs/clients).
     3. *Un mentor et une communauté à tes côtés* (Discord privé, support réactif, zéro blocage).
   - Suppression complète de la section scindée `#rassurance` (« Double Regard Parents & Jeunes ») pour garantir une voix éditoriale unique, jeune, dynamique et orientée projet.
4. **Section Offres : Grille des 3 Packages (`#parcours`)** :
   - Remplacement de l'ancienne section `#courses` par l'ancre officielle `#parcours`.
   - 3 fiches tarifaires avec intégration directe de `initiateCourseEnrollment(...)` vers le paywall Stripe :
     * **Pack Starter (89 €)** : Tag « Idéal Débutant », 4 modules (HTML5, CSS3, Flexbox/Grid, Responsive), 2 projets portfolio, accès Discord et mises à jour à vie.
     * **Pack Web Pro (179 € ou 2x 95 €)** : Tag « Le Plus Populaire » (card featured bordure verte & glow), Starter + JS ES6+, manipulation DOM, requêtes API + Bonus Git & GitHub offert (6 projets portfolio).
     * **Pack Mentorat VIP (389 € ou 3x 135 €)** : Tag « 10 Places / Mois », Web Pro + 4h de visio 1-to-1 avec Cédric, revue de code ligne par ligne et audit portfolio/CV.
   - Nettoyage des anciennes fenêtres modales popover devenues obsolètes (`#course-html-css`, `#course-js`, `#course-git`).
5. **Section FAQ Anti-Objections (6 Questions Cibles)** :
   - Remplacement des questions précédentes par les 6 réponses ciblées levant les objections réelles (débutant complet, maths démythifiées, accès à vie, financement et rassurance parents, garantie 14 jours, paiement en plusieurs fois).
6. **Styles & Performance Client** :
   - Ajout des règles CSS pour `.card-package`, `.card-featured` et `.tool-badge` dans `frontend/styles/pages/homepage/courses.css`.
   - Recompilation et minification de `homepage.min.css` via `node build.js`.
   - Versioning des assets mis à jour à `?v=sprint15` sur `index.html`.
7. **Validation Locale & Tests** :
   - Exécution complète des 132 tests Spring Boot réussie (`mvnw.cmd test` : 0 échec, 0 erreur).

---

### 2026-09-30 — Fix Typographique & Ergonomie de Lecture (Alignement Strict & Règle 20)
**Conversation**: `e8ec6f84-8fe9-4797-b252-c7c4ae21f579`  
**Branche**: `fix/typography-text-alignment-rules`

#### Ce qui a changé :
1. **Création de la règle projet d'alignement (`.agents/rules/rule-20-typography-readability.md`)** :
   - Formalisation de l'ergonomie de lecture occidentale (LTR) : mur d'ancrage visuel gauche vertical constant sur l'axe X.
   - Définition stricte des seules exceptions autorisées au centrage (<= 3 lignes : sous-titres Hero sous H1, micro-réassurance sous CTA, bannières d'action / empty states, citations isolées, titres H1/H2, badges et boutons).
   - Définition des éléments formellement interdits de centrer : corps d'articles et de cours (60 à 75 caractères max par ligne), réponses de FAQ, checklists à puces verticalement alignées, paragraphes descriptifs de cartes et packages d'offres.
2. **Harmonisation CSS & Élimination des Centrages Abusifs** :
   - `frontend/styles/components/utilities.css` : Ajout de `text-align: left;` sur `.card-grid` pour isoler les cartes enfants du `text-align: center;` hérité des conteneurs `.section`.
   - `frontend/styles/components/cards.css` : Ajout explicite de `text-align: left;` sur `.card`, `.card__title` et `.card__paragraphe`.
   - `frontend/styles/pages/homepage/courses.css` : Remplacement du `text-align: center;` général de `.card-package` par `text-align: left;`. Déclaration de règles ciblées : `.package-tagline` (`text-align: left`), `.package-features` (`text-align: left`), `.package-title` et `.package-price` (`text-align: center`), et `.package-reassurance` (`text-align: center`).
   - `frontend/styles/pages/homepage/mentor.css` : Ajout explicite de `text-align: left;` sur `.mentor__text`, `.mentor__pillar-desc` et `.mentor__vip-desc`. Dans la media query mobile (`@media (max-width: 900px)`), maintien de l'alignement à gauche pour tous les paragraphes descriptifs afin d'éviter les retours de ligne en dents de scie.
   - `frontend/styles/pages/formations.css` : Maintien de l'alignement gauche sur `.mentor-card` et `.mentor-info p` sur mobile.
   - `frontend/styles/pages/article.css` : Ajout de `text-align: left;` et `max-width: 75ch;` sur `.article-intro` et `.article-section p`.
   - `frontend/styles/pages/cours.css` : Ajout de `text-align: left;` et `max-width: 75ch;` sur `.rendered-markdown`.
3. **Balise & Classes Sémantiques HTML (`frontend/index.html`)** :
   - Ajout des classes sémantiques `package-title` et `package-reassurance` sur les 3 cartes d'offres de la section `#parcours`.
   - Vérification de l'alignement strict à gauche sur toutes les checklists à puces `✓` et les textes descriptifs.
4. **Décision Architecturale (ADR-020)** :
   - Rédaction et enregistrement d'ADR-020 dans `docs/ai/DECISIONS.md`.
5. **Rebuild & Tests** :
   - Recompilation réussie de tous les bundles CSS/JS minifiés (`node build.js`).
   - Compilation et validation des tests backend Java réussies (`mvnw.cmd test-compile`).

---

### 2026-09-30 — Fix Animation Texte Contours Visuel Hero (Smiling Girl Blob TextPath)
**Conversation**: `e8ec6f84-8fe9-4797-b252-c7c4ae21f579`  
**Branche**: `fix/hero-blob-text-contour`

#### Ce qui a changé :
1. **Rétablissement du Défilement Continu le Long du Contour SVG (`frontend/index.html`)** :
   - Suppression du conteneur en rotation globale `<g class="hero__blob-text-rotate">` qui faisait tourner l'intégralité du tracé vectoriel asymétrique (`#heroBlobPath`), causant une désynchronisation géométrique majeure avec l'image statique rognée par `#heroBlobClip` (le texte traversait le visage ou flottait au loin).
   - Rétablissement du tracé statique `#heroBlobPath` parfaitement calé sur le contour géométrique de l'image étudiante.
   - Restauration des deux balises SVG natives `<textPath>` animées en continu via SMIL `<animate attributeName="startOffset">` (de 100% à 0% et de 0% à -100% sur 20s), recréant le carrousel infini fluide et parfaitement ajusté au périmètre organique du blob.
2. **Rétablissement du Comportement Initial Hover (`main`) & Rehaussement du Contraste (`frontend/styles/pages/homepage/hero.css`)** :
   - Suppression définitive de la rotation globale `.hero__blob-text-rotate`.
   - Restauration du comportement hover initial de `main` : agrandissement dynamique du masque de découpe `#heroBlobClip` (`scale(1.08)` avec `transform-box: view-box; transform-origin: center; transition: transform 0.4s ease-out;`). L'image s'étend ainsi vers l'extérieur de 8% et le texte défile fluidement **à l'intérieur** de l'image.
   - Élimination de `mix-blend-mode: overlay` qui rendait le texte vert clair illisible sur le fond blanc et les teintes claires de la photo.
   - Transition de contraste rehaussée au survol : le texte bascule en bleu nuit foncé (`fill: #070e18`) avec un contour vert néon (`stroke: var(--primary-green); stroke-width: 0.35px; paint-order: stroke fill;`) et une double ombre portée (`filter: drop-shadow(0 0 3px rgba(0, 255, 135, 0.8)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))`), conférant un contraste maximal et une lisibilité irréprochable sur toute la surface de la photo.
3. **Respect de l'Accessibilité & Mouvement Réduit (`frontend/js/script.js`)** :
   - Intégration de la mise en pause conditionnelle automatique des animations SMIL du SVG via `heroBlobSvg.pauseAnimations()` lorsque `prefers-reduced-motion: reduce` est actif.
4. **Validation & Rebuild** :
   - Bundles CSS et JS minifiés régénérés avec succès (`node build.js`).
   - Contrôle syntaxique Node.js validé (`node -c`).
   - Tests backend Java compilés avec succès (`mvnw.cmd test-compile`).
### 2026-09-30 — Fix Accessibilité & Ratios de Contraste Couleurs (WCAG 2.2 AA / AAA & Règle 21)
**Conversation**: `e8ec6f84-8fe9-4797-b252-c7c4ae21f579`  
**Branche**: `fix/wcag-contrast-ratios-compliance`

#### Ce qui a changé :
1. **Création de la règle projet d'accessibilité visuelle (`.agents/rules/rule-21-wcag-color-contrast.md`)** :
   - Formalisation des exigences normatives WCAG 2.2 / RGAA : texte normal $\ge 4.5:1$ (AA) et $\ge 7:1$ (AAA), grand texte $\ge 3:1$ (AA) et $\ge 4.5:1$ (AAA), composants interactifs et graphiques informatifs $\ge 3:1$.
   - Définition exhaustive des palettes validées NoSeumCode sur fonds sombres et fonds clairs, avec liste explicite des anti-patterns interdits.
2. **Audit & Correctifs Couleurs Frontend (`index.html`, CSS)** :
   - `frontend/index.html` :
     * Ajout de `section--dark` sur `.section--trustbar` pour garantir un contraste AAA pour les badges d'outils pros (`#e2e8f0` : 14.71:1) et le sous-titre (`#94a3b8` : 7.07:1).
     * Carte Starter : Badge `Idéal Débutant` réhaussé à `#0369a1` (5.35:1, PASS AA contre 1.53:1 précédemment), tagline et texte réassurance passés à `#475569` (7.58:1, PASS AAA contre 2.56:1 précédemment).
     * Carte Web Pro : Micro-réassurance passée à `#cbd5e1` (12.21:1, PASS AAA).
     * Carte Mentorat VIP : Badge `10 Places / Mois` réhaussé à `#be123c` (5.11:1, PASS AA contre 2.89:1 précédemment), tagline et texte réassurance passés à `#475569` (7.58:1, PASS AAA).
   - `frontend/styles/pages/homepage/courses.css` : Définition des couleurs accessibles pour `.package-tagline` et `.package-reassurance` sur cartes blanches (`#475569`) et cartes sombres (`#cbd5e1`).
   - `frontend/styles/components/cards.css` : `.card__chevron-darken` aligné sur le vert accessible `#047857` (5.48:1, PASS AA).
   - `frontend/styles/components/popover.css` : `.popover__tagline`, `.popover__content h4`, `.popover__syllabus-icon` passés à `#047857` (5.48:1, PASS AA) et `.popover__close` à `#475569` (7.58:1, PASS AAA).
   - `frontend/styles/pages/article.css` : `.back-link:hover` passé à `#047857` (5.48:1, PASS AA).
   - `frontend/styles/pages/cours.css` : Titres de leçons markdown H1 (`#047857`, 5.48:1) et H2 (`#0369a1`, 5.93:1).
   - `frontend/styles/pages/dashboard.css` : Rôles badges et statuts alignés sur les seuils WCAG AA (`#047857`, `#0369a1`, `#b45309`, `#be123c`).
3. **Décision Architecturale (ADR-021)** :
   - Rédaction et enregistrement d'ADR-021 dans `docs/ai/DECISIONS.md`.
4. **Validation Locale & Tests** :
   - Vérification scriptée de 100% des combinaisons de couleurs (toutes $\ge 4.5:1$ pour le texte normal et $\ge 3:1$ pour les composants).
   - Recompilation réussie de tous les bundles CSS/JS minifiés (`node build.js`).
   - Compilation et validation des tests backend Java réussies (`mvnw.cmd test-compile`).

---

### 2026-09-30 — Fix Bouton Découvrir les Ateliers & Interaction Bandeau Défilant Promo
**Conversation**: `e8ec6f84-8fe9-4797-b252-c7c4ae21f579`  
**Branche**: `fix/promo-banner-workshops-cta`

#### Ce qui a changé :
1. **Pause sur Survol & Accessibilité du Marquee (`frontend/styles/components/banner.css`)** :
   - Ajout des règles de gel d'animation `.promo-banner:hover .promo-banner__track`, `.promo-banner:focus-within .promo-banner__track` et `.promo-banner:active .promo-banner__track` avec `animation-play-state: paused;`.
   - Élimination de l'échec de hit-testing du navigateur (`mousedown`/`mouseup` sur coordonnées en déplacement permanent) qui empêchait la génération de l'événement `click`.
   - Ajout de `user-select: none;` et `-webkit-user-select: none;` pour éviter la sélection de texte parasite lors des tentatives de clic.
   - Ajout du support de `prefers-reduced-motion: reduce` (`animation: none; padding-left: 1rem;`) pour l'accessibilité cognitive et vestibulaire.
2. **Gestion Interactive & Écouteurs d'Événements (`frontend/js/header.js`)** :
   - Ajout d'écouteurs tactiles et pointeurs (`pointerenter`, `pointerleave`, `touchstart`, `touchend`) assurant la pause fluide sur desktop et terminaux mobiles.
   - Résolution sécurisée du chemin d'accès avec `resolveAssetPath("workshops.html")` pour éviter les erreurs 404 depuis les sous-dossiers (`/formations/`).
   - Ajout d'un écouteur de navigation robuste sur `click` et `touchend` avec `preventDefault()`, `stopPropagation()` et `window.location.href = targetUrl`. Si l'utilisateur est déjà sur `workshops.html`, défilement fluide vers `#workshops-grid`.
   - Attribution des attributs d'accessibilité `role="button"` et `aria-label`.
3. **Repositionnement Non-Bloquant du Badge de Staging (`frontend/js/header.js`)** :
   - Déplacement de `#dev-env-indicator` (actif uniquement sur `develop.noseumcode.fr`) de `position: relative; document.body.prepend()` vers `position: fixed; bottom: 0; left: 0; width: 100%; pointer-events: none;`.
   - Suppression du chevauchement critique à `scroll: 0` où le badge masquait physiquement l'en-tête fixe et interceptait les clics destinés au bandeau vert.
4. **Fallback HTML Statique (`frontend/partials/header.html`)** :
   - Remplacement du bouton caduc ouvrant `#promo-popup` par les éléments statiques avec le lien sémantique direct `workshops.html` pour garantir la navigabilité immédiate même avant chargement de `schedule.json`.
5. **Rebuild & Tests** :
   - Recompilation réussie de tous les bundles CSS/JS minifiés (`node build.js`).
   - Compilation et validation des tests backend Java réussies (`mvnw.cmd test-compile`).

---

### 2026-09-30 — Sprint 16 : Tunnel Lead Magnet, Onboarding Apprenant & Cocon Blog
**Conversation**: `bee834aa-93e8-46e7-b63c-62b3900ccf51`  
**Branche**: `feat/sprint-16-lead-magnet-onboarding-blog`

#### Ce qui a changé :
1. **Lead Magnet & Upsell Doux (`frontend/thanks.html`, `frontend/styles/pages/thanks.css`)** :
   - Métadonnées `<title>Ton programme est en route ! | NoSeumCode</title>` et `<meta name="robots" content="noindex, nofollow" />`.
   - Vérification et sécurisation des 4 liens de téléchargement de documents PDF (`documents/Cours-HTML-CSS.pdf`, `documents/Premiers-pas-avec-JavaScript.pdf`, `documents/git&github.pdf`, `documents/programme-complet.pdf`).
   - Intégration de la boîte d'upsell doux (`.upsell-box`) vers la grille des 3 offres `#parcours` avec styles dédiés et contrastes WCAG AAA.
2. **Onboarding Post-Achat & Réassurance Immédiate (`frontend/success.html`)** :
   - Titre optimisé `<title>Paiement Confirmé ! Bienvenue sur NoSeumCode</title>`.
   - Séquence d'accueil en 3 étapes d'onboarding (accès espace étudiant, adhésion Discord au salon `#nouveaux-élèves`, configuration de l'éditeur VS Code).
   - Boutons d'action prioritaires vers le tableau de bord et Discord, avec préservation du script asynchrone de confirmation de session Stripe.
3. **Structure & Gabarit du Cocon Sémantique Blog (`frontend/article.html`, `frontend/styles/pages/article.css`, `frontend/js/article.js`)** :
   - Gabarit d'article de blog responsive et sémantique avec fil d'ariane (Breadcrumbs), métadonnées d'article (auteur, date, durée de lecture).
   - Encadré d'appel à l'action contextuel (`.article-cta-box`) vers les packs et le téléchargement du programme PDF.
   - Carte de présentation de l'auteur (`.article-author-card`) mettant en valeur le profil de Cédric Ragot (ingénieur senior et formateur).
   - Injection automatique des données structurées Schema.org JSON-LD (`Article`, `BreadcrumbList`).
4. **Rebuild & Recette** :
   - Recompilation réussie de l'ensemble des bundles CSS et JS (`homepage.min.css`, `thanks.min.css`, `article.min.css`, `workshops.min.css`, `formations.min.css`, scripts JS minifiés).

---

### 2026-09-30 — Article Blog : Faut-il être bon en maths pour apprendre à coder ?
**Conversation**: `bee834aa-93e8-46e7-b63c-62b3900ccf51`  
**Branche**: `feat/sprint-16-lead-magnet-onboarding-blog`

#### Ce qui a changé :
1. **Création de la page statique sémantique (`frontend/blog/faut-il-etre-bon-en-maths-pour-apprendre-a-coder.html`)** :
   - Contenu complet rédigé sous la plume de Cédric Ragot (ingénieur senior & formateur NoSeumCode), démystifiant l'amalgame historique entre mathématiques de pointe et développement web moderne.
   - Balisage Schema.org JSON-LD complet intégrant `Article`, `BreadcrumbList` et `FAQPage` (reprise des 6 sous-titres H2 en questions/réponses indexables).
   - Métadonnées SEO `<title>`, meta description, balises Open Graph, Twitter Cards et balise canonique.
   - Encadré d'appel à l'action contextuel (`.article-cta-box`) vers les 3 packs et le téléchargement du programme PDF.
   - Carte de présentation de l'auteur senior (`.article-author-card`).
2. **Réécriture d'URL Propre Apache (`frontend/.htaccess`)** :
   - Ajout des règles de réécriture transparente pour le cocon blog : `RewriteRule ^blog/([a-zA-Z0-9_-]+)/?$ blog/$1.html [L,QSA]` et fallback `/blog` vers `index.html#blog`.
3. **Maillage Interne & Découvrabilité** :
   - Homepage (`frontend/index.html`) : Ajout du lien vers l'article dans la réponse FAQ n°2 et insertion d'une 4e carte d'article dans la grille `.blogCards__cards`.
   - Catalogue Parcours (`frontend/js/cours.js`) : Insertion d'un encart réassurance « Pour qui sont faits nos parcours ? » avec lien direct vers l'article.
   - Base de données locale (`frontend/data/articles.json`) : Enregistrement de la fiche article complète.
   - Sitemap XML (`frontend/sitemap.xml`) : Déclaration de l'URL canonique avec priorité 0.8.

---

### 2026-09-30 — Articles Blog : Setup VS Code Débutant & Git Expliqué Sans Jargon
**Conversation**: `bee834aa-93e8-46e7-b63c-62b3900ccf51`  
**Branche**: `feat/sprint-16-lead-magnet-onboarding-blog`

#### Ce qui a changé :
1. **Création de la page statique sémantique Setup VS Code (`frontend/blog/setup-vscode-debutant-plugins-utiles.html`)** :
   - Contenu complet rédigé sous la plume de Cédric Ragot détaillant la configuration minimale et les 5 seules extensions indispensables (Prettier, Live Server, Auto Rename Tag, Color Highlight, One Dark Pro) pour débuter sans surcharge ni ralentissement.
   - Balisage Schema.org JSON-LD complet intégrant `Article`, `BreadcrumbList` et `HowTo` pour l'obtention de rich snippets Google.
   - Métadonnées SEO `<title>`, meta description, balises Open Graph, Twitter Cards et balise canonique.
   - Encadré CTA contextuel vers le Pack Starter et le programme PDF, et carte auteur senior.
2. **Création de la page statique sémantique Git pour Débutant (`frontend/blog/git-explique-debutant-versioning.html`)** :
   - Contenu complet sous la plume de Cédric Ragot expliquant le versioning par la métaphore des points de sauvegarde de jeux vidéo, clarifiant la distinction Git vs GitHub, et détaillant les 6 commandes indispensables (`init`, `status`, `add`, `commit`, `push`, `log`).
   - Balisage Schema.org JSON-LD complet (`Article`, `BreadcrumbList`, `HowTo`).
   - Métadonnées SEO, encadré CTA contextuel vers le Pack Starter, et carte auteur senior.
3. **Maillage Interne & Découvrabilité** :
   - Interconnexion bidirectionnelle entre les 3 articles du cocon blog (`faut-il-etre-bon-en-maths-pour-apprendre-a-coder.html`, `setup-vscode-debutant-plugins-utiles.html`, `git-explique-debutant-versioning.html`).
   - Page formation Pack Starter (`frontend/formations/starter.html`) : Ajout de liens vers le guide Git dans la section syllabus et vers le guide VS Code dans la FAQ débutant.
   - Base de données locale (`frontend/data/articles.json`) : Déclaration des deux nouveaux articles.
   - Homepage (`frontend/index.html`) : Mise à jour de la carte Git vers la nouvelle URL propre `/blog/git-explique-debutant-versioning` et ajout d'une carte dédiée pour le guide VS Code.
   - Plan de site XML (`frontend/sitemap.xml`) : Enregistrement des deux URLs canoniques avec priorité 0.8.

---

### 2026-10-01 — Harmonisation Tarifaire (Starter 299 €, Web Pro 449 €) & Add-on Suivi Mentor (+199 € / Downsell 89 €)
**Conversation**: `bee834aa-93e8-46e7-b63c-62b3900ccf51`  
**Branche**: `feat/suivi-mentor`

#### Ce qui a changé :
1. **Architecture Backend & Persistence (Flyway V018 & Modèles Mentor)** :
   - Migration `V018__add_mentor_addon.sql` : ajout des colonnes `mentor_slots_remaining` (défaut 3) sur `cohort`, création des tables `student_mentor_quota` et `student_mentor_sessions`, mise à jour des prix des cours de base (Starter 29900 cts, Web Pro 44900 cts).
   - Contrôleur et Service Cohorte (`CohortController`, `CohortService`, `MentorStats`) exposant `GET /api/cohorts/current` avec le nombre réel de places restantes par pack (`starter`, `web_pro`).
   - Module Mentor (`MentorService`, `StudentMentorQuota`, `StudentMentorSession`) gérant la décrémentation des places lors des paiements réels confirmés (webhook Stripe `checkout.session.completed` et synchronisation directe `confirmCheckoutSession`), la distribution des sessions par module et les montées en gamme Starter -> Web Pro.
   - Extension de `CreateCheckoutSessionRequest`, `PaymentService`, `StripeGateway`, et `StripeGatewayImpl` pour supporter le paramètre `addon` (`mentor_4sessions`, `mentor_downsell_2sessions`) avec calcul du montant total unitaire et stockage des métadonnées Stripe.
   - Validation par la suite complète de 138 tests backend (`BUILD SUCCESS`).
2. **Nouvelle Page Dédiée Suivi Mentor (`frontend/suivi-mentor.html`)** :
   - Landing page dédiée avec réécriture Apache `/suivi-mentor`, sitemap XML, métadonnées Open Graph, Twitter Cards et Schema.org JSON-LD `Service`.
   - Rédaction intégrale basée sur la section 4.1 du briefing, compteur dynamique de places restantes via `GET /api/cohorts/current`, et CTAs renvoyant vers `formations/starter?addon=mentor` et `formations/pack-web?addon=mentor`.
3. **Composant Add-on Interactif sur les Pages Formations (`starter.html`, `pack-web.html`)** :
   - Intégration de l'encart add-on interactif (+199 €) avec mise à jour dynamique des prix affichés (Starter : 299 € -> 498 €, 3x 99 € -> 3x 166 € ; Web Pro : 449 € -> 648 €, 3x 149 € -> 3x 216 €).
   - Prise en charge automatique du paramètre URL `?addon=mentor`.
   - Interrogation dynamique de `GET /api/cohorts/current` : affichage des places restantes réelles ou grisement avec message "Complet pour cette cohorte" si capacité atteinte.
4. **Checkout — Rappel Discret, Drawer Latéral et Modale Downsell (`popovers-shared.html`, `header.js`)** :
   - Ligne de rappel discrète sous le récapitulatif de commande Stripe Embedded Checkout si l'option mentor n'est pas sélectionnée.
   - Drawer latéral `#mentor-addon-drawer` avec récapitulatif de l'offre et bouton "Ajouter à ma commande" sans rechargement de page.
   - Modale downsell `#mentor-downsell-modal` (2 sessions pour 89 €) non agressive et non culpabilisante, affichée une seule fois par session (`sessionStorage`), avec choix neutre ("Ajouter 2 sessions pour 89 €" ou "Continuer sans le suivi").
5. **Harmonisation Tarifaire Globale & Nettoyage** :
   - Éradication des anciens prix obsolètes (89 €, 179 €, 279 €, 389 €, 579 €, 879 €) sur l'ensemble du frontend (`index.html`, `cours.js`, `formations/index.html`, `cgv.html`, `articles.json`, `thanks.html`, `article.js`).
   - Remplacement de la 3e carte "VIP" sur la homepage par le Bloc Add-on Suivi Mentor.
   - Recompilation complète des assets minifiés via `frontend/build.js`.


---

### 2026-10-01 — Correctif Tunnel de Vente, Authentification & Modale Downsell (Exit-Intent)
**Conversation**: bee834aa-93e8-46e7-b63c-62b3900ccf51  
**Branche**: feat/suivi-mentor

#### Ce qui a changé :
1. **Intégration Top-Layer & Hiérarchie Modale (popovers-shared.html)** :
   - Déplacement de #mentor-downsell-modal et #mentor-addon-drawer à l'intérieur de #stripe-paywall-modal pour partager le contexte top-layer de l'API HTML Popover (popover).
   - Positionnement en overlay absolu centré sur le terminal de paiement avec fond sombre occultant.
2. **Tunnel d'Achat Post-Connexion (header.js, cours.js, dashboard.html)** :
   - Priorisation stricte de la vérification d'authentification avant toute logique downsell dans openStripePaywall() : les utilisateurs non connectés sont immédiatement invités à se connecter ou créer un compte avec mise en mémoire (sessionStorage) du cours, tarif, tier et addon demandé.
   - Restauration de l'ouverture automatique du paywall sécurisé (openStripePaywall) dès validation de la connexion (handleGlobalEmailLogin, handleGlobalEmailRegister) ou retour OAuth Google/GitHub (dashboard.html).
   - cours.js : Déclenchement automatique de initiateStripeCheckout même pour un utilisateur déconnecté avec ?checkout=true, mémorisant l'intention et guidant l'utilisateur vers l'inscription.
3. **Câblage Exit-Intent Downsell (header.js)** :
   - La modale downsell (2 sessions pour 89 €) n'intercepte plus prématurément le flux d'achat initial : elle se déclenche uniquement en sortie (clic sur la fermeture du terminal paywall sans addon sélectionné ou clic "Non merci" dans le drawer mentor).
   - Ajout d'un écouteur d'événement toggle sur #stripe-paywall-modal pour assurer la destruction propre de l'instance Stripe Embedded en cas de fermeture par touche Échap ou clic externe.
4. **Correction Bouton CTA Starter (starter.html)** :
   - Ajout de l'identifiant id="starter-cta-btn" sur le bouton CTA de la page Starter, permettant le binding JavaScript dynamique et le lancement direct du paywall Stripe sans saut de page.
5. **Recompilation & Validation** :
   - Recompilation des scripts frontend (node frontend/build.js) mettant à jour header.min.js.
   - Exécution complète des tests backend (CohortControllerTest, PaywallSecurityTest, PaymentCheckoutServiceTest, PaymentWebhookSecurityTest) : 43 tests passés avec succès.

---

### 2026-10-01 — Connexion API Oracle Cloud VM par Défaut pour le Frontend Local (Port 3000)
**Conversation**: bee834aa-93e8-46e7-b63c-62b3900ccf51  
**Branche**: fix/local-oracle-api-connection

#### Ce qui a changé :
1. **Frontend — Cible API par Défaut vers la VM Oracle (`https://api.noseumcode.fr`)** :
   - Mise à jour de `initApiBaseUrl()` dans `header.js` et `getApiBaseUrl()` dans `dashboard.js` : suppression du forçage systématique de `localhost:8080` lorsque le frontend est servi sur `localhost` ou `127.0.0.1` (port 3000, 5500, etc.). Le frontend pointe désormais par défaut sur `https://api.noseumcode.fr` afin de pouvoir tester l'ensemble des flux (authentification, cohorte mentor, paywall Stripe, catalogue) contre les vraies données sans nécessiter de backend Java local en cours d'exécution.
   - Mécanisme d'override local conservé : support du paramètre URL `?api=local` ou de la clé `localStorage.setItem('noseum_api_target', 'local')` pour pointer sur `http://localhost:8080` au besoin.
   - Harmonisation des fallbacks API dans `frontend/js/cours.js`, `frontend/formations/starter.html`, `frontend/formations/pack-web.html`, `frontend/suivi-mentor.html`, `frontend/success.html`, et `frontend/reset-password.html`.
2. **Backend & Sécurité CORS** :
   - Ajout explicite de `http://127.0.0.1:3000`, `http://localhost:5500` et `http://127.0.0.1:5500` dans les origines CORS autorisées (`SecurityConfig.java` et `application.properties`).
   - Ajout de `http://127.0.0.1:3000` dans la liste blanche des redirections OAuth2 (`OAuth2RedirectUriFilter.java`) et mise à jour du test unitaire `OAuth2RedirectUriFilterTest.java`.
   - Alignement de la variable d'environnement `CORS_ALLOWED_ORIGINS` dans `.github/workflows/deploy.yml`.
3. **Recompilation Frontend** :
   - Recompilation des bundles de scripts et styles via `node frontend/build.js` (`header.min.js`).

---

### 2026-10-01 — Support CORS & OAuth2 des IP Locales Réseau (LAN 192.168.*, 10.*, 172.16-31.*)
**Conversation**: bee834aa-93e8-46e7-b63c-62b3900ccf51  
**Branche**: fix/lan-cors-origins

#### Ce qui a changé :
1. **Backend & Sécurité CORS (SecurityConfig.java)** :
   - Élargissement des patterns d'origines autorisées (`allowedOriginPatterns`) pour supporter l'ensemble des adresses IP privées RFC 1918 et les ports locaux arbitraires : `http://localhost:*`, `http://127.0.0.1:*`, `http://192.168.*`, `http://10.*`, et `http://172.16.*` à `http://172.31.*` (avec variantes HTTPS).
   - Résolution du blocage CORS `HTTP 403 Invalid CORS request` lors des requêtes d'authentification (`/api/auth/login`) ou d'accès API émises depuis un serveur de développement local accédé via l'IP réseau (ex. `http://192.168.1.9:3000`).
2. **Filtre de Redirection OAuth2 (OAuth2RedirectUriFilter.java)** :
   - Intégration de `PatternMatchUtils.simpleMatch` dans `isAuthorizedOrigin` pour valider dynamiquement les origines de redirection contenant des jokers `*`.
   - Autorisation des redirections OAuth2 (Google, Discord, GitHub) vers `http://192.168.*`, `http://10.*`, `http://localhost:*`, etc.
3. **Configuration & CI/CD** :
   - Alignement de `app.cors.allowed-origins` dans `backend/src/main/resources/application.properties`.
   - Alignement de la variable d'environnement `CORS_ALLOWED_ORIGINS` dans `.github/workflows/deploy.yml`.
4. **Tests Unitaires** :
   - `OAuth2RedirectUriFilterTest` étendu pour valider les redirections LAN (`http://192.168.1.9:3000`, `http://10.0.0.1:3000`, etc.) et la configuration CORS complète de `SecurityConfig.corsConfigurationSource()`.

---

### 2026-10-03 — Cadrage & Planification des Sprints 17, 18 et 19 (CRO, SEO, AEO & SSG)
**Conversation**: d2701bcf-ed1f-4e38-bb5e-52a921b4ec35  
**Branche**: `docs/add-sprints-17-18-19`  

#### Ce qui a changé :
1. **Création du Cahier des Charges Spécifique (`docs/specs/2026-10-urgences-cro-seo-architecture.md`)** :
   - Formalisation des 3 phases d'intervention (Phase 1 : Urgences 24h, Phase 2 : Optimisations IA 1 semaine, Phase 3 : Assainissement Architecture 1 mois).
2. **Synchronisation du Backlog GitHub Projects (Projet #1)** :
   - Clôture du Sprint 16 en statut `Done`.
   - Création des items de suivi pour le Sprint 17 (Urgences Vitales CRO/SEO), Sprint 18 (Optimisation IA & AEO) et Sprint 19 (Architecture Statique SSG) en statut `Todo`.
3. **Mise à Jour de la Roadmap Globale (`docs/ai/ROADMAP.md`)** :
   - Ajout des Sprints 17, 18 et 19 dans le tableau récapitulatif, extension du diagramme de Gantt Mermaid, et rédaction détaillée des tâches pour chaque sprint.
4. **Mise à Jour de la Mémoire Projet (`docs/ai/PROJECT_CONTEXT.md`)** :
   - Synchronisation de la branche active, de l'état actuel et des prochaines étapes d'exécution sans modification de code source.
## 2026-10-03 | Conversation: e0c73f84-bc39-488a-83c1-9ceaebb64b40

**Type**: UI Refactor
**Branche**: 	ask/replace-emojis-with-svg-icons`n
**Ce qui a été fait**:
- Remplacement intégral des emojis Unicode (qui font << IA >>, ex: fusées, lumières, checks, etc.) par des icônes SVG dans le frontend.
- Les icônes s'intègrent à la charte graphique de NoSeumCode (vert fluo, gris ardoise, contours nets, etc.).
- Fichiers impactés: workshops.js, script.js, popover-hubspot.js, workshops.html, parcours.html, partials/header.html, partials/popovers-shared.html, success.html, 	hanks.html, 
eset-password.html.
- Re-génération des fichiers JS minifiés via uild.js.

## 2026-10-03 — Sprint 17 : Urgences Vitales CRO & SEO

**Conversation ID**: 7bfc89b0-b294-4838-993a-3338df67db42  
**Branche**: eat/sprint-17-urgences-cro-seo  
**Objectif**: Corriger l'aberration des prix 3x Klarna, corriger les régressions SEO et optimiser les conversions lead gen.

### Réalisations & Corrections :
1. **Correction des prix 3x Klarna** :
   - Mise à jour des libellés dans rontend/js/cours.js, rontend/formations/starter.html, rontend/formations/pack-web.html et rontend/js/header.js pour refléter les prix corrects : Starter à 3x 109 € et Web Pro à 3x 160 €.
2. **SEO / Redirections** :
   - Suppression des balises <meta http-equiv="refresh"> obsolètes dans rontend/cours.html et rontend/course.html.
   - Ajout des redirections HTTP 301 permanentes pour course et course.html vers /parcours dans rontend/.htaccess.
3. **SEO / Indexation** :
   - Retrait immédiat de la balise <link rel="canonical" href="https://noseumcode.fr/article.html"> cannibale sur la page générique de blog (rontend/article.html).
4. **UX / Lead Gen** :
   - Ajout d'un bouton Call-to-Action proéminent pointant vers la section de réservation sur la page d'atterrissage des ateliers rontend/workshops.html.
5. **CRO Funnel / Tunnel de Remerciement** :
   - Fusion des 4 boutons de téléchargement fragmentés sur rontend/thanks.html en un appel clair et unique : « TÉLÉCHARGER MON PACK (ZIP & PDF) ».
   - Remontée stratégique du bloc d'upsell pour une visibilité accrue sans défilement de page.
