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

## Fausses Hypothèses à Éviter
- Ne pas supposer qu'une erreur navigateur 'Access-Control-Allow-Origin blocked by CORS policy' sur `api.noseumcode.fr` est toujours un problème de configuration CORS : si le conteneur Spring Boot crashe, Nginx renvoie une page 502 Bad Gateway sans en-tête CORS, ce qui déclenche l'erreur CORS côté navigateur.
- Ne pas supposer que modifier `POSTGRES_PASSWORD` dans les variables d'environnement d'un conteneur Docker PostgreSQL met à jour le mot de passe d'une base existante : le volume `pgdata` préserve le mot de passe initialisé et nécessite une commande SQL `ALTER USER`.

- Ne pas supposer que le compte FTP principal cPanel dépose les fichiers à la racine du sous-domaine `/home/yefa3951/develop.noseumcode.fr` : le compte FTP principal est confiné dans `noseumcode.fr/yefa3951/`. Le sous-domaine `develop.noseumcode.fr` dans cPanel doit avoir pour racine de document (Document Root) : `noseumcode.fr/yefa3951/develop.noseumcode.fr`.
- Ne pas supposer que le workflow FTP déploie uniquement le frontend sans le paramètre `local-dir: ./frontend/` : par défaut, SamKirkland/FTP-Deploy-Action déploie l'intégralité du repository (y compris backend Java, docs et fichiers de config) à la racine de la cible.
- Ne pas supposer qu'on peut pousser directement sur la branche `develop` : cela déclenche le déploiement immédiat en production sur la VM Oracle Cloud (`deploy.yml`) et sur le sous-domaine o2switch (`ftp-dev.yml`). Toujours passer par une PR.
- Ne pas supposer qu'en mode Stripe Embedded Checkout (`uiMode: EMBEDDED`), le paramètre `mode: 'payment'` est optionnel : l'API Stripe exige impérativement `mode: 'payment'` dès lors que des `line_items` / prix unitaires sont passés.
- Ne pas supposer que la désactivation CSRF est sécurisée sans vérification du `state` OAuth2.
- Ne pas supposer que `sanitizePartialHTML()` couvre tous les vecteurs XSS.
- Ne pas supposer que le profil `prod` est activé par défaut (dépend de la variable env `SPRING_PROFILES_ACTIVE`).

