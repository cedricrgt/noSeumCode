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

### ISSUE-027 ✅ Section Discord et bouton de connexion absents du tableau de bord Formateur [RÉSOLU]
**Status**: Résolu.
**Symptôme**: Sur le tableau de bord Formateur (`dashboard.html` / `js/dashboard.js`), le bouton « Connecter mon Discord » ainsi que toute la section dédiée à la communauté Discord étaient totalement absents de l'interface.
**Causes racines identifiées** :
1. *Structure DOM cloisonnée à la vue Apprenant* : Dans `frontend/dashboard.html`, `#discord-section` et `#discord-card-container` étaient imbriqués exclusivement à l'intérieur du conteneur `#view-student`, masqué par CSS (`display: none`) dès lors que l'utilisateur connecté possédait le rôle `TEACHER` ou `ADMIN`.
2. *Chargement du statut Discord conditionné au rôle Apprenant* : Dans `frontend/js/dashboard.js`, la fonction `loadDiscordStatus()` n'était exécutée dans `refreshDashboardData()` et dans `manuallySwitchDashboardView()` que lorsque la vue ou le rôle actif était `STUDENT`.
3. *Ciblage rigide par ID unique dans le JavaScript* : `loadDiscordStatus()` et `renderDiscordCard()` manipulaient exclusivement l'élément d'ID `discord-card-container`, sans supporter de conteneurs multiples pour les vues formateur et administrateur.
4. *Absence de résolution du rôle Formateur dans le backend* : Dans `DiscordService.java`, la méthode `resolveRoleNamesForUser(User user)` résolvait uniquement les rôles liés aux tiers de cours (`Starter`, `Dev Web Fullstack`, `Pack Mentorat VIP`), sans attribuer le libellé de rôle `@Formateur` ou `@Administrateur` aux utilisateurs enseignants ou administrateurs.
**Fix applied** :
1. Ajout de sections Discord dédiées dans `frontend/dashboard.html` au sein de `#view-teacher` (`#discord-section-teacher`, `#discord-card-container-teacher`) et de `#view-admin` (`#discord-section-admin`, `#discord-card-container-admin`) avec classe unifiée `.discord-card-container`.
2. Refactorisation de `loadDiscordStatus()` et `renderDiscordCard()` dans `frontend/js/dashboard.js` pour cibler tous les conteneurs `.discord-card-container`, adapter les textes, badges et libellés de boutons en fonction du rôle (`TEACHER` : « Associer mon compte Formateur ➔ », salons privés formateurs, mentorat ; `ADMIN` : « Associer mon compte Administrateur ➔ », modération et administration), et afficher les badges de rôles actifs.
3. Exécution systématique de `loadDiscordStatus()` dans `refreshDashboardData()` et `manuallySwitchDashboardView()` quel que soit le rôle connecté, avec rafraîchissement réactif du bouton d'en-tête `#btn-discord-header` et défilement fluide dynamique dans `scrollToDiscordSection()`.
### ISSUE-028 ✅ Blocage infini du statut Discord et erreur scrollToDiscordSection dans le Dashboard [RÉSOLU]
**Status**: Résolu.
**Symptôme**: Sur `dashboard.html`, le clic sur `#btn-discord-header` levait `Uncaught ReferenceError: scrollToDiscordSection is not defined at HTMLButtonElement.onclick`, et la carte Discord affichait en continu `Chargement du statut de la communauté Discord...`.
**Causes racines identifiées** :
1. *Variable email non déclarée dans parseAuthFromUrl* : Dans `dashboard.js`, l'appel `normalizeRole(role, email)` et la condition `if (email)` référençaient une variable `email` non extraite de l'URL hash via `params.get("email")`, déclenchant une `ReferenceError` non interceptée lors de l'initialisation du dashboard.
2. *Retour silencieux sur HTTP 401 dans loadDiscordStatus* : `loadDiscordStatus()` contenait `if (response && response.status === 401) return;`, abandonnant le composant dans son état HTML initial (spinner + texte de chargement) sans afficher la carte invitant à la liaison (`renderDiscordCard({ linked: false })`).
3. *Déclaration tardive de scrollToDiscordSection et cache navigateur 30 jours* : La fonction globale était déclarée tout en bas de `dashboard.js` sans garde-fou précoce dans le `<head>`, et `dashboard.js` était servi avec un en-tête Apache `Cache-Control: max-age=2592000` sans paramètre de versioning dans le tag `<script>`.
4. *Temporal Dead Zone sur activeDashboardView* : `let activeDashboardView = null;` était déclaré au milieu du fichier après des fonctions l'utilisant lors d'une initialisation synchrone (`document.readyState === "complete"`).
**Fix applied** :
1. Déclaration précoce de `scrollToDiscordSection` dans le `<head>` de `dashboard.html` et au sommet de `dashboard.js` avec binding immédiat sur `window.scrollToDiscordSection` et écouteur `click` direct sur `#btn-discord-header`.
2. Extraction conforme de `email` dans `parseAuthFromUrl()` et dans le callback OAuth2 de `dashboard.html`, avec simplification de `normalizeRole(role)` (1 seul argument).
3. Déplacement des variables de state (`activeDashboardView`, `cachedDiscordData`) au sommet de `dashboard.js` pour éliminer tout risque de TDZ.
4. Gestion gracieuse des réponses non authentifiées (absence de token ou 401) dans `loadDiscordStatus()` avec bascule immédiate vers la carte d'invitation Discord propre (`renderDiscordCard({ linked: false })`).
5. Implémentation de `getApiBaseUrl()` dynamique et sécurisation de `apiFetch()` et des exports HubSpot.
6. Ajout du cache-buster `dashboard.js?v=sprint11.2` dans `dashboard.html` pour forcer l'invalidation immédiate du cache HTTP navigateur.

### ISSUE-029 ✅ Clic inopérant sur le bouton « Découvrir les ateliers » du bandeau promo [RÉSOLU]
**Status**: Résolu.
**Symptôme**: Sur toutes les pages (accueil, formations, dashboard), le clic sur le bouton « DÉCOUVRIR LES ATELIERS (6 PLACES MAX) » dans le bandeau défilant vert n'avait aucun effet ou semblait complètement figé.
**Causes racines identifiées** :
1. *Défilement continu CSS & échec de hit-testing navigateur* : `.promo-banner__track` défilait en continu à haute vitesse (`animation: scroll-banner 60s/30s linear infinite`) sans règle de pause au survol (`:hover`) ou au focus (`:focus-within`). L'écart de coordonnées entre `mousedown` et `mouseup` pendant le déplacement permanent du bouton annulait la synthèse de l'événement `click` par le navigateur ou déclenchait une sélection de texte (`user-select`).
2. *Masquage physique par le badge de staging sur develop.noseumcode.fr* : `#dev-env-indicator` était inséré via `document.body.prepend()` avec `position: relative; z-index: 99999;`. À `scroll: 0`, le badge se superposait exactement sur les 32 premiers pixels de l'en-tête fixe (`.header`, `z-index: 1000`), interceptant physiquement tous les clics destinés au bandeau promo (hauteur 38px).
3. *Chemin relatif non résolu* : `link.href = "workshops.html"` n'utilisait pas `resolveAssetPath("workshops.html")`. Depuis un sous-dossier comme `/formations/starter.html`, le clic tentait de charger `/formations/workshops.html` (HTTP 404).
4. *Absence d'écouteur direct et fallback popover obsolète* : L'ancre ne disposait pas d'écouteur de secours sur `click`/`touchend`, et le HTML statique dans `header.html` contenait encore un bouton ouvrant le popover `#promo-popup` au lieu du lien vers `workshops.html`.
**Fix applied** :
1. Ajout de `.promo-banner:hover .promo-banner__track`, `.promo-banner:focus-within .promo-banner__track`, `.promo-banner:active .promo-banner__track { animation-play-state: paused; }`, `user-select: none;`, et support de `prefers-reduced-motion: reduce`.
2. Repositionnement non-bloquant de `#dev-env-indicator` en bas de page (`position: fixed; bottom: 0; pointer-events: none;`).
3. Résolution dynamique d'URL avec `resolveAssetPath("workshops.html")` et binding systématique des événements `click` et `touchend` assurant une navigation directe (ou un scroll fluide vers `#workshops-grid` si déjà sur la page des ateliers).
4. Synchronisation du fallback statique de `frontend/partials/header.html` avec les items sémantiques et le lien vers `workshops.html`.

### ISSUE-030 🟡 Mention "3x sans frais" trompeuse hors homepage
**Files**: `frontend/js/cours.js` (L.288-349), `frontend/formations/starter.html`, `frontend/formations/pack-web.html`.
**Risk**: 3x 109 EUR = 327 EUR > 299 EUR comptant : "sans frais" est une pratique commerciale potentiellement trompeuse (Code de la consommation). Corrige sur `index.html` (Sprint 18), pas encore ailleurs.
**Fix needed**: Remplacer par le total reel (327 / 480 EUR) ou aligner les prix pour que le fractionne soit reellement sans frais.

### ISSUE-031 ✅ Usurpation de session Stripe dans confirm-session [RÉSOLU Sprint 25]
**Status**: Résolu dans Sprint 25.
**Causes racines & Solutions** : `confirm-session` validait l'achat sans vérifier à qui appartenait la session Stripe. Résolu dans `EnrollmentProvisioningService` et `CheckoutController` par l'extraction stricte de `session.metadata.userId` et comparaison avec le JWT de l'utilisateur connecté (`AccessDeniedException` HTTP 403 Forbidden en cas de discordance).

### ISSUE-032 ✅ Vulnérabilités IDOR sur EnrollmentController [RÉSOLU Sprint 25]
**Status**: Résolu dans Sprint 25.
**Causes racines & Solutions** :
1. `GET /api/enrollments/{id}` dépourvu de contrôle d'accès : protégé par `@PreAuthorize("hasRole('ADMIN') or @enrollmentSecurity.canAccessEnrollment(#id, authentication)")` et vérification programmatique propriétaire/ADMIN.
2. `PUT /api/enrollments/{id}/progress` modifiable par n'importe quel token : restreint via `updateProgress(enrollmentId, authenticatedUserId, progress)` et requête JPA `findByIdAndUserId`.
3. `POST /api/enrollments` permettant d'injecter un `userId` arbitraire : verrouillé par vérification du rôle ADMIN (un étudiant ne peut inscrire que son propre compte).

### ISSUE-033 ✅ Raccordement actif de l'idempotence des webhooks Stripe [RÉSOLU Sprint 25]
**Status**: Résolu dans Sprint 25.
**Causes racines & Solutions** : `StripeWebhookController` parse désormais l'identifiant d'événement `id` (`root.path("id").asText()`) et tente l'insertion dans `StripeEvent` via `stripeEventRepository.saveAndFlush`. En cas de rejeu (violation de contrainte d'unicité `DataIntegrityViolationException`), l'événement est ignoré de manière idempotente avec retour immédiat HTTP 200 OK. Dans `StripeEventService`, le `default` du switch basculant le statut en `PENDING` a été supprimé au profit d'un log informatif et d'un retour sans effet de bord.

### ISSUE-034 ✅ Élimination des UUID legacy hardcodés dans EnrollmentService [RÉSOLU Sprint 25]
**Status**: Résolu dans Sprint 25.
**Causes racines & Solutions** : Les constantes `UUID.fromString("c1000000...")`, `c2000000...`, `c3000000...` dans `EnrollmentService` ont été supprimées et remplacées par des résolutions de catalogue dynamiques par slugs (`"pack-starter"`, `"pack-web-pro"`, `"pack-mentorat-vip"`), avec délégation de l'enrôlement multi-cours à `EnrollmentProvisioningService.enrollInBundleCourses`.

## Fausses Hypothèses à Éviter
- Ne pas supposer que valider le statut `paid` d'une session Stripe Checkout suffit sans vérifier la concordance entre `session.metadata.userId` et le token JWT de l'utilisateur connecté : sans cette vérification, un attaquant peut intercepter ou deviner un `session_id` pour s'approprier le cours payé par un tiers.
- Ne pas supposer qu'insérer dans une table d'idempotence nécessite une requête préalable de lecture (`existsBy...`) : en environnement concurrent, seule la contrainte `UNIQUE` en base de données avec interception de l'erreur d'intégrité (`DataIntegrityViolationException`) garantit une idempotence atomique sans condition de course (race condition).
- Ne pas supposer qu'un événement Stripe inconnu doit basculer le paiement de l'utilisateur en `PENDING` : les événements non supportés doivent simplement être ignorés avec un log informatif sans altérer l'état financier ou l'accès aux cours de l'élève.
### ISSUE-035 ✅ Échec du déploiement VM Oracle Cloud sur /actuator/health (Actuator manquant et 404 transformé en 500) [RÉSOLU]
**Status**: Résolu. `spring-boot-starter-actuator` n'était pas inclus dans `backend/pom.xml`, rendant l'endpoint `/actuator/health` inexistant. Spring MVC levait alors une `NoResourceFoundException`, interceptée par `@ExceptionHandler(Exception.class)` dans `GlobalExceptionHandler` qui la renvoyait en HTTP 500 au lieu de 404. De plus, `deploy.yml` utilisait un `sleep 10` statique sans polling et sans `--force-recreate` sur Docker Compose.
**Fix**:
1. Ajout de `spring-boot-starter-actuator` dans `backend/pom.xml`.
2. Configuration de `management.endpoints.web.exposure.include=health,info` et désactivation du `management.health.mail.enabled=false` dans `application.properties` (évite l'échec de santé quand SMTP n'est pas configuré sur la VM).
3. Interception explicite de `NoResourceFoundException` dans `GlobalExceptionHandler` renvoyant un statut HTTP 404 avec `ApiError`.
4. Remplacement du `sleep 10` dans `deploy.yml` par une boucle d'attente active (polling jusqu'à 60s) et ajout de `--force-recreate` sur `docker compose up -d --build`.

## Fausses Hypothèses à Éviter
- Ne pas supposer que `/actuator/health` existe nativement dans Spring Boot sans déclarer la dépendance `spring-boot-starter-actuator` dans `pom.xml` : sans ce starter, l'endpoint est inexistant.
- Ne pas supposer qu'un `@ExceptionHandler(Exception.class)` global préserve les statuts 404 de Spring Boot 3+ : sans gestionnaire explicite pour `NoResourceFoundException`, toute URL introuvable déclenche une exception non gérée renvoyée en HTTP 500 Internal Server Error.
- Ne pas supposer qu'un `sleep 10` suffit pour valider la santé du backend au déploiement : le démarrage Spring Boot peut prendre 12 à 15 secondes selon la charge CPU de la VM. Toujours utiliser une boucle de polling avec timeout.
- Ne pas supposer qu'un bouton ou lien placé dans un conteneur animé en CSS continu (`@keyframes translateX(...) infinite`) peut être cliqué facilement sans pause au survol (`animation-play-state: paused`) : le déplacement permanent sous le curseur provoque une discordance de coordonnées entre `mousedown` et `mouseup`, ce qui amène le navigateur à annuler le `click` ou à tenter une sélection de texte.
- Ne pas supposer qu'un badge inséré en `document.body.prepend()` avec `position: relative; z-index: 99999` ne perturbe pas la navigation : sur un site avec une barre d'en-tête fixe (`position: fixed; top: 0; z-index: 1000`), le badge de staging se superpose au sommet de la page à scroll 0 et vole tous les clics des éléments situés en dessous.
- Ne pas supposer qu'un retour précoce `if (status === 401) return;` est anodin dans les fonctions de chargement asynchrone d'UI : cela fige indéfiniment les conteneurs dans leur état de chargement initial (spinner/squelette). Il faut toujours rendre un état repli propre (ex: vue déconnectée ou invitation à l'action).
- Ne pas supposer que la section Discord et le statut de connexion ne concernent que la vue Apprenant : les formateurs et les administrateurs disposent également de salons dédiés (`#salle-des-profs`, `#ressources-cours`, modération) et doivent pouvoir associer leur compte Discord, visualiser leurs badges de rôle `@Formateur` ou `@Administrateur` et synchroniser leurs permissions depuis leur tableau de bord respectif (`#view-teacher` et `#view-admin`).
- Ne pas supposer que les webhooks Stripe doivent pointer sur `https://noseumcode.fr/api/...` : le domaine principal `noseumcode.fr` héberge uniquement le frontend statique sur Apache (o2switch). Tout endpoint API backend, y compris les webhooks Stripe, réside impérativement sur le sous-domaine `https://api.noseumcode.fr`. De plus, Stripe ne suit pas les redirections HTTP (toute réponse 3xx est traitée en échec par Stripe) ; l'URL configurée dans Stripe Dashboard / Workbench doit pointer directement sur le sous-domaine `api.noseumcode.fr`.
- Ne pas supposer qu'assigner des rôles Discord à l'achat suffit sans implémenter le retrait systématique des rôles (`removeRoleFromMember`) lors des révocations de paiement (`FAILED`, `REFUNDED`) : sans retrait explicite des rôles, un utilisateur dont le paiement a échoué ou a été remboursé conserve indéfiniment ses accès aux salons Discord privés.
- Ne pas supposer que les cours d'un pack bundle (ex: VIP ou Pack Dynamique Web) ont des statuts de paiement indépendants : si le statut d'un cours d'un pack passe en `FAILED` ou `REFUNDED`, les cours frères inclus dans le même pack doivent également voir leur statut de paiement et leurs rôles révoqués en cascade pour éviter les fuites d'accès.
- Ne pas supposer qu'on peut remplacer un défilement de texte SVG `textPath` le long d'un blob asymétrique par une rotation CSS `transform: rotate()` sur un `<g>` : contrairement à un cercle parfait, un tracé de blob organique est asymétrique. Faire tourner le tracé le fait pivoter hors de l'alignement de l'image rognée statique (`#heroBlobClip`), provoquant une traversée du visage et un décrochage visuel complet (« texte décalé »). L'animation de défilement fluide le long du contour s'effectue via `<textPath>` avec SMIL `<animate attributeName="startOffset">` (qui ne cause aucun CLS dès lors que le SVG parent a des dimensions et un `viewBox` fixes, la vraie cause du CLS Hero étant le `fadeIn` de l'IntersectionObserver exclu via `section:not(.hero)`). Pour respecter `prefers-reduced-motion`, utiliser l'API DOM standard `svg.pauseAnimations()`.
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

