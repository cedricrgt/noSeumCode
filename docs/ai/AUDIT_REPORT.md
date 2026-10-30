# 🔍 Rapport d'Audit Pré-Production — NoSeumCode
**Date**: 2026-09-16 | **Branche**: `task/security-check`
**Périmètre**: Backend (Spring Boot 3.4.3 / Java 21) + Frontend (Vanilla HTML/CSS/JS)
**Standards**: OWASP Top 10, OWASP ASVS, WCAG 2.1 AA

---

## Résumé Exécutif

| Catégorie | 🔴 Critique | 🟡 Important | 🟢 Mineur |
|-----------|------------|-------------|----------|
| Sécurité Backend | 5 | 5 | 1 |
| Sécurité Frontend | 1 | 3 | 1 |
| Accessibilité | 0 | 2 | 3 |
| Qualité / Commentaires | 0 | 2 | 5 |
| **Total** | **6** | **12** | **10** |

---

## 1. SÉCURITÉ BACKEND

### SEC-B-001 🔴 JWT Secret fallback hardcodé dans le code source
**Fichier**: `JwtConfig.java` L.25, `application.properties` L.33
Si JWT_SECRET n'est pas défini en prod, le fallback faible est utilisé silencieusement.
**Fix**: Supprimer le fallback du @Value. Lever une exception si absent.

### SEC-B-002 🔴 Credentials Google OAuth2 réels dans backend/.env
**Fichier**: `backend/.env` L.30-31 — GOOGLE_CLIENT_SECRET exposé
**Actions immédiates**: Révoquer le secret. Vérifier l'historique Git (trufflehog).

### SEC-B-003 🔴 Stripe Webhook sans validation de signature
**Fichier**: `PaymentController.java` L.56 — Stripe-Signature reçu mais JAMAIS validé.
**Fix**: Utiliser `Webhook.constructEvent()` de la lib stripe-java.

### SEC-B-004 🔴 JWT expiry 24h (OWASP max = 1h)
**Fichier**: `backend/.env` L.27 — JWT_EXPIRY_HOURS=24. Pas de jti blacklist.
**Fix**: Passer à 1h + implémenter refresh token HttpOnly cookie + jti claim.

### SEC-B-005 🔴 CORS hardcodé sur le mauvais domaine
**Fichier**: `SecurityConfig.java` L.66 — Pattern "codebangers.com" au lieu de "noseumcode.fr"
**Fix**: Utiliser ${app.cors.allowed-origins} depuis les propriétés.

### SEC-B-006 🔴 AdminSeeder logue TOUS les utilisateurs (PII) à chaque démarrage
**Fichier**: `AdminSeeder.java` L.72-82 — emails + UUIDs dans les logs prod.
**Fix**: Supprimer ce bloc de logging ou le limiter au profil dev.

### SEC-B-007 🟡 Pas de rate limiting sur les endpoints d'auth
**Fix**: Bucket4j, max 5 tentatives/15 min par IP.

### SEC-B-008 🟡 Mot de passe minimum 6 chars (OWASP recommande 8+ avec complexité)
**Fichier**: `RegisterRequest.java` L.28 — @Size(min = 6)
**Fix**: min=8 + @Pattern validant maj/min/chiffre.

### SEC-B-009 🟡 JWT en URL fragment après OAuth2 (logs proxy, historique browser)
**Fichier**: `OAuth2AuthenticationSuccessHandler.java` L.42-48
**Fix**: Échange de code courte durée ou cookie HttpOnly.

### SEC-B-010 🟡 BCrypt 10 rounds par défaut (recommandé 12-13)
**Fichier**: `JwtConfig.java` L.52 — new BCryptPasswordEncoder()
**Fix**: new BCryptPasswordEncoder(13)

### SEC-B-011 🟡 @Valid manquant sur updateUser
**Fichier**: `UserController.java` L.52
**Fix**: Ajouter @Valid @RequestBody UserRequest request

### SEC-B-012 🟢 V006 seed SQL contient un hash BCrypt en dur (acceptable si ADMIN_PASSWORD changé)

---

## 2. SÉCURITÉ FRONTEND

### SEC-F-001 🔴 innerHTML avec données de schedule.json non sanitisées
**Fichier**: `header.js` L.614-620
**Fix**: Passer par escapeHtml() ou textContent.

### SEC-F-002 🟡 CSP avec 'unsafe-inline' scripts
**Fichier**: `.htaccess` L.71
**Fix**: Déplacer les scripts inline vers des fichiers .js. Utiliser des nonces CSP.

### SEC-F-003 🟡 normalizeRole() basé sur l'email hardcodé côté client
**Fichier**: `dashboard.js` L.41 — if (email === "admin@codebangers.fr") return "ADMIN"
**Fix**: Retirer. Se fier uniquement au claim JWT validé.

### SEC-F-004 🟡 Statuts de paiement dans localStorage (noseum_payments)
**Fichier**: `dashboard.js` L.1000-1004 — manipulable par XSS ou utilisateur.
**Fix**: Supprimer ce mécanisme. Source de vérité = backend uniquement.

### SEC-F-005 🟢 sanitizePartialHTML() ne supprime pas les event handlers inline (onclick, onerror)
**Fix**: Intégrer DOMPurify.

---

## 3. ACCESSIBILITÉ (WCAG 2.1 AA)

### A11Y-001 🟡 role="region" mal utilisé sur le notification dropdown
**Fichier**: `dashboard.html` L.62
**Fix**: Utiliser role="dialog" aria-modal="true" ou aria-live="polite".

### A11Y-002 🟡 Handlers d'événements onclick inline dans le HTML (incompatible CSP nonce)
**Fichier**: `dashboard.html` L.65 et multiples autres
**Fix**: Migrer vers addEventListener dans le JS.

### A11Y-003 🟢 aria-expanded manquant à l'état initial sur le bouton notifications
**Fix**: Ajouter aria-expanded="false" dans le HTML initial.

### A11Y-004 🟢 Skip link présent (bien). Vérifier que .skip-link:focus est visible en CSS.

### A11Y-005 🟢 alt sur les images de cours dynamiques : OK (escapeHtml(course.courseTitle))

---

## 4. QUALITÉ DU CODE & COMMENTAIRES

### CODE-001 🟡 Commentaires redondants / évidents
- `dashboard.js` L.527-528 : "// Load teacher chapters" dupliqué
- `dashboard.js` L.700 : "// Modification d'une section existante" (évident dans le else-if)
- `dashboard.js` L.732 : "// Création d'une nouvelle section" (évident dans le else)
- `header.js` L.75 : commentaire décrivant quelque chose visible 5 lignes plus haut
- `CustomOAuth2UserService.java` L.50 : "// Mettre à jour les informations si nécessaire" (évident)

### CODE-002 🟡 Double définition de logout() dans dashboard.js
**Fichier**: `dashboard.js` L.219 et L.1766 — identiques.
**Fix**: Garder L.219, supprimer L.1766.

### CODE-003 🟢 Commentaires de section (==== blocs) acceptables dans les gros fichiers JS.

### CODE-004 🟢 User.java : commentaires de section (Constructors, Getters) acceptables pour 251 lignes.

### CODE-005 🟢 PaymentController JavaDoc en français : cohérent avec le projet, utile. Garder.

---

## 5. POINTS POSITIFS

- escapeHtml() défini et utilisé systématiquement dans dashboard.js
- sanitizePartialHTML() sur les partials dynamiques
- application-prod.properties désactive SQL logs, security DEBUG, stacktraces client
- HSTS + X-Frame-Options + X-Content-Type-Options + Referrer-Policy + Permissions-Policy configurés
- @PreAuthorize sur tous les endpoints sensibles
- @Valid sur les DTOs register et login
- Soft delete avec audit trail
- SeedDataInitializer protégé par @Profile("dev")
- Skip link accessible en HTML
- prefersReducedMotion respecté dans script.js
- JWT secret null-checked dans JwtConfig (exception explicite)
- Messages d'erreur auth génériques (pas de user enumeration)
- @JsonProperty(access = WRITE_ONLY) sur le champ password

---

## 6. PLAN D'ACTION PRIORITAIRE

### BLOQUANT (avant déploiement)
1. SEC-B-002 — Révoquer Google Client Secret
2. SEC-B-001 — Supprimer fallback JWT secret
3. SEC-B-003 — Valider signature Stripe
4. SEC-B-005 — Corriger domaine CORS
5. SEC-B-006 — Supprimer log PII dans AdminSeeder
6. SEC-B-004 — JWT expiry → 1h

### SPRINT SUIVANT
7. SEC-B-007 — Rate limiting auth endpoints
8. SEC-B-008 — Politique mot de passe renforcée
9. SEC-F-003 — Retirer normalizeRole() côté client
10. SEC-F-004 — Supprimer noseum_payments localStorage
11. SEC-B-009 — OAuth2 callback sans URL fragment
12. SEC-F-002 — CSP sans unsafe-inline
13. SEC-B-011 — @Valid sur updateUser

### AMÉLIORATIONS
14. CODE-001 — Nettoyer commentaires redondants
15. SEC-F-005 — Intégrer DOMPurify
16. A11Y-001 — Corriger role="region" sur notifications
17. A11Y-003 — aria-expanded initial
18. CODE-002 — Dédupliquer logout()
