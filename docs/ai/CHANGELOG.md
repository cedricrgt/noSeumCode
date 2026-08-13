# Changelog — NoSeumCode

> Journal chronologique des sessions IA et des changements appliqués.
> Chaque entrée inclut : date, conversation, ce qui a été fait, résultat.

---

## 2026-08-05

### Session 1 — Conversation `3538bba0`

**Objectif** : Analyse de l'architecture backend

**Réalisé** :
- Exploration complète des 56 fichiers Java
- Identification du double système d'authentification (ISSUE-001)
- Identification des credentials hardcodés dans SeedDataInitializer (ISSUE-002)
- Création d'un rapport d'analyse architecturale

**Résultat** : Rapport créé dans les artifacts de la conversation. Aucune modification de code.

**Problèmes de session** :
- La conversation est devenue longue avec beaucoup de contexte accumulé
- L'utilisateur a identifié que l'analyse était moins profonde sans CodeGraph (exploration manuelle fichier par fichier)

---

### Session 2 — Conversation `d9e3329b`

**Objectif** : Ré-analyse backend + mise en place du système de mémoire projet

**Réalisé** :
- Nouvelle analyse backend complète (validation des findings de la session 1)
- Confirmation des 5 issues identifiées (ISSUE-001 à ISSUE-005)
- Vérification de l'alignement avec les diagrammes d'architecture (ERD, use cases)
- Création du système de mémoire projet (`docs/ai/`) :
  - `PROJECT_CONTEXT.md` — contexte et stack
  - `DECISIONS.md` — 5 ADRs documentées
  - `KNOWN_ISSUES.md` — 5 issues + fausses hypothèses à éviter
  - `CHANGELOG.md` — ce fichier
  - `.agents/AGENTS.md` — règle pour charger la mémoire en début de session

**Résultat** : Système de mémoire projet opérationnel.

**Aucune modification de code source** effectuée dans cette session.

---

## 2026-08-13

### Session 3 — Conversation `e1ee8484`

**Objectif** : Complétion du backend — workflow `/business-and-api`

**Réalisé** :
- **Phase 1 — Services** :
  - Création de 3 exceptions custom : `ResourceNotFoundException` (404), `DuplicateResourceException` (409), `AccountStatusException` (403)
  - Création de `ApiError` pour format de réponse d'erreur standardisé
  - Migration de tous les services vers les exceptions custom (remplacement des `IllegalArgumentException`)
  - Ajout audit trail `createdBy`/`updatedBy`/`deletedBy` sur CourseService, ChapterService, ContentService, WorkshopService
  - Ajout `togglePublished()` sur ChapterService et ContentService
  - Filtrage soft-deleted users dans `UserService.getAllUsers()`

- **Phase 2 — API/Security** :
  - CORS centralisé dans `SecurityConfig` avec origines configurables (ISSUE-003 résolu)
  - Suppression de `@CrossOrigin(origins = "*")` sur 5 controllers
  - Suppression des try/catch dans 7 controllers — les exceptions remontent au `GlobalExceptionHandler`
  - Ajout `@Valid` + JSR-380 sur tous les DTOs entrants (CourseRequest, ChapterRequest, ContentRequest, WorkshopRequest)
  - Ajout `@PreAuthorize` sur tous les endpoints de gestion (Chapter, Content, Workshop write ops, User block/unblock)
  - Extraction de l'utilisateur JWT (`@AuthenticationPrincipal Jwt`) pour l'audit trail
  - Fix bug `UserWorkshopController.getRegistration(id, id)` — supprimé et remplacé par `/me` endpoint
  - Ajout endpoints `/me` sur EnrollmentController et UserWorkshopController
  - `SeedDataInitializer` : ajout `@Profile("dev")` + sanitisation des passwords (ISSUE-002 résolu)
  - `application.properties` : ajout `app.cors.allowed-origins` + `spring.profiles.active=dev`

**Résultat** : Backend compilé avec succès. 4 fichiers créés, 18 fichiers modifiés. Issues ISSUE-002 et ISSUE-003 résolues.
