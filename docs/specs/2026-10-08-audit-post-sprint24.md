# Cahier des Charges - Post-Audit Sprint 24 (08 Octobre 2026)

L'architecture métier de NoSeumCode a franchi un cap majeur (découpage du paiement, base de données de l'idempotence, CI/CD). L'objectif exclusif des sprints 25 et 26 est la **sécurité des flux métiers (P0)**, notamment contre les usurpations (IDOR, vols de session Stripe), ainsi que le raccordement de la table d'idempotence Stripe.

L'agent de développement doit se conformer strictement à ces spécifications lors de la modification du code.

---

## 🔴 P0 - Urgences de Sécurité Métier (À corriger avant mise en production)

### 1. Faille de Sécurité `confirm-session` (Usurpation Stripe)
Dans le `CheckoutController` ou service gérant le GET `/api/payments/confirm-session?session_id=...`, l'application vérifie le statut du paiement, mais **ne vérifie pas à qui il appartient**.
- **Correction exigée** : Extraire `session.metadata.userId` depuis l'objet Stripe et vérifier strictement que `sessionUserId.equals(authenticatedUser.getId().toString())`. Si la session appartient à un autre utilisateur, lever une `AccessDeniedException`.

### 2. Failles IDOR sur `EnrollmentController`
Le contrôleur des inscriptions ne protège pas suffisamment les ressources.
- **`GET /api/enrollments/{id}`** : Ne possède pas de `@PreAuthorize`. Ajouter un contrôle garantissant que seul l'ADMIN ou le propriétaire de l'inscription peut lire la ressource.
- **`PUT /api/enrollments/{id}/progress`** : Le service ne vérifie pas la propriété. Restreindre via une méthode JPA type `updateProgress(enrollmentId, authenticatedUserId, progress)`.
- **`POST /api/enrollments`** : Bloquer la possibilité pour un étudiant de fournir un `{ "userId": "..." }` arbitraire, ou ségréger les endpoints (Admin vs Self).

### 3. Raccordement Actif de l'Idempotence Stripe
La table `stripe_event` existe mais le code n'empêche toujours pas l'exécution multiple.
- **Exigence métier** : Le contrôleur doit parser l'ID de l'événement (`root.path("id").asText()`).
- L'insertion en base doit s'appuyer sur la contrainte `UNIQUE` : 
  - Tenter l'insertion : `INSERT INTO stripe_event(stripe_event_id, type) VALUES (...)`.
  - Si l'insertion échoue pour cause de conflit d'unicité, catcher l'exception (ex: `DataIntegrityViolationException`), et retourner immédiatement un HTTP 200 (Événement ignoré de façon idempotente).
- **Filtrage des événements** : Dans le `switch/case` des événements de webhook, retirer la clause `default` qui bascule le paiement en `PENDING`. Remplacer par un log informatif (`"Stripe event ignored"`) puis un simple `return`.

### 4. Nettoyage du Legacy Provisioning
- Retirer les 3 constantes d'UUID hard-codées résiduelles dans l'ancien `EnrollmentService`. Déplacer définitivement la logique vers `EnrollmentProvisioningService` avec les slugs.

---

## 🟠 P1 - E2E, CORS et Auth Cookies

### 5. Intégration Continue E2E (Playwright)
- Le dossier `e2e/Playwright` existe mais ne tourne pas. Configurer le workflow CI frontend pour lancer ces scénarios E2E afin de bloquer les régressions (ex: `npm run test` -> `playwright test`).

### 6. Protection Frontend & Réseau
- **CORS** : Le profil de production (`prod`) doit interdire les domaines laxistes et le wildcard en se limitant à `noseumcode.fr`.
- **Tokens** : Lancer le chantier de transition des JWT du `localStorage` vers des cookies `HttpOnly Secure SameSite` (mitigation XSS).

---

## 🟢 P2 - Qualité du Code (Bruit Git & Encodage)

### 7. Nettoyage des Artefacts
- **Fichiers doublons** : Résoudre les problèmes d'encodage (Mac/Windows) ayant généré des doublons dans `frontend/data/` (Programme Web) et `.github/instructions/` (rules). Supprimer les versions erronées.
- **POM.xml** : Modifier la balise `<description>` qui indique encore Spring Boot 3 alors que le framework a été updaté en version 4.1.

---

# Définition des Nouveaux Sprints pour la Roadmap

Ces sprints doivent figurer dans la Roadmap (Kanban & Document) et être pris en charge par l'agent développeur :

### Sprint 25 : Sécurité Métier & Raccordement Idempotence Stripe (P0)
- **25.1 Contrôle d'accès Stripe Session** : Ajouter la validation `session.metadata.userId == JWT user.id` dans `confirm-session` pour prévenir l'usurpation d'achats.
- **25.2 Correction IDOR sur Inscriptions** : Sécuriser les accès et mises à jour du contrôleur d'enrollment (GET, PUT progress, POST). Un étudiant ne peut gérer que ses propres données.
- **25.3 Logique d'Idempotence Stripe Branchée** : Lier `StripeEventRepository` au webhook. Exploiter l'exception d'unicité (UK) comme verrou d'idempotence et ignorer les événements non supportés.
- **25.4 Suppression des UUID Legacy** : Retirer les constantes UUID hard-codées restantes de l'ancien `EnrollmentService`.

### Sprint 26 : Intégration E2E, CORS & Hygiène (P1/P2)
- **26.1 Playwright CI Gate** : Ajouter l'exécution automatique des tests E2E Playwright dans la chaîne GitHub Actions.
- **26.2 Durcissement Réseau (CORS & Auth)** : Ciblage du CORS en prod + conception de l'architecture cookies `HttpOnly` pour le JWT.
- **26.3 Nettoyage du Bruit Git** : Supprimer les fichiers dupliqués avec des erreurs d'encodage (frontend/data, instructions) et corriger le texte du `pom.xml` (Spring Boot 4).
