# Known Issues — NoSeumCode

> Problèmes identifiés, fausses hypothèses à ne pas répéter, et pièges connus.
> Ce fichier empêche l'agent de refaire les mêmes erreurs d'une session à l'autre.

---

## Problèmes résolus

### ISSUE-001 — Double système d'authentification

**Sévérité** : 🔴 Critique
**Identifié le** : 2026-08-05 (conversations `3538bba0` et `d9e3329b`)
**Résolu le** : 2026-08-24 (conversation `4d4a372d`)

**Solution appliquée** :
- Consolidation du système d'authentification dans le package `com.codebangers.backend.auth`.
- Création de `RegisterRequest`, `LoginRequest`, `AuthResponse` unifiés avec Bean Validation.
- `AuthService` utilise le `JwtService` standard (`config/JwtService`), vérifie les statuts `isBlocked` et `isDeleted`, et chiffre les mots de passe avec `PasswordEncoder` (BCrypt).
- Nettoyage d'`UserController` pour supprimer les méthodes dupliquées `register` et `login`.
- Endpoints publics `/api/auth/register` et `/api/auth/login` autorisés dans `SecurityConfig`.

---

## Problèmes ouverts

### ISSUE-002 — Seed data en production

**Sévérité** : 🔴 Critique
**Identifié le** : 2026-08-05

**Description** :
`SeedDataInitializer` (fichier `config/SeedDataInitializer.java`) :
- S'exécute sur `@EventListener(ApplicationReadyEvent.class)` — **sans restriction de profil Spring**
- Contient des mots de passe en clair : `admin123`, `teacher123`, `student123`, `778195Cedric`
- Crée un user admin avec un mot de passe réel visible dans le code source

**Action requise** : Ajouter `@Profile("dev")` et externaliser les credentials.

---

### ISSUE-003 — CORS wildcard

**Sévérité** : 🟡 Important
**Identifié le** : 2026-08-05

**Description** :
Tous les contrôleurs utilisent `@CrossOrigin(origins = "*")` au niveau classe. Cela ouvre l'API à tout domaine.

**Action requise** : Configurer CORS de manière centralisée dans `SecurityConfig` avec les origines autorisées.

---

### ISSUE-004 — Incohérence de packaging Chapter/Content

**Sévérité** : 🟡 Important
**Identifié le** : 2026-08-05

**Description** :
- `Chapter` entity et repository sont dans `chapter/` (package indépendant)
- `Content` entity et repository sont dans `content/` (package indépendant)
- Mais leurs controllers et services sont dans `course/controller/` et `course/service/`

Cela casse le principe de cohésion par feature.

**Action requise** : Soit tout regrouper dans `course/`, soit donner à Chapter et Content leurs propres controllers/services dans leurs packages respectifs.

---

### ISSUE-005 — Couverture de tests insuffisante

**Sévérité** : 🟡 Important
**Identifié le** : 2026-08-05

**Description** :
4 fichiers de test seulement :
- `BackendApplicationTests.java` — smoke test
- `AuthServiceTest.java` — auth uniquement
- `SeedDataInitializerTest.java` — seed
- `DomainModelTest.java` — modèle

Aucun test pour : contrôleurs, services Course/Workshop/Enrollment/Chapter/Content, repositories custom.

---

## Fausses hypothèses à NE PAS refaire

> L'agent a parfois fait ou pourrait faire ces suppositions incorrectes.
> Ce bloc sert de garde-fou.

### ❌ "Le projet utilise OAuth2 avec un Authorization Server"
**Réalité** : JWT HS256 custom, signé avec un secret partagé. Pas d'Authorization Server externe. Le starter `oauth2-resource-server` est utilisé uniquement pour la validation JWT côté resource server.

### ❌ "MongoDB est disponible"
**Réalité** : PostgreSQL uniquement. Pas de base NoSQL.

### ❌ "Le projet utilise Kubernetes"
**Réalité** : Pas de configuration K8s ni Docker Compose détectée. Infrastructure non définie.

### ❌ "Lombok est disponible"
**Réalité** : Pas de Lombok dans le `pom.xml`. Les entités utilisent des getters/setters manuels.

### ❌ "Le role TEACHER est dans les use cases"
**Réalité** : L'enum `Role` contient `TEACHER` et le use case diagram inclut un acteur `Teacher`, mais les permissions `@PreAuthorize` existantes n'ont été testées qu'avec `ADMIN`. Vérifier le comportement réel.

### ❌ "La commande Maven est `spring:run` ou `spring-boot-starter-flyway` existe"
**Réalité** : Le plugin Spring Boot s'exécute avec `.\mvnw.cmd spring-boot:run` (et non `spring:run`). De plus, `spring-boot-starter-flyway` n'existe pas dans Spring Boot 3 : utiliser directement `flyway-core` et `flyway-database-postgresql`.
