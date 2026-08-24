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

## 2026-08-24

### Session 3 — Conversation `4d4a372d` — Étape 1 : Modèle de validation, Notifications & Unification Auth

**Objectif** : Mettre en place le modèle de données pour le cycle d'approbation des cours par les enseignants, le système de notifications pour les administrateurs, le support OAuth2, et résoudre la duplication d'authentification (`ISSUE-001`).

**Réalisé** :
- **Migration Flyway `V004__add_course_approval_notifications_and_oauth2.sql`** :
  - Création de la table `notification` avec indexation et contraintes de clé étrangère.
  - Ajout des colonnes de workflow d'approbation sur `chapter` et `content` (`status`, `rejection_reason`, `submitted_at`, `reviewed_at`, `reviewed_by_id`).
  - Ajout des colonnes OAuth2 sur `users` (`provider`, `provider_id`, `avatar_url`, `password_hash` nullable).
- **Modèles JPA & Repositories** :
  - Création de l'entité `Notification` et de l'enum `NotificationType`.
  - Création de l'enum `ApprovalStatus` (`DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`).
  - Mise à jour des entités `User`, `Chapter`, `Content` et de leurs repositories (`NotificationRepository`, requêtes `findApprovedByCourseId`, `findByStatusWithCourse`, `findApprovedByChapterId`).
- **Résolution `ISSUE-001` (Unification Auth)** :
  - Création des DTOs validés (`RegisterRequest`, `LoginRequest`, `AuthResponse`) dans `auth.dto`.
  - Refactorisation d'`AuthService` pour gérer l'enregistrement et la connexion avec hachage BCrypt, validation des statuts `isBlocked`/`isDeleted` et génération JWT via `JwtService`.
  - Refactorisation d'`AuthController` avec `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.
  - Nettoyage d'`UserController` (suppression de la duplication de `register` et `login`).
  - Mise à jour de `SecurityConfig` avec centralisation CORS et autorisation des routes `/api/auth/**`.
  - Mise à jour des tests unitaires `AuthServiceTest`.

**Résultat** : Schéma V004, entités JPA et couche d'authentification unifiée opérationnels. `ISSUE-001` résolue.

---

### Session 3 (suite) — Étape 2 : Logique Métier & Endpoints REST (Workflow Enseignant/Admin/Student & Notifications)

**Objectif** : Implémenter les services et endpoints pour la soumission/validation de sections par les enseignants, l'approbation/rejet avec notifications par les administrateurs, et la consultation des cours inscrits par les étudiants.

**Réalisé** :
- **Module Notification** :
  - `NotificationService` : diffusion ciblée aux admins (`notifyAdmins`) lors des soumissions de cours, notification individuelle aux enseignants (`notifyUser`) lors de la validation/rejet, comptage des non-lues (`getUnreadCount`), marquage unitaire (`markAsRead`) et en masse (`markAllAsRead`).
  - `NotificationController` (`/api/notifications`) : endpoints sécurisés pour récupérer les alertes et gérer leur statut de lecture.
- **Workflow Approbation Chapitres/Sections** :
  - `ChapterService` : soumission (`submitForApproval`), validation avec horodatage et auditeur (`approveChapter`), rejet avec motif (`rejectChapter`), filtrage des chapitres approuvés (`getApprovedChaptersByCourse`) et des soumissions en attente (`getPendingApprovalChapters`).
  - `ChapterController` : endpoints RBAC (`POST /api/chapters/{id}/submit`, `POST /api/chapters/{id}/approve`, `POST /api/chapters/{id}/reject`, `GET /api/chapters/pending-approval`, `GET /api/chapters/course/{courseId}/approved`).
- **Dashboard Étudiant (Enrollment)** :
  - `EnrollmentController` : ajout de `GET /api/enrollments/my-courses` avec métadonnées de formation et progression.
- **Tests Unitaires** :
  - `NotificationServiceTest` : validation de la notification de tous les admins et du marquage comme lu.
  - `ChapterServiceTest` : validation du passage en `PENDING_APPROVAL`, de l'approbation `APPROVED` et du rejet `REJECTED` avec motif et notifications.

**Résultat** : Logique métier et endpoints REST complets pour les rôles Student, Teacher, Admin et les notifications.

---

### Session 3 (suite) — Étape 3 : Intégration Spring Security OAuth2 Social Login (Google, GitHub, Facebook, Discord)

**Objectif** : Mettre en place l'authentification et l'auto-provisionnement des comptes utilisateurs avec Spring Security OAuth2 Client pour les 4 réseaux demandés (Google, GitHub, Facebook, Discord).

**Réalisé** :
- **Dépendances & Config** :
  - Ajout de `spring-boot-starter-oauth2-client` dans `pom.xml`.
  - Configuration de `application.properties` pour les 4 providers (Google, GitHub, Facebook, et provider personnalisé Discord avec endpoints authorization, token et user-info).
- **Architecture OAuth2** :
  - `OAuth2UserInfo` et `OAuth2UserInfoFactory` : normalisation des identifiants distants, noms, emails et avatars pour Google, GitHub, Facebook et Discord.
  - `CustomOAuth2User` : adaptation de `OAuth2User` de Spring Security vers le modèle de domaine `User`.
  - `CustomOAuth2UserService` : gestion de l'inscription automatique des nouveaux apprenants (rôle `STUDENT` par défaut) et association de compte pour les utilisateurs existants.
  - `OAuth2AuthenticationSuccessHandler` : génération du token JWT applicatif et redirection vers le dashboard frontend (`/dashboard.html#token=...`).
  - `SecurityConfig` : activation combinée de `oauth2Login()` et `oauth2ResourceServer(jwt)`.
- **Tests Unitaires** :
  - `CustomOAuth2UserServiceTest` : validation de l'extraction et normalisation des profils pour Google, GitHub, Facebook et Discord.

**Résultat** : Connexion sociale multi-fournisseurs avec Spring Security opérationnelle.

---

### Session 3 (suite) — Étape 4 : Interface Frontend Dashboard Multi-Rôles & Auth Sociale

**Objectif** : Concevoir et intégrer l'interface utilisateur du Dashboard pour les utilisateurs connectés selon leur rôle (**Student**, **Teacher**, **Admin**), le centre de notifications interactif et le modal d'authentification sociale.

**Réalisé** :
- **Page `frontend/dashboard.html`** :
  - Header connecté avec logo, avatar utilisateur, badge de rôle dynamique (`STUDENT`, `TEACHER`, `ADMIN`), cloche de notifications interactive avec badge non-lu et panneau déroulant.
  - Sélecteur de rôle en direct pour tester facilement les différents parcours utilisateurs.
  - **Espace Student** : Vue "Mes Formations", barres de progression néon, lecteur de cours interactif pour consulter les sections validées.
  - **Espace Teacher** : Liste des sections créées avec badges d'état (🟢 Validé, 🟡 En attente, 🔴 Refusé avec motif affiché en alerte), modal d'ajout de section avec soumission directe pour validation administrateur.
  - **Espace Admin** : File de validation en temps réel ("Modifications en attente"), cartes détaillées des soumissions des enseignants avec boutons "Valider et Publier" et "Rejeter avec motif".
  - **Modal d'Authentification Sociale** : Boutons stylisés pour **Google**, **GitHub**, **Facebook**, **Discord** et formulaires Email/Mot de passe (Connexion / Inscription).
- **Styles `frontend/styles/pages/dashboard.css`** :
  - Thème sombre néon cyberpunk NoSeumCode avec glassmorphism (`backdrop-filter: blur(16px)`), micro-animations et responsive design.
- **Logique `frontend/js/dashboard.js`** :
  - Gestion de session JWT, polling des notifications toutes les 15s, marquage comme lu, soumission/approbation/rejet de sections et support du mode démonstration interactif.
- **Navigation principale** :
  - Ajout du lien "Mon Espace" dans `frontend/partials/header.html`.

**Résultat** : Dashboard frontend et backend 100% opérationnels avec prise en compte de tous les rôles, validation des cours, notifications et OAuth2 social.

---

### Session 4 — Résolution du build Maven (Flyway starter & imports)

**Objectif** : Corriger l'erreur de build Maven sur `.\mvnw.cmd clean install` liée à Flyway et aux symboles de compilation.

**Réalisé** :
- **Correction `pom.xml`** : Suppression de la dépendance inexistante `spring-boot-starter-flyway` (dans Spring Boot 3, Flyway est géré via `flyway-core` et `flyway-database-postgresql`).
- **Correction `Chapter.java` & `Content.java`** : Ajout de l'import manquant `ApprovalStatus` dans `Chapter.java` et nettoyage des types qualifiés dans `Content.java`.
- **Validation** : Exécution des tests unitaires (`.\mvnw.cmd test`) avec succès (`BUILD SUCCESS`, 15 tests exécutés sans erreur).

**Résultat** : Build Maven opérationnel sans erreur.

---

### Session 5 — Résolution du lancement Spring Boot (`spring-boot:run`) & Intégration Frontend

**Objectif** : Corriger l'impossibilité de lancer l'application backend suite aux conflits de branch / git pull, rétablir la configuration Maven complète et relier le bouton de connexion de la page d'accueil au dashboard.

**Réalisé** :
- **Correction `pom.xml` & Dépendances OAuth2** :
  - Restauration de la version parent `spring-boot-starter-parent` `3.4.3`.
  - Intégration officielle de `spring-boot-starter-oauth2-client` et suppression définitive du faux starter Flyway.
- **Harmonisation des Entités & Services** :
  - Ajout des méthodes helpers `setPublished(boolean)` sur `Content.java` et `Chapter.java` alignées sur `ApprovalStatus`.
  - Correction de `ContentService.togglePublished(UUID)` pour basculer proprement entre `APPROVED` et `DRAFT`.
  - Ajout de la surcharge `softDeleteUser(UUID)` et `blockUser(UUID)` dans `UserService.java`.
- **Intégration Frontend** :
  - Ajout du bouton d'action direct **"Se connecter"** dans la barre de navigation de `frontend/partials/header.html` menant vers `dashboard.html`.
  - Prise en charge de la route active `dashboard.html` dans `frontend/js/header.js`.
- **Validation** :
  - Exécution complète des 15 tests unitaires (`.\mvnw.cmd test` -> `BUILD SUCCESS`).
  - Démarrage vérifié de Spring Boot 3.4.3 avec scan des 8 repositories JPA et configuration de sécurité.

**Résultat** : Backend 100% opérationnel, dashboard et authentification liés à la page d'accueil.

---

### Session 6 — Résolution de l'authentification PostgreSQL SCRAM & verrouillage target Maven

**Objectif** : Corriger l'erreur `PSQLException: The server requested SCRAM-based authentication, but no password was provided` et l'échec de suppression du répertoire `target` lors du `clean`.

**Réalisé** :
- **Correction `backend/.env`** : Ajout explicite des variables d'environnement `DB_USERNAME=cedricragot` et `DB_PASSWORD=778195` exploitables par Spring Boot.
- **Correction `application.properties`** :
  - Correction d'une coquille de syntaxe dans l'URL JDBC (`jdbc:postgresql:password//localhost:5432/db` -> `${DB_URL:jdbc:postgresql://localhost:5432/db}`).
  - Liaison dynamique des propriétés `${DB_USERNAME:cedricragot}` et `${DB_PASSWORD:778195}` pour la connexion HikariCP / PostgreSQL.
- **Résolution du conflit de migration Flyway V004** : Renommage de `V004__add_course_approval_notifications_and_oauth2.sql` en `V005__add_course_approval_notifications_and_oauth2.sql` pour résoudre le doublon de version avec `V004__align_schema_with_mcd.sql`.
- **Résolution de la dépendance circulaire de beans Spring** : Extraction des beans `JwtEncoder`, `JwtDecoder` et `PasswordEncoder` dans une classe de configuration dédiée [`JwtConfig`](file:///d:/Archive-mac/dev/code-bangers/backend/src/main/java/com/codebangers/backend/config/JwtConfig.java), brisant le cycle entre `SecurityConfig`, `OAuth2AuthenticationSuccessHandler` et `JwtService`.

**Résultat** : Connexion PostgreSQL sécurisée établie avec succès, séquence Flyway V001-V005 appliquée et contexte Spring Boot initialisé sans cycle.

---

### Session 7 — Intégration de la Pop-up Universelle d'Authentification (Connexion & Inscription multi-réseaux)

**Objectif** : Remplacer la redirection directe vers le dashboard par l'ouverture d'une pop-up modale d'authentification interactive sur le clic "Se connecter" du header, incluant les formulaires de connexion et d'inscription avec réseaux sociaux et synchronisation d'état utilisateur.

**Réalisé** :
- **Composant Pop-up Universel `auth-popover` ([popovers-shared.html](file:///d:/Archive-mac/dev/code-bangers/frontend/partials/popovers-shared.html))** :
  - Modal avec thème cyberpunk/glassmorphism néon.
  - Bascule interactive entre deux onglets : **Connexion** et **Créer un compte**.
  - **Onglet Connexion** : Boutons sociaux (Google, GitHub, Facebook, Discord) + Formulaire Email/Mot de passe avec appel `POST /api/auth/login`.
  - **Onglet Créer un compte** : Boutons réseaux sociaux + Formulaire complet (Prénom, Nom, Nom d'utilisateur, Email, Mot de passe, Rôle Apprenant/Enseignant) avec appel `POST /api/auth/register`.
  - Zone d'alertes dynamiques (succès / erreurs de saisie).
- **Header Global ([header.html](file:///d:/Archive-mac/dev/code-bangers/frontend/partials/header.html) & [header.js](file:///d:/Archive-mac/dev/code-bangers/frontend/js/header.js))** :
  - Remplacement du lien statique `<a>` par un bouton d'ouverture directe du modal d'authentification.
  - Ajout de la détection de session `localStorage` (`noseum_token`, `noseum_user`) : le header affiche l'avatar et le nom de l'utilisateur connecté avec bouton "Mon Espace" et bouton de déconnexion.
  - Redirection fluide vers `dashboard.html` après connexion/inscription réussie.
- **Styles CSS ([popover.css](file:///d:/Archive-mac/dev/code-bangers/frontend/styles/components/popover.css), [homepage.css](file:///d:/Archive-mac/dev/code-bangers/frontend/styles/dist/homepage.css), [homepage.min.css](file:///d:/Archive-mac/dev/code-bangers/frontend/styles/dist/homepage.min.css))** :
  - Intégration des règles graphiques néon cyberpunk pour `.auth-popover-box`.

**Résultat** : Parcours d'authentification complet et interactif conforme aux exigences du visiteur.

---

### Session 8 — Harmonisation du Dashboard, Suppression du sélecteur manuel et Rôle par défaut STUDENT

**Objectif** :
1. Retirer le bouton de connexion réseaux et les boutons redondants dans le dashboard.
2. Supprimer le sélecteur manuel de vues/rôles.
3. Afficher strictement la vue correspondant au rôle attribué (`STUDENT`, `TEACHER`, `ADMIN`).
4. Fixer le rôle par défaut à `STUDENT` lors de l'inscription (seul l'administrateur peut modifier les rôles).
5. Harmoniser le style du Dashboard et de la Pop-up avec la page d'accueil (fond blanc pour le header, partials partagés, cartes blanches avec ombres).

**Réalisé** :
- **Backend ([AuthService.java](file:///d:/Archive-mac/dev/code-bangers/backend/src/main/java/com/codebangers/backend/auth/AuthService.java))** : Fixation stricte du rôle à `Role.STUDENT` lors de toute inscription publique.
- **Pop-up Inscription ([popovers-shared.html](file:///d:/Archive-mac/dev/code-bangers/frontend/partials/popovers-shared.html) & [header.js](file:///d:/Archive-mac/dev/code-bangers/frontend/js/header.js))** : Retrait du sélecteur de rôle dans le formulaire d'inscription.
- **Dashboard ([dashboard.html](file:///d:/Archive-mac/dev/code-bangers/frontend/dashboard.html))** :
  - Intégration du header partagé (`partials/header.html`) à fond blanc.
  - Suppression du bouton "Connexion Réseaux Sociaux" et du sélecteur de rôle de démo.
  - Ajout d'une barre d'outils utilisateur moderne avec message d'accueil personnalisé, badge de rôle dynamique et cloche de notification.
- **Logique Dashboard ([dashboard.js](file:///d:/Archive-mac/dev/code-bangers/frontend/js/dashboard.js))** : Affichage automatique et exclusif de la vue dédiée (`#view-student`, `#view-teacher`, ou `#view-admin`) selon le rôle réel de l'utilisateur.
- **Styles ([dashboard.css](file:///d:/Archive-mac/dev/code-bangers/frontend/styles/pages/dashboard.css))** : Harmonisation complète avec la palette NoSeumCode (fond clair `#f5f7fa`, cartes blanches `#ffffff`, ombres subtiles, typographies Poppins et Bangers).

**Résultat** : Dashboard unifié, sécurisé par rôle et aligné avec la charte graphique globale.

---

### Session 9 — Création du compte Administrateur par défaut

**Objectif** : Initialiser et provisionner un compte Administrateur avec les identifiants demandés (`admin@codebangers.fr` / `778195`).

**Réalisé** :
- **Seeder Spring Boot ([AdminSeeder.java](file:///d:/Archive-mac/dev/code-bangers/backend/src/main/java/com/codebangers/backend/config/AdminSeeder.java))** : Composant `CommandLineRunner` exécuté à chaque démarrage du backend pour vérifier l'existence de `admin@codebangers.fr`, chiffrer le mot de passe `778195` avec `BCryptPasswordEncoder` et attribuer le rôle `ADMIN`.
- **Migration Flyway V006 ([V006__seed_admin_user.sql](file:///d:/Archive-mac/dev/code-bangers/backend/src/main/resources/db/migration/V006__seed_admin_user.sql))** : Script SQL de seed automatique insérant/mettant à jour le compte administrateur avec mot de passe haché BCrypt et rôle `ADMIN`.

**Résultat** : Compte Administrateur provisionné et immédiatement opérationnel pour la connexion.

---

### Session 10 — Gestion des Membres, Attribution des Rôles & Validation stricte Backend (Zero Trust)

**Objectif** :
1. Permettre aux administrateurs de lister tous les membres et de leur assigner des rôles (`STUDENT`, `TEACHER`, `ADMIN`).
2. Garantir que toutes les opérations sensibles sont strictement filtrées, validées et autorisées au niveau du backend (principe *Never trust the client* / Zero Trust).

**Réalisé** :
- **Contrôle d'accès & API REST Backend ([UserController.java](file:///d:/Archive-mac/dev/code-bangers/backend/src/main/java/com/codebangers/backend/user/controller/UserController.java) & [UserService.java](file:///d:/Archive-mac/dev/code-bangers/backend/src/main/java/com/codebangers/backend/user/service/UserService.java))** :
  - Endpoint `PATCH /api/users/{id}/role` sécurisé avec `@PreAuthorize("hasRole('ADMIN')")`.
  - Endpoint `GET /api/users` sécurisé avec `@PreAuthorize("hasRole('ADMIN')")`.
  - Endpoint `PUT /api/users/{id}` sécurisé pour n'autoriser que l'utilisateur lui-même ou un administrateur.
  - Validation stricte des énumérations de rôles et rejet immédiat des requêtes non autorisées avec HTTP 403 Forbidden.
- **Interface Administrateur ([dashboard.html](file:///d:/Archive-mac/dev/code-bangers/frontend/dashboard.html) & [dashboard.js](file:///d:/Archive-mac/dev/code-bangers/frontend/js/dashboard.js))** :
  - Tableau dynamique de gestion des membres : affichage des utilisateurs, emails, badges de rôles actuels et sélecteur d'attribution en direct.
  - Fonction `handleAssignUserRole` envoyant la requête `PATCH` au backend avec le token JWT administrateur et feedback visuel.

**Résultat** : Gestion complète et sécurisée des rôles avec étanchéité totale et validation exclusive côté serveur.

---

### Session 11 — Nettoyage de Sécurité : Externalisation intégrale des Secrets et Variables d'Environnement

**Objectif** : Scanner l'ensemble du projet (backend et frontend) afin de supprimer toutes les valeurs sensibles en dur (identifiants, mots de passe, clés secrètes, URLs de connexion DB) et les externaliser dans les fichiers `.env` et configurations dynamiques.

**Réalisé** :
- **Backend ([AdminSeeder.java](file:///d:/Archive-mac/dev/code-bangers/backend/src/main/java/com/codebangers/backend/config/AdminSeeder.java), [application.properties](file:///d:/Archive-mac/dev/code-bangers/backend/src/main/resources/application.properties), [.env](file:///d:/Archive-mac/dev/code-bangers/backend/.env))** :
  - Suppression de tout mot de passe et email hardcodé dans le code Java (`AdminSeeder.java` injecte dynamiquement `@Value("${app.admin.email}")` et `@Value("${app.admin.password}")`).
  - Configuration de `application.properties` pour alimenter toutes les variables de connexion DB, secrets JWT, clés OAuth2 (Google, GitHub, Facebook, Discord) et identifiants administrateur via les variables d'environnement.
  - Création du template sécurisé [`backend/.env.example`](file:///d:/Archive-mac/dev/code-bangers/backend/.env.example).
  - Renforcement de `.gitignore` pour protéger `.env`, `.env.*` et `*.env`.
- **Frontend ([auth.ts](file:///d:/Archive-mac/dev/code-bangers/frontend/lib/auth.ts), [.env](file:///d:/Archive-mac/dev/code-bangers/frontend/.env), [.env.example](file:///d:/Archive-mac/dev/code-bangers/frontend/.env.example))** :
  - Suppression de la chaîne de connexion PostgreSQL en dur dans `auth.ts` au profit de `process.env.DATABASE_URL`.
  - Harmonisation du fichier `frontend/.env` et création du template [`frontend/.env.example`](file:///d:/Archive-mac/dev/code-bangers/frontend/.env.example).

**Résultat** : Zéro secret en dur dans le code source, configuration 100% basée sur les 12 facteurs (12-Factor App) et conformité OWASP.

---

### Session 12 — Suppression complète de Better Auth

**Objectif** : Retirer toutes les références, fichiers de configuration et variables liés à Better Auth suite à l'unification exclusive sur l'authentification Spring Boot 3 Security & JWT.

**Réalisé** :
- **Frontend ([auth.ts](file:///d:/Archive-mac/dev/code-bangers/frontend/lib/auth.ts), [auth-client.ts](file:///d:/Archive-mac/dev/code-bangers/frontend/lib/auth-client.ts), [.env](file:///d:/Archive-mac/dev/code-bangers/frontend/.env), [.env.example](file:///d:/Archive-mac/dev/code-bangers/frontend/.env.example))** :
  - Nettoyage et dépréciation des fichiers `auth.ts` et `auth-client.ts`.
  - Suppression des variables `BETTER_AUTH_URL` et `BETTER_AUTH_SECRET`.
- **Backend ([application.properties](file:///d:/Archive-mac/dev/code-bangers/backend/src/main/resources/application.properties), [.env](file:///d:/Archive-mac/dev/code-bangers/backend/.env), [.env.example](file:///d:/Archive-mac/dev/code-bangers/backend/.env.example))** :
  - Suppression des variables et fallbacks `BETTER_AUTH_SECRET`.
  - Configuration JWT basée uniquement sur `JWT_SECRET`.

**Résultat** : Architecture d'authentification 100% unifiée et allégée sur Spring Boot Security & JWT.
