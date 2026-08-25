# Project Context — NoSeumCode

> **Dernière mise à jour** : 2026-08-24
> **Mis à jour par** : Conversation `4d4a372d` (Étape 1 : Modèle validation, Notifications & Unification Auth)

---

## Stack technique

### Backend
- **Framework** : Spring Boot 3.4.3
- **Langage** : Java 21
- **Base de données** : PostgreSQL (locale, port 5432, base `db`)
- **ORM** : Spring Data JPA / Hibernate
- **Migrations** : Flyway (6 migrations : V001, V002, V003, V004, V005, V006)
- **Sécurité** : Spring Security + OAuth2 Resource Server (JWT HS256) + OAuth2 Client
- **Hashing** : BCrypt
- **Build** : Maven
- **Sérialisation** : Jackson
- **Crypto** : BouncyCastle (bcprov-jdk18on 1.80)

### Frontend
- HTML5 / CSS3 / Vanilla JS moderne avec composants modulaires

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

| Package | Contenu | Rôle |
|---|---|---|
| `auth/` | AuthController, AuthService, DTOs (RegisterRequest, LoginRequest, AuthResponse) | Authentification unifiée & profil utilisateur |
| `chapter/` | Chapter entity, ChapterRepository | Chapitres et sections de cours avec statut d'approbation |
| `config/` | SecurityConfig, GlobalExceptionHandler, JwtService, SeedDataInitializer | Configuration de sécurité, JWT, CORS |
| `content/` | Content entity, ContentRepository | Blocs de contenu avec statut d'approbation |
| `course/` | Course + Enrollment entities, controllers, services, DTOs | Cours, inscriptions et progression |
| `notification/` | Notification entity, NotificationRepository | Système d'alertes asynchrones et validation |
| `user/` | User entity, Role enum, controller, service, DTOs | Gestion des utilisateurs et rôles |
| `workshop/` | Workshop + UserWorkshop entities, controllers, services, DTOs | Événements et ateliers |

### Entités JPA (8)

| Entité | Table | PK | Soft Delete | Description |
|---|---|---|---|---|
| User | `users` | UUID | ✅ (`is_deleted`, `deleted_at`, `deleted_by`) | Comptes utilisateurs, rôles, support OAuth2 |
| Course | `course` | UUID | ✅ | Formations et cours |
| Chapter | `chapter` | UUID | ✅ (via `deleted_at`) | Chapitres/sections avec cycle `status` (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED) |
| Content | `content` | UUID | ✅ (via `deleted_at`) | Contenus (vidéo, texte, code...) avec cycle `status` |
| Enrollment | `enrollment` | UUID | ❌ | Inscriptions des étudiants et suivi de progression |
| Workshop | `workshop` | UUID | ✅ | Ateliers pratiques |
| UserWorkshop | `user_workshop` | UUID | ❌ | Inscriptions aux ateliers |
| Notification | `notification` | UUID | ❌ | Notifications in-app (soumissions, validations, rejets) |

### Rôles
Enum `Role` : `USER`, `STUDENT`, `TEACHER`, `ADMIN`

### Endpoints REST publics
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/courses`, `GET /api/courses/{id}`
- `GET /api/workshops`, `GET /api/workshops/upcoming`, `GET /api/workshops/ongoing`, `GET /api/workshops/{id}`

### Endpoints protégés (JWT requis)
- `GET /api/auth/me`
- Tout `/api/**` non listé ci-dessus
- RBAC via `@PreAuthorize` (ADMIN pour gestion users et validation, TEACHER/ADMIN pour gestion cours, STUDENT pour cours inscrits)

---

## État actuel du projet

### Backend
- ✅ Modèle de données complet (8 entités JPA, migration Flyway V004 idempotente)
- ✅ Cycle d'approbation (`ApprovalStatus`) et entité `Notification` intégrés
- ✅ Authentification unifiée et sécurisée (`AuthService` + BCrypt + validation JSR-380)
- ✅ ISSUE-001 résolue (suppression de la duplication de login/register)
- ✅ Centralisation CORS dans `SecurityConfig`
- ✅ Workflow de validation de cours pour enseignants et administrateurs avec notifications
- ✅ Intégration Spring Security OAuth2 Social Login (Google, GitHub, Facebook, Discord) avec token JWT
- ✅ Tests unitaires (`AuthServiceTest`, `NotificationServiceTest`, `ChapterServiceTest`, `CustomOAuth2UserServiceTest`)

### Frontend
- ✅ HTML5 / CSS3 / Vanilla JS moderne avec composants modulaires et bundle system
- ✅ Page `dashboard.html` avec navigation par rôles (Student, Teacher, Admin)
- ✅ Centre de notifications interactif avec badge de non-lus et marquage à la volée
- ✅ Modal de connexion multi-réseaux (Google, GitHub, Facebook, Discord) et Email/Password
- ✅ Interface de soumission pour formateurs et file d'attente d'approbation pour administrateurs
- ✅ Page `cours.html` avec lecteur dynamique connecté à l'API Spring Boot et filtrage d'accès
- ✅ Conformité WCAG 2.2 AA (skip-links, :focus-visible, modales accessibles, ratios de contraste, labels liés)
- ✅ SEO Technique 100% (URLs canoniques, OpenGraph, Twitter Cards, Schema.org JSON-LD, `robots.txt`, `sitemap.xml`)
- ✅ Respect du mouvement utilisateur (`prefers-reduced-motion: reduce`, rAF throttling)
- ✅ Optimisation CWV (dimensions d'images explicites, `loading="lazy"`, scroll listeners passifs)

### Documentation
- `docs/architecture/erd.puml` — Diagramme ERD (7 entités initiales)
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
