# Decisions — NoSeumCode

> Chaque décision architecturale est numérotée (ADR-XXX).
> Les décisions rejetées sont aussi documentées pour éviter de les reproposer.

---

## ADR-001 — Architecture en couches par feature

| | |
|---|---|
| **Date** | 2026-08-05 |
| **Statut** | ✅ Adoptée |
| **Contexte** | Le backend suit un pattern Controller → Service → Repository organisé par domaine fonctionnel (user/, course/, workshop/). |
| **Décision** | Conserver l'architecture en couches par feature. Ne pas migrer vers une architecture hexagonale. |
| **Raison** | Le projet est en phase de construction. Une migration hexagonale introduirait de la complexité inutile sans bénéfice immédiat. Le pattern actuel est fonctionnel et compris par l'équipe. |
| **Alternative rejetée** | Migration complète vers Hexagonal / Clean Architecture — trop de blast radius, risque disproportionné. |

---

## ADR-002 — JWT HS256 avec secret partagé

| | |
|---|---|
| **Date** | 2026-08-05 |
| **Statut** | ✅ Adoptée (temporaire) |
| **Contexte** | L'authentification utilise JWT signé en HMAC-SHA256 avec un secret partagé (`BETTER_AUTH_SECRET`). |
| **Décision** | Garder JWT HS256 pour le moment. |
| **Raison** | Fonctionnel, simple à implémenter. Suffisant pour la phase actuelle. |
| **Évolution prévue** | Migrer vers RS256 (clé asymétrique) quand un auth server externe sera nécessaire. |

---

## ADR-003 — Flyway comme gestionnaire de migrations

| | |
|---|---|
| **Date** | 2026-08-05 |
| **Statut** | ✅ Adoptée |
| **Contexte** | Le schéma PostgreSQL est géré par Flyway avec `ddl-auto=validate`. |
| **Décision** | Toute modification de schéma passe par un script SQL Flyway versionné. |
| **Raison** | Reproductibilité, traçabilité, compatibilité avec les déploiements CI/CD. |

---

## ADR-004 — Soft delete systématique

| | |
|---|---|
| **Date** | 2026-08-05 |
| **Statut** | ✅ Adoptée |
| **Contexte** | Les entités principales (User, Course, Workshop, Chapter, Content) utilisent un flag `is_deleted` + `deleted_at` au lieu de suppression physique. |
| **Décision** | Maintenir le soft delete comme pattern de suppression par défaut. |
| **Raison** | Traçabilité, possibilité de restauration, audit. |
| **Note** | Enrollment et UserWorkshop n'ont pas de soft delete — c'est voulu car ce sont des tables d'association. |

---

## ADR-005 — Système de mémoire projet (`docs/ai/`)

| | |
|---|---|
| **Date** | 2026-08-05 |
| **Statut** | ✅ Adoptée |
| **Contexte** | Les conversations avec l'agent IA se perdent quand on change de session. Le contexte projet, les décisions et les erreurs passées ne sont pas persistés. |
| **Décision** | Créer un dossier `docs/ai/` avec 4 fichiers de mémoire (PROJECT_CONTEXT, DECISIONS, KNOWN_ISSUES, CHANGELOG) et une règle AGENTS.md pour les charger automatiquement. |
| **Raison** | Réduire le coût en tokens, éviter de répéter les mêmes erreurs, garder une continuité entre les sessions. |
| **Alternative rejetée** | Mettre tout dans le GEMINI.md global — trop lourd, pollue les autres projets. |
