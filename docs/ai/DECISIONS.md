# DECISIONS.md — NoSeumCode

_Last updated: 2026-09-16 | Conversation: e0c9f398-8522-470e-9df1-e11344331037_

---

## ADR-001 — JWT HS256 via Spring OAuth2 Resource Server
**Status**: Actif
**Décision**: Utiliser `NimbusJwtDecoder.withSecretKey()` avec `MacAlgorithm.HS256`.
**Alternative rejetée**: RS256 (asymétrique) — plus sécurisé mais complexité de gestion de paires de clés non justifiée pour un monolithe.
**Conséquence**: Le secret doit être fort (256 bits min) et géré via les secrets du serveur.

## ADR-002 — Stateless session (STATELESS)
**Status**: Actif
**Décision**: `SessionCreationPolicy.STATELESS` — aucune session HTTP côté serveur.
**Alternative rejetée**: Sessions Spring Security avec CSRF — complexifie le scale-out.
**Conséquence**: Pas de révocation de token facile. Nécessite une blacklist `jti` pour la sécurité complète.

## ADR-003 — OAuth2 callback JWT en URL fragment
**Status**: Actif mais **à reconsidérer** (voir ISSUE-009)
**Décision**: Après OAuth2 success, JWT envoyé en fragment URL `#token=...`.
**Alternative rejetée**: Cookie HttpOnly — complexité CORS avec le frontend statique.
**Conséquence**: JWT exposé dans l'historique navigateur. Risque si proxy logging activé.

## ADR-004 — Frontend Vanilla JS (pas de framework)
**Status**: Actif
**Décision**: HTML/CSS/JS pur, sans React/Vue/Angular.
**Alternative rejetée**: Next.js — overhead pour un MVP, hébergement Apache statique souhaité.
**Conséquence**: Gestion manuelle du DOM, risques XSS plus élevés sans sanitisation systématique.

## ADR-005 — CSRF désactivé (API stateless)
**Status**: Actif
**Décision**: `csrf.disable()` car API REST consommée uniquement par JWT Bearer.
**Alternative rejetée**: CSRF avec cookie SameSite — incompatible avec le flow OAuth2 actuel.
**Conséquence**: Acceptable pour les endpoints REST, mais le state OAuth2 doit être vérifié côté client.

## ADR-006 — Soft delete sur les utilisateurs
**Status**: Actif
**Décision**: Champ `is_deleted` + `deleted_at` au lieu d'un DELETE physique.
**Alternative rejetée**: DELETE physique — perd l'audit trail et les données pour les analytics.

## ADR-007 — BCryptPasswordEncoder (pas de rounds configurés)
**Status**: Actif mais à améliorer
**Décision**: `new BCryptPasswordEncoder()` — utilise le strength par défaut (10 rounds).
**Alternative rejetée**: Argon2 — non disponible nativement dans Spring Security 6 sans dépendance externe.
**Conséquence**: 10 rounds est acceptable mais OWASP recommande 12+ pour BCrypt.

## ADR-008 — SeedDataInitializer protégé par @Profile("dev")
**Status**: Actif — décision correcte
**Décision**: Données de test uniquement en profil `dev`.
**Alternative rejetée**: Scripts SQL manuels — plus d'effort de maintenance.
