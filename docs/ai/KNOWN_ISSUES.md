# KNOWN_ISSUES.md — NoSeumCode

_Last updated: 2026-09-16 | Conversation: e0c9f398-8522-470e-9df1-e11344331037_

---

## Open Issues

### ISSUE-001 🔴 JWT Secret fallback hardcodé dans le code source
**File**: `JwtConfig.java` L.25 — `@Value("${...}:codebangers-super-secret-key-change-me-in-production-2026}")`
**File**: `application.properties` L.33 — fallback identique
**Risk**: Si `JWT_SECRET` n'est pas défini en prod, le fallback faible est utilisé silencieusement.
**Fix needed**: Supprimer le fallback. Lever une exception explicite si la variable n'est pas définie.

### ISSUE-002 🔴 JWT expiry 24h (> 1h max recommandé OWASP)
**File**: `.env` L.27 — `JWT_EXPIRY_HOURS=24`  
**File**: `application.properties` L.34 — `app.security.jwt-expiry-hours=${JWT_EXPIRY_HOURS:1}`
**Risk**: Token volé valide 24h. Pas de mécanisme de révocation (`jti` blacklist absent).
**Fix needed**: Passer à 1h max + implémenter refresh token + `jti` blacklist.

### ISSUE-003 ✅ Stripe Webhook validé par HMAC SHA-256 [RÉSOLU Sprint 1]
**Status**: Résolu dans Sprint 1 via `StripeWebhookValidator` et `PaymentController`.
**Validation**: HMAC SHA-256 cryptographique avec protection anti-rejeu (tolérance 300s) et comparaison en temps constant contre les attaques temporelles.

### ISSUE-004 🔴 CORS hardcodé dans SecurityConfig (mauvais domaine)
**File**: `SecurityConfig.java` L.66 — Pattern `https://*.codebangers.com` mais le domaine prod est `noseumcode.fr`.
**Risk**: CORS bloqué en prod pour les vrais utilisateurs ou trop permissif si wildcard.
**Fix needed**: Utiliser `${app.cors.allowed-origins}` injecté depuis l'env.

### ISSUE-005 🔴 Credentials Google OAuth2 réels dans le .env commité
**File**: `backend/.env` L.30-31 — `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` réels.
**Risk**: Si ce fichier est commité sur un repo public (ou leak), les secrets OAuth2 sont exposés.
**Fix needed**: Révoquer/régénérer le secret Google. S'assurer que `.env` est dans `.gitignore`.

### ISSUE-006 🟡 Pas de rate limiting sur les endpoints d'auth
**Files**: `AuthController.java` `/api/auth/login`, `/api/auth/register`
**Risk**: Brute-force sur le login. Pas de protection contre les attaques par dictionnaire.
**Fix needed**: Ajouter Bucket4j ou Spring Security rate limiter (max 5 tentatives / 15 min).

### ISSUE-007 🟡 Mot de passe minimum 6 caractères (insuffisant OWASP)
**File**: `RegisterRequest.java` L.28 — `@Size(min = 6, max = 100)`
**Risk**: Mots de passe faibles autorisés (OWASP recommande 12+ avec complexité).
**Fix needed**: Min 8 chars (recommandé 12) + pattern regex validant la complexité.

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

### ISSUE-016 🟡 `updateUser` sans validation `@Valid` dans UserController
**File**: `UserController.java` L.52 — `@RequestBody UserRequest request` sans `@Valid`
**Risk**: Les champs du UserRequest ne sont pas validés par Bean Validation.
**Fix needed**: Ajouter `@Valid` sur le `@RequestBody`.

### ISSUE-017 ✅ Content-Type JSON et payload brut vérifiés [RÉSOLU Sprint 1]
**Status**: Résolu dans Sprint 1. `PaymentController` impose désormais `consumes = "application/json"`, lit le `@RequestBody String rawPayload` brut et effectue un parsing Jackson sécurisé avec gestion des erreurs de syntaxe.

### ISSUE-018 ✅ Purge totale de `noseum_payments` dans localStorage [RÉSOLU Sprint 1]
**Status**: Résolu dans Sprint 1. Toutes les dépendances à `noseum_payments` dans `cours.js` et `dashboard.js` ont été purgées. Les statuts d'accès et d'inscription reposent exclusivement sur l'API backend et les claims vérifiés.

### ISSUE-019 🟡 Exécutable `git` non exposé dans le PATH de l'environnement PowerShell Windows
**Environment**: Shell Windows PowerShell actif
**Risk**: Empêche les commandes Git automatiques locales (`git checkout`, `git commit`, `git push`, `gh pr create`) tant que le chemin vers Git n'est pas renseigné ou ajouté au `PATH`.
**Fix needed**: Localiser `git.exe` sur la machine ou l'ajouter au `PATH` système/utilisateur Windows.

## Fausses Hypothèses à Éviter

- Ne pas supposer qu'on peut pousser directement sur la branche `develop` : cela déclenche le déploiement immédiat en production sur la VM Oracle Cloud (`deploy.yml`). Toujours passer par une PR.
- Ne pas supposer que la désactivation CSRF est sécurisée sans vérification du `state` OAuth2.
- Ne pas supposer que `sanitizePartialHTML()` couvre tous les vecteurs XSS.
- Ne pas supposer que le profil `prod` est activé par défaut (dépend de la variable env `SPRING_PROFILES_ACTIVE`).

