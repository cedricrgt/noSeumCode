# KNOWN_ISSUES.md — NoSeumCode

_Last updated: 2026-09-16 | Conversation: e0c9f398-8522-470e-9df1-e11344331037_

---

## Open Issues

### ISSUE-001 ✅ JWT Secret fallback supprimé [RÉSOLU Sprint 3]
**Status**: Résolu. `JwtConfig.java` lève explicitement une exception `IllegalArgumentException` si `JWT_SECRET` est vide ou manquant. Aucun fallback faible n'est utilisé.

### ISSUE-002 ✅ JWT expiry 1h et Refresh Token RTR 7 jours [RÉSOLU Sprint 3]
**Status**: Résolu dans Sprint 3. Access token configuré à 1h par défaut (`app.security.jwt-expiry-hours=1`). Mise en place du Refresh Token longue durée (7 jours) avec Refresh Token Rotation (RTR) conforme OWASP ASVS dans `RefreshTokenService`, entité `RefreshToken` et hachage SHA-256 dans PostgreSQL.

### ISSUE-003 ✅ Stripe Webhook validé par HMAC SHA-256 [RÉSOLU Sprint 1]
**Status**: Résolu dans Sprint 1 via `StripeWebhookValidator` et `PaymentController`.
**Validation**: HMAC SHA-256 cryptographique avec protection anti-rejeu (tolérance 300s) et comparaison en temps constant contre les attaques temporelles.

### ISSUE-004 ✅ CORS configuré via app.cors.allowed-origins et multi-environnements [RÉSOLU]
**Status**: Résolu. `SecurityConfig.java` injecte `${app.cors.allowed-origins}` avec fallback dynamique et autorise explicitement `https://noseumcode.fr`, `https://www.noseumcode.fr`, `https://develop.noseumcode.fr` et `https://*.noseumcode.fr` via `setAllowedOriginPatterns`. Fallback synchronisé dans `deploy.yml`.

### ISSUE-005 🔴 Credentials Google OAuth2 réels dans le .env commité
**File**: `backend/.env` L.30-31 — `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` réels.
**Risk**: Si ce fichier est commité sur un repo public (ou leak), les secrets OAuth2 sont exposés.
**Fix needed**: Révoquer/régénérer le secret Google. S'assurer que `.env` est dans `.gitignore`.

### ISSUE-006 ✅ Rate limiting sur les endpoints d'authentification [RÉSOLU Sprint 3]
**Status**: Résolu dans Sprint 3 via `AuthRateLimitingFilter`. Protection active sur `/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/reset-password` (15 requêtes/min par IP, renvoie HTTP 429 Too Many Requests avec header `Retry-After: 60`).

### ISSUE-007 ✅ Politique de complexité mot de passe renforcée (min 8 chars) [RÉSOLU Sprint 3]
**Status**: Résolu dans Sprint 3. `@Size(min = 8, max = 100)` appliqué sur `RegisterRequest.java` et `ResetPasswordRequest.java` ainsi que validation client dans les formulaires d'inscription et de réinitialisation.

### ISSUE-008 🟡 CSRF désactivé globalement (risque pour OAuth2 state)
**File**: `SecurityConfig.java` L.40 — `csrf.disable()`
**Note**: Acceptable pour une API stateless JWT, MAIS la gestion OAuth2 côté frontend sans vérification du `state` parameter est risquée.
**Fix needed**: Vérifier que le paramètre OAuth2 `state` est bien validé côté callback.

### ISSUE-009 🟡 Token JWT exposé en URL fragment (OAuth2 callback)
**File**: `OAuth2AuthenticationSuccessHandler.java` L.42-48
**Risk**: Les URL fragments peuvent être loggés par les serveurs proxy, navigateurs, CDN.
**Fix needed**: Préférer un cookie `HttpOnly; SameSite=Strict; Secure` ou un échange via POST avec un code de session courte durée.

### ISSUE-010 🟡 AdminSeeder log toute la base users à chaque démarrage
**File**: `AdminSeeder.java` L.72-82 — `findAll().forEach(u -> log.info(...))`
**Risk**: Logs exposant emails, UUIDs, statuts de blocage/suppression en production (PII).
**Fix needed**: Supprimer ce loop ou le conditionner à un profil `dev` uniquement.

### ISSUE-011 🟡 `normalizeRole()` dans le frontend dépend de l'email hardcodé
**File**: `dashboard.js` L.41 — `if (email === "admin@codebangers.fr") return "ADMIN"`
**Risk**: Logique de rôle côté client facilement contournable. Rôle devrait venir uniquement du JWT validé côté backend.
**Fix needed**: Retirer cette logique. Se fier uniquement au claim `role` du JWT validé.

### ISSUE-012 🟡 `innerHTML` avec données non-sanitisées dans le frontend
**File**: `dashboard.js` L.614, L.619 — `track.innerHTML = item1HTML` (données du schedule.json)
**File**: `header.js` L.33, L.43 — `sanitizePartialHTML()` appelée (bonne pratique, MAIS ne couvre pas tous les cas)
**Risk**: XSS si schedule.json ou les données backend sont compromis.
**Fix needed**: Passer à `textContent` / `escapeHtml()` systématiquement pour les données dynamiques.

### ISSUE-013 🟡 CSP avec `unsafe-inline` (scripts ET styles)
**File**: `.htaccess` L.71 — `script-src 'self' 'unsafe-inline'`
**Risk**: Permet l'exécution de scripts inline, annulant une grande partie de la protection XSS du CSP.
**Fix needed**: Migrer les scripts inline vers des fichiers externes. Utiliser des nonces ou hashes CSP.

### ISSUE-014 🟢 SeedDataInitializer crée des mots de passe `changeme123`
**File**: `SeedDataInitializer.java` L.69-75 — uniquement profil `dev`, OK.
**Note**: Bien protégé par `@Profile("dev")`. Aucun risque en production.

### ISSUE-015 🟢 Commentaires redondants / en français dans le code Java et JS
**Files**: Multiples fichiers — commentaires qui décrivent l'évident ou sont dans la mauvaise langue.
**Fix needed**: Audit et nettoyage des commentaires (voir rapport dédié).

### ISSUE-016 ✅ `updateUser` validé avec `@Valid` [RÉSOLU Sprint 3]
**Status**: Résolu dans Sprint 3. Annotation `@Valid` ajoutée sur `@RequestBody UserRequest request` dans `UserController.java`.

### ISSUE-017 ✅ Content-Type JSON et payload brut vérifiés [RÉSOLU Sprint 1]
**Status**: Résolu dans Sprint 1. `PaymentController` impose désormais `consumes = "application/json"`, lit le `@RequestBody String rawPayload` brut et effectue un parsing Jackson sécurisé avec gestion des erreurs de syntaxe.

### ISSUE-018 ✅ Purge totale de `noseum_payments` dans localStorage [RÉSOLU Sprint 1]
**Status**: Résolu dans Sprint 1. Toutes les dépendances à `noseum_payments` dans `cours.js` et `dashboard.js` ont été purgées. Les statuts d'accès et d'inscription reposent exclusivement sur l'API backend et les claims vérifiés.

### ISSUE-019 ✅ Exécutable `git` et `gh` fonctionnels [RÉSOLU Sprint 3]
**Status**: Résolu. `git.exe` (Git 2.55) et `gh.exe` (GitHub CLI) sont bien présents et accessibles dans le PATH de l'environnement PowerShell.

### ISSUE-020 🟡 Désynchronisation mot de passe PostgreSQL VM Oracle vs GitHub Secrets
**Environment**: VM Oracle Cloud / Conteneur Docker `noseumcode_db`
**Risk**: Si le secret GitHub `DB_PASSWORD` est modifié ou diffère du mot de passe initialisé dans le volume `pgdata`, Spring Boot crashe au démarrage (`FATAL: password authentication failed for user`). Nginx renvoie un 502 sans headers CORS, causant un échec réseau masqué en erreur CORS.
**Fix applied**: Synchronisation automatique et idempotente dans `deploy.yml` via `ALTER USER` exécuté en socket Unix local.

### ISSUE-021 ✅ Absence de la constante enum TEXT dans `Content.ContentType` [RÉSOLU]
**Status**: Résolu. Les migrations Flyway V007 et V011 insèrent des enregistrements avec `content_type = 'TEXT'`, alors que l'énumération Java `Content.ContentType` ne contenait que `HEADING`, `PARAGRAPH`, etc. Lors de la récupération d'un cours via `/api/chapters/course/{id}/all`, Hibernate levait une `IllegalArgumentException: No enum constant com.codebangers.backend.content.model.Content.ContentType.TEXT` (HTTP 400).
**Fix applied**: Ajout de la valeur `TEXT` dans l'énumération `Content.ContentType` avec la méthode d'analyse désensibilisée à la casse `@JsonCreator fromString()`, validé par tests unitaires.

### ISSUE-022 ✅ Syntaxe UUID non hexadécimale dans la migration Flyway V013 [RÉSOLU]
**Status**: Résolu. La migration `V013__seed_toussaint_workshops.sql` utilisait des identifiants avec préfixe non hexadécimal (`w1000000-...`). Bien que toléré par H2 en mémoire lors des tests, PostgreSQL en production lève une erreur `22P02: invalid input syntax for type uuid`.
**Fix applied**: Remplacement des UUIDs par des valeurs hexadécimales valides `b1000000-0000-0000-0000-00000000000x` dans V013 et dans `workshops.js`. Ajout d'une commande automatique de nettoyage `DELETE FROM flyway_schema_history WHERE success = false;` dans `deploy.yml` pour permettre le rejeu automatique sans intervention manuelle.

### ISSUE-023 ✅ Avertissement Google Safe Browsing / Chrome Lookalike sur develop.noseumcode.fr [RÉSOLU]
**Status**: Résolu. Google Chrome affichait un avertissement interstitiel rouge (« Site dangereux / Site trompeur » ou « Attention : faux site / S'agit-il du bon site ? ») lors de la visite de `https://develop.noseumcode.fr`.
**Causes racines identifiées** :
1. Détection Lookalike / Social Engineering par Google Safe Browsing : `develop.noseumcode.fr` présentait une interface identique à `noseumcode.fr` (formulaires d'authentification email/mot de passe et bouton Google) sans fichier d'association explicite Digital Asset Links entre les domaines.
2. Absence de `robots.txt` restrictif sur l'environnement de dev : les moteurs et robots Google scannaient le sous-domaine de pré-production qui exposait un `robots.txt` autorisant l'exploration (`Allow: /`) et pointant vers la sitemap de production.
3. Fichiers de build internes exposés publiquement à la racine du sous-domaine (`build.sh`, `build.ps1`, `package.json`, etc.).
**Fix applied** :
1. Implémentation du protocole Google Digital Asset Links (`frontend/.well-known/assetlinks.json`) liant formellement `noseumcode.fr`, `www.noseumcode.fr` et `develop.noseumcode.fr` pour les relations `get_login_creds` et `handle_all_urls`.
2. Création de `frontend/robots-dev.txt` (`Disallow: /`) et réécriture transparente dans `.htaccess` pour isoler strictement `develop.noseumcode.fr` de tout crawler web.
3. Durcissement Apache `.htaccess` : blocage HTTP strict (403 Forbidden) des scripts shell/powershell/build, manifestes de paquets (`package.json`, `package-lock.json`), fichiers markdown et dotfiles (hors `/.well-known/`). En-tête MIME `application/json` et CORS garanti pour `assetlinks.json`.
4. Workflows CI/CD (`ftp-dev.yml` et `ftp.yml`) : exclusion formelle de téléversement des fichiers hors production (`exclude: **/*.sh, **/*.ps1, build.js, package*.json, README.md, .env*`).
5. Indicateur visuel d'environnement de staging dans `header.js` sur `develop.noseumcode.fr` pour clarifier le statut de pré-production auprès des utilisateurs et des réviseurs Google.

### ISSUE-024 ✅ Régression Core Web Vitals : LCP Discovery (1 100 ms), CLS Hero (0.081), Forced Reflow Plausible (136 ms) & Accessibilité [RÉSOLU Sprint 10]
**Status**: Résolu dans Sprint 10.
**Causes racines & Solutions** :
1. *Délai LCP (1 100 ms)* : L'image LCP (`student-female-smiling.webp`) imbriquée dans un SVG sans `<link rel="preload">` était découverte tardivement par le scanner de pré-analyse et retardée par une animation d'entrée `fadeIn` (`opacity: 0`). Solution : ajout de `<link rel="preload" as="image" href="images/hero/student-female-smiling.webp" type="image/webp" fetchpriority="high">` et `fetchpriority="high"` sur l'élément `<image>`.
2. *CLS Hero (0.081)* : L'animation SMIL SVG (`<animate attributeName="startOffset">`) forçait la recalculation continue de mise en page des glyphes, et l'IntersectionObserver appliquait `fadeIn` (`translateY(20px)`) sur le Hero au-dessus de la ligne de flottaison. Solution : exclusion de `.hero` de l'observateur et remplacement du SMIL par une rotation CSS compositée sur GPU (`<g class="hero__blob-text-rotate">`).
3. *Forced Reflow Plausible (136 ms) & Header (13 ms)* : Le script Plausible `script.tagged-events.outbound-links.js` parcourait le DOM de manière synchrone au DOMContentLoaded, et `header.js` lisait `offsetHeight` immédiatement après insertion de `innerHTML`. Solution : injection différée de Plausible sur `window.load` / `requestIdleCallback` (avec stub `window.plausible.q`) et encapsulage du calcul de hauteur d'en-tête dans `window.requestAnimationFrame`.
4. *Accessibilité & Contrastes WCAG AA* : Attribut `aria-label` interdit sur `<label>` (`header.html`) remplacé par `<span class="sr-only">`. Ratios de contraste renforcés (>5:1) sur `.section-tag`, `.rassurance__badge`, les pastilles de pack et `.footer__link`. Noms accessibles uniques attribués aux 3 liens de cartes de blog.

### ISSUE-025 ✅ Désynchronisation Pack VIP, Révocation Rôles Discord & Gestion des Statuts de Paiement Admin [RÉSOLU]
**Status**: Résolu.
**Causes racines & Solutions** :
1. *Achat VIP & cours manquant* : Le bouton VIP sur `index.html` utilisait l'ID du Pack Web au lieu de l'UUID du Pack VIP (`c3000000-0000-0000-0000-000000000003`), et `COURSE_SLUG_MAP` dans `header.js` redirigeait `"vip"` vers le Cours 2. De plus, `confirmCheckoutSession` et `processStripeWebhookEvent` n'inscrivaient l'élève qu'au seul cours racine. Solution : correction de l'UUID sur `index.html`, dans `header.js` et ajout de `enrollInBundleCourses` dans `PaymentService` et `EnrollmentService` inscrivant l'étudiant aux 3 cours du Pack VIP (`c3`, `c2`, `c1`) ou aux 2 cours du Pack Web (`c2`, `c1`).
2. *Révocation du statut de paiement inopérante* :
   - `DiscordService.syncUserRoles` ne contenait aucune logique de suppression de rôle (`removeRoleFromMember`).
   - `EnrollmentService.updatePaymentStatus` et `setCoursePaymentStatusForUser` n'invoquaient pas `DiscordService`.
   - `EnrollmentService.hasPaidAccess` laissait passer l'accès si un cours frère du bundle était encore marqué `PAID`.
   Solution : ajout du retrait des rôles Discord pour les tiers révoqués, cascade du statut `FAILED` / `REFUNDED` sur les inscriptions du même pack bundle, synchronisation automatique de Discord lors de toute mise à jour de statut d'inscription ou suppression, et verrouillage explicite `explicitDenied` dans `hasPaidAccess`.
3. *Administration du statut de paiement & Stripe* : L'interface admin `dashboard.js` n'exposait aucun contrôle direct pour modifier le statut global de l'utilisateur (`PATCH /api/payments/user/{userId}/status`). Solution : ajout du sélecteur interactif de statut global dans le tableau des utilisateurs et dans la fiche détaillée, synchronisation proactive synchrone de `session_id` Stripe Checkout sur le chargement du dashboard.
4. *Élimination des emojis IA* : Remplacement intégral des emojis Unicode génériques par des composants vectoriels SVG personnalisés (NoSeumCode comic/cyberpunk) sur `dashboard.html` et `dashboard.js`.

### ISSUE-026 ✅ URL de l'endpoint Webhook Stripe en 404 (absence du sous-domaine api.) [RÉSOLU]
**Status**: Résolu.
**Symptôme**: Email d'alerte Stripe signalant 36 tentatives de requêtes webhook échouées en code HTTP 404 vers `https://noseumcode.fr/api/payments/webhook`.
**Causes racines identifiées** :
1. *Mauvais domaine cible configuré dans Stripe* : L'endpoint de webhook de test Stripe (`we_1UJIZZAmRX1Xf5vuArlYEPHR`) était configuré avec l'URL du frontend statique o2switch (`https://noseumcode.fr/api/payments/webhook`) au lieu du sous-domaine API backend (`https://api.noseumcode.fr/api/payments/webhook`). Sur Apache o2switch, aucun fichier statique n'existant sous `/api/payments/webhook`, le serveur retournait HTTP 404 Not Found.
2. *Absence de règle de secours / redirection sur Apache* : Aucune règle de réécriture dans `frontend/.htaccess` ne redirigeait les appels `/api/*` vers l'hôte backend `https://api.noseumcode.fr`.
3. *Comportement de Stripe vis-à-vis des redirections* : Selon la documentation officielle Stripe, Stripe considère toute redirection HTTP (`3xx`) comme un échec de livraison. L'endpoint doit donc impérativement pointer directement vers l'URL résolue (`https://api.noseumcode.fr/api/payments/webhook`).
**Fix applied** :
1. Mise à jour directe de l'endpoint webhook de test Stripe (`we_1UJIZZAmRX1Xf5vuArlYEPHR`) vers `https://api.noseumcode.fr/api/payments/webhook` via l'API Stripe (`PostWebhookEndpointsWebhookEndpoint`).
2. Ajout d'une règle de réécriture HTTP 307 dans `frontend/.htaccess` (`RewriteRule ^api/(.*)$ https://api.noseumcode.fr/api/$1 [R=307,L,QSA]`) assurant la préservation de la méthode HTTP et des données pour tout appel direct sur l'hôte frontend.
3. Ajout d'un endpoint GET de health check / diagnostic sur `/api/payments/webhook` et `/api/payments/webhook/stripe` dans `PaymentController.java` (`getWebhookHealth`) renvoyant HTTP 200 OK avec le statut opérationnel de l'écouteur d'événements.
4. Validation par tests unitaires (`PaymentWebhookSecurityTest.java`, 131 tests réussis, 0 échec).

## Fausses Hypothèses à Éviter
- Ne pas supposer que les webhooks Stripe doivent pointer sur `https://noseumcode.fr/api/...` : le domaine principal `noseumcode.fr` héberge uniquement le frontend statique sur Apache (o2switch). Tout endpoint API backend, y compris les webhooks Stripe, réside impérativement sur le sous-domaine `https://api.noseumcode.fr`. De plus, Stripe ne suit pas les redirections HTTP (toute réponse 3xx est traitée en échec par Stripe) ; l'URL configurée dans Stripe Dashboard / Workbench doit pointer directement sur le sous-domaine `api.noseumcode.fr`.
- Ne pas supposer qu'assigner des rôles Discord à l'achat suffit sans implémenter le retrait systématique des rôles (`removeRoleFromMember`) lors des révocations de paiement (`FAILED`, `REFUNDED`) : sans retrait explicite des rôles, un utilisateur dont le paiement a échoué ou a été remboursé conserve indéfiniment ses accès aux salons Discord privés.
- Ne pas supposer que les cours d'un pack bundle (ex: VIP ou Pack Dynamique Web) ont des statuts de paiement indépendants : si le statut d'un cours d'un pack passe en `FAILED` ou `REFUNDED`, les cours frères inclus dans le même pack doivent également voir leur statut de paiement et leurs rôles révoqués en cascade pour éviter les fuites d'accès.
- Ne pas supposer qu'animer SVG `startOffset` avec SMIL `<animate>` est neutre en performance : cela recalcule les boîtes englobantes des glyphes SVG à chaque frame sur le thread principal et déclenche du CLS dans Lighthouse. Préférer une rotation CSS `transform: rotate()` sur un `<g>` SVG accéléré par GPU.
- Ne pas supposer qu'appliquer une animation d'entrée `fade-in` (`translateY(20px)`) via un `IntersectionObserver` sur la section Hero au-dessus de la ligne de flottaison est anodin : cela retarde le LCP et cause un décalage cumulé de mise en page (CLS). Les éléments above-the-fold doivent impérativement être exclus de l'observateur.
- Ne pas supposer qu'un script tiers chargé avec `defer` ne perturbe pas le premier rendu : un script de tracking d'outbound links qui parcourt le DOM au moment du DOMContentLoaded peut déclencher un ajustement forcé de mise en page (forced reflow). L'exécuter sur `window.load` / `requestIdleCallback`.
- Ne pas supposer qu'un `<label>` peut porter un attribut `aria-label` : selon la norme W3C ARIA et axe-core (`aria-prohibited-attr`), l'attribut `aria-label` est prohibé sur `<label>`. Préférer un `<span class="sr-only">` enfant.
- Ne pas supposer qu'un simple `X-Robots-Tag: noindex` empêche Google Safe Browsing de scanner un sous-domaine : Safe Browsing analyse les pages visitées par les utilisateurs Chrome indépendamment des directives d'indexation SEO.
- Ne pas supposer que Chrome reconnaît automatiquement les relations entre un sous-domaine de dev et un domaine principal : sans fichier `/.well-known/assetlinks.json` et sans validation Search Console, un clone de staging avec formulaire de login peut être classé comme hameçonnage/lookalike.
- Ne pas supposer que PostgreSQL accepte n'importe quelle chaîne de 36 caractères pour le type `uuid` : contrairement à H2 (souple en mémoire lors des tests), PostgreSQL exige des caractères hexadécimaux stricts `[0-9a-fA-F]`. Des préfixes comme `w1000000-...` provoquent une erreur SQL `22P02: invalid input syntax for type uuid`.
- Ne pas supposer qu'un simple redémarrage de conteneur suffit après l'échec d'une migration Flyway : Flyway consigne la ligne avec `success = false` dans `flyway_schema_history`. Une purge (`DELETE FROM flyway_schema_history WHERE success = false;`) ou un `flyway repair` est nécessaire pour réexécuter la migration corrigée.
- Ne pas supposer qu'une erreur navigateur 'Access-Control-Allow-Origin blocked by CORS policy' sur `api.noseumcode.fr` est toujours un problème de configuration CORS : si le conteneur Spring Boot crashe, Nginx renvoie une page 502 Bad Gateway sans en-tête CORS, ce qui déclenche l'erreur CORS côté navigateur.
- Ne pas supposer que modifier `POSTGRES_PASSWORD` dans les variables d'environnement d'un conteneur Docker PostgreSQL met à jour le mot de passe d'une base existante : le volume `pgdata` préserve le mot de passe initialisé et nécessite une commande SQL `ALTER USER`.
- Ne pas supposer que le compte FTP principal cPanel dépose les fichiers à la racine du sous-domaine `/home/yefa3951/develop.noseumcode.fr` : le compte FTP principal est confiné dans `noseumcode.fr/yefa3951/`. Le sous-domaine `develop.noseumcode.fr` dans cPanel doit avoir pour racine de document (Document Root) : `noseumcode.fr/yefa3951/develop.noseumcode.fr`.
- Ne pas supposer que le workflow FTP déploie uniquement le frontend sans le paramètre `local-dir: ./frontend/` : par défaut, SamKirkland/FTP-Deploy-Action déploie l'intégralité du repository (y compris backend Java, docs et fichiers de config) à la racine de la cible.
- Ne pas supposer qu'on peut pousser directement sur la branche `develop` : cela déclenche le déploiement immédiat en production sur la VM Oracle Cloud (`deploy.yml`) et sur le sous-domaine o2switch (`ftp-dev.yml`). Toujours passer par une PR.
- Ne pas supposer qu'en mode Stripe Embedded Checkout (`uiMode: EMBEDDED`), le paramètre `mode: 'payment'` est optionnel : l'API Stripe exige impérativement `mode: 'payment'` dès lors que des `line_items` / prix unitaires sont passés.
- Ne pas supposer que la désactivation CSRF est sécurisée sans vérification du `state` OAuth2.
- Ne pas supposer que `sanitizePartialHTML()` couvre tous les vecteurs XSS.
- Ne pas supposer que le profil `prod` est activé par défaut (dépend de la variable env `SPRING_PROFILES_ACTIVE`).
- Ne pas supposer que l'appel Discord `PUT /guilds/{guildId}/members/{userId}` accepte uniquement le jeton utilisateur : il exige impérativement l'en-tête `Authorization: Bot <bot_token>` ET le jeton d'accès OAuth2 de l'utilisateur (avec scope `guilds.join`) dans le corps JSON `{ "access_token": "..." }`. Si l'utilisateur est déjà membre de la guilde, Discord renvoie HTTP 204 No Content (et non 201 Created) sans assigner les rôles passés dans le corps ; il faut alors assigner chaque rôle individuellement via `PUT /guilds/{guildId}/members/{userId}/roles/{roleId}`.
- Ne pas supposer que l'échec d'un appel réseau vers l'API Discord doit faire échouer la transaction d'achat Stripe ou la connexion utilisateur : l'intégration Discord doit rester résiliente et non-bloquante avec simulation gracieuse en dev/staging si les credentials du bot sont absents.
- Ne pas supposer que Discord OAuth2 accepte des chaînes quelconques en tant que `client_id` : Discord impose un entier snowflake 64-bit strict (ex: `1554118371501412422`). Toute valeur factice (`mock-discord-client-id`) provoque immédiatement une erreur bloquante `{"client_id": ["La valeur « mock-discord-client-id » n’est pas snowflake."]}`. Les identifiants réels `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_BOT_TOKEN`, `DISCORD_GUILD_ID` et les IDs de rôles doivent impérativement être injectés via GitHub Secrets dans le workflow `deploy.yml`.

