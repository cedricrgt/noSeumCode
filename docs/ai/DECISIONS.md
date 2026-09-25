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

## ADR-009 — Workflow de Développement Agentique & Protection de la branche develop
**Status**: Actif
**Décision**: Les agents autonomes opèrent exclusivement sur des branches dédiées (`feat/*`, `fix/*`, `task/*`), exécutent le cycle itératif de développement et de tests, mettent à jour la mémoire projet (`docs/ai/`), puis ouvrent une Pull Request (PR) comparant la branche de travail à `develop`. Cedric valide et fusionne manuellement la PR.
**Alternative rejetée**: Push direct des agents sur la branche `develop` — formellement rejetée car `.github/workflows/deploy.yml` déclenche automatiquement un déploiement SSH en production sur la VM Oracle Cloud à chaque push sur `develop`.
**Conséquence**: Préservation totale de l'environnement de production, isolation des développements, possibilité de prévisualisation via GitHub Pages (`pr-preview.yml`), et contrôle humain final sur les fusions.

## ADR-010 — Architecture Stripe Checkout & Pattern Ports/Adapters
**Status**: Actif
**Décision**: Encapsuler les appels de l'API Stripe derrière un port `StripeGateway` et son adaptateur `StripeGatewayImpl`. Utiliser `com.stripe.net.RequestOptions` pour injecter la clé secrète de manière thread-safe sans dépendre du singleton statique mutable `Stripe.apiKey`.
**Alternative rejetée**: Appels directs à `com.stripe.model.checkout.Session.create(...)` dans `PaymentService` ou `PaymentController` — rejetée car rendrait les tests unitaires dépendants du réseau externe Stripe et introduirait des risques de concurrence.
**Conséquence**: Testabilité unitaire 100% déterministe avec mocks, robustesse face aux pannes réseau externes, et découplage strict entre la couche métier Spring Boot et le SDK Stripe.

## ADR-011 — Rotation de Refresh Token & Jeton de Réinitialisation par Hachage Cryptographique
**Status**: Actif
**Décision**: Stocker les jetons de rafraîchissement (Refresh Tokens) et les jetons de réinitialisation de mot de passe (Password Reset Tokens) sous forme de condensat SHA-256 (`token_hash`) dans PostgreSQL, tout en ne transmettant le jeton brut qu'au client final. Appliquer la rotation systématique des refresh tokens (Refresh Token Rotation - RTR) à chaque renouvellement d'access token, et révoquer l'ensemble des sessions actives en cas de réinitialisation de mot de passe ou de détection de rejeu.
**Alternative rejetée**: Stockage en clair des tokens en base de données — rejetée car une fuite ou un dump de la base compromettrait l'ensemble des sessions actives et permettrait la prise de contrôle non autorisée des comptes.
**Conséquence**: Protection optimale contre le vol de sessions (OWASP ASVS), détection immédiate de réutilisation de refresh tokens, et persistance sécurisée de la session utilisateur sur 7 jours.



