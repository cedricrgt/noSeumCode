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
1. **GitHub Actions Workflow FTP (`.github/workflows/ftp.yml`)** :
   - Étape dynamique de sélection du répertoire cible FTP :
     * Branche `main` : répertoire de production `${{ secrets.FTP_DIR }}`.
     * Branche `develop` (ou autre branche de dev) : répertoire de dev `${{ secrets.FTP_DIR_DEV }}` (avec fallback à `develop.noseumcode.fr/`).
   - Support optionnel de credentials FTP dédiés pour l'environnement dev via secrets GitHub (`FTP_SERVER_DEV`, `FTP_USERNAME_DEV`, `FTP_PASSWORD_DEV`), avec repli transparent sur les identifiants standards.
2. **CORS Backend Spring Security (`SecurityConfig.java`, `.github/workflows/deploy.yml`)** :
   - Ajout explicite de `https://develop.noseumcode.fr` et du pattern `https://*.noseumcode.fr` dans les origines autorisées du backend Spring Boot.
   - Mise à jour du fallback `CORS_ALLOWED_ORIGINS` dans le script de déploiement VM Oracle Cloud (`deploy.yml`).
3. **Sécurité Frontend & SEO Apache (`frontend/.htaccess`)** :
   - Ajout de `https://develop.noseumcode.fr` dans la directive `connect-src` de la Content Security Policy (CSP).
   - En-tête conditionnel `X-Robots-Tag: noindex, nofollow, noarchive` appliqué sur le sous-domaine `develop.noseumcode.fr` pour prévenir tout risque d'indexation prématurée ou de duplicate content par les moteurs de recherche.
4. **Validation Locale** :
   - 64 tests unitaires exécutés et validés avec succès (`BUILD SUCCESS`, 0 échec, 0 erreur).