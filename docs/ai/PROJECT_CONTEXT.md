# Project Context — NoSeumCode

> **Dernière mise à jour** : 2026-08-05
> **Mis à jour par** : Conversation `d9e3329b` (analyse architecture backend)

---

## Stack technique

### Backend
- **Framework** : Spring Boot 4.1.0
- **Langage** : Java 21
- **Base de données** : PostgreSQL (locale, port 5432, base `db`)
- **ORM** : Spring Data JPA / Hibernate
- **Migrations** : Flyway (3 migrations : V001, V002, V003)
- **Sécurité** : Spring Security + OAuth2 Resource Server (JWT HS256, secret partagé via `BETTER_AUTH_SECRET`)
- **Hashing** : BCrypt
- **Build** : Maven
- **Sérialisation** : Jackson
- **Crypto** : BouncyCastle (bcprov-jdk18on 1.80)

### Frontend
- Existe dans `frontend/` — non encore analysé en détail

### Infrastructure
- Non configurée (pas de Docker Compose, pas de CI/CD détecté)

---

## Architecture backend

### Pattern
Architecture en couches par feature (Layered by Feature) :
```
Controller → Service → Repository → PostgreSQL
```

### Package racine
`com.codebangers.backend`

### Packages fonctionnels

| Package | Contenu | Fichiers |
|---|---|---|
| `auth/` | AuthController, AuthService, JwtTokenService, DTOs | 5 |
| `chapter/` | Chapter entity + repository (⚠️ controller/service dans `course/`) | 2 |
| `config/` | SecurityConfig, GlobalExceptionHandler, JwtService, SeedDataInitializer | 4 |
| `content/` | Content entity + repository (⚠️ controller/service dans `course/`) | 2 |
| `course/` | Course + Enrollment entities, controllers, services, DTOs | 14 |
| `user/` | User entity, Role enum, controller, service, DTOs | 9 |
| `workshop/` | Workshop + UserWorkshop entities, controllers, services, DTOs | 10 |

**Total** : 56 fichiers Java

### Entités JPA (7)

| Entité | Table | PK | Soft Delete |
|---|---|---|---|
| User | `users` | UUID | ✅ (`is_deleted`, `deleted_at`, `deleted_by`) |
| Course | `course` | UUID | ✅ |
| Chapter | `chapter` | UUID | ✅ (via `deleted_at`) |
| Content | `content` | UUID | ✅ (via `deleted_at`) |
| Enrollment | `enrollment` | UUID | ❌ |
| Workshop | `workshop` | UUID | ✅ |
| UserWorkshop | `user_workshop` | UUID | ❌ |

### Rôles
Enum `Role` : `USER`, `STUDENT`, `TEACHER`, `ADMIN`

### Endpoints REST publics
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/courses`, `GET /api/courses/{id}`
- `GET /api/workshops`, `GET /api/workshops/upcoming`, `GET /api/workshops/ongoing`, `GET /api/workshops/{id}`

### Endpoints protégés (JWT requis)
- Tout `/api/**` non listé ci-dessus
- RBAC via `@PreAuthorize` (ADMIN pour gestion users, TEACHER/ADMIN pour gestion courses)

---

## État actuel du projet

### Backend
- ✅ Modèle de données complet (7 entités alignées avec ERD)
- ✅ CRUD fonctionnel sur User, Course, Chapter, Content, Enrollment, Workshop
- ✅ Authentification JWT HS256 fonctionnelle
- ✅ Migrations Flyway idempotentes
- ⚠️ Double système d'authentification (voir KNOWN_ISSUES)
- ⚠️ Seed data s'exécute en production (voir KNOWN_ISSUES)
- ⚠️ Couverture de tests très faible (4 fichiers)
- ⚠️ Pas de pagination sur les endpoints de liste
- ⚠️ Pas de validation Jakarta Bean Validation (`@Valid`)

### Frontend
- Non analysé

### Documentation
- `docs/architecture/erd.puml` — Diagramme ERD (7 entités)
- `docs/architecture/usecase.puml` — 9 use cases, 4 acteurs
- `docs/architecture/mcd.webp` — MCD Merise
- `docs/architecture/DataDictionnary.pdf` — Dictionnaire de données
- `conception/` — Fichiers Excalidraw, DataDictionnary.odt

---

## Contraintes connues

- UUID obligatoire partout (pas d'auto-increment)
- Injection par constructeur uniquement (pas de `@Autowired` sur champs)
- Flyway obligatoire pour les migrations (pas de `ddl-auto=create`)
- Architecture en couches existante — pas de migration vers hexagonal prévue
- Soft delete comme pattern de suppression (sauf Enrollment et UserWorkshop)
