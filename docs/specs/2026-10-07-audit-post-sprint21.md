# Cahier des Charges - Post-Audit Sprint 21 (07 Octobre 2026)

Ce cahier des charges s'adresse à l'agent de développement. Il fait suite à l'audit architectural réalisé après le commit `49d52a3` de la branche `develop`.

L'architecture (Modular Monolith Spring Boot, PostgreSQL, Vanilla JS) est validée. L'objectif exclusif des prochains sprints est la **fiabilisation de l'existant**, la **sécurisation de l'infrastructure** et le **renforcement des garde-fous applicatifs**.

---

## 🔴 P0 - Urgences (Avant Exploitation Commerciale)

### 1. Finalisation de l'Idempotence Stripe (Critique)
La table `stripe_event` a été créée, mais la logique applicative est manquante.
- Créer l'entité JPA `StripeEvent` mappée sur la table `stripe_event` (colonne `stripe_event_id` unique).
- Créer le `StripeEventRepository`.
- Dans le service traitant les webhooks Stripe :
  1. Extraire l'identifiant unique de l'événement depuis le payload Stripe (`root.path("id").asText()`).
  2. Avant tout traitement métier, vérifier si cet identifiant existe en base.
  3. S'il existe, retourner immédiatement un HTTP 200 (événement déjà traité).
  4. Sinon, insérer l'événement dans la table et procéder au traitement.

### 2. Sécurisation Stricte du Pipeline de Déploiement
- **Suppression du nettoyage automatique Flyway** : Retirer définitivement `DELETE FROM flyway_schema_history WHERE success = false;` du script de déploiement. Toute migration en échec doit faire planter le déploiement pour obliger à une réparation manuelle.
- **Révocation des privilèges PostgreSQL** : Vérifier que le compte applicatif créé dans le pipeline ne possède que les droits stricts nécessaires (tables, schémas, séquences) et en aucun cas un rôle d'administration.
- **Fiabilisation du Healthcheck** : Le script de déploiement masque actuellement les échecs avec un `|| echo`. Le retirer : si le conteneur backend ne répond pas au healthcheck, l'étape CI doit échouer.

### 3. Gouvernance Git : Protection des Branches
- Configurer les règles de protection GitHub sur les branches `develop` et `main` :
  - Interdire les pushs directs.
  - Rendre les Pull Requests obligatoires.
  - Rendre la validation de la CI obligatoire avant le merge.

### 4. Sécurisation du Rate Limiting (X-Forwarded-For)
- S'assurer que le reverse proxy (Nginx/Cloudflare) écrase systématiquement l'en-tête `X-Forwarded-For` reçu du client. Le code Spring se fie au premier élément de cet en-tête, ce qui expose à un spoofing d'IP si le proxy ne le nettoie pas.

---

## 🟠 P1 - Important (Hygiène et Tests)

### 5. Nettoyage du Frontend Environment
- Retirer totalement la clé `STRIPE_SECRET_KEY` du fichier `frontend/.env.example`. Le front ne doit connaître que la clé publique.

### 6. Tests d'Intégration Base de Données
- Mettre en place `Testcontainers` avec PostgreSQL pour valider le comportement réel des repositories JPA et l'exécution des migrations Flyway lors des tests automatisés.

---

## 🟢 P2 - Dette Technique & Observabilité

### 7. Nettoyage Git (.DS_Store)
- Exécuter `git rm --cached .DS_Store` à la racine du projet et commiter, pour retirer les métadonnées macOS historiquement traquées.

### 8. Découpage Architectural (God Classes)
- **PaymentService** : À scinder en services à responsabilité unique (ex: `CheckoutService`, `StripeEventService`, `EnrollmentService`).
- **PaymentController** : À découper par domaine REST explicite (Admin, Webhook, Checkout).

### 9. Observabilité et Traçabilité
- Introduire un `Correlation ID` (ex: `X-Request-ID`) traversant l'application pour tracer une requête de bout en bout dans les logs, en particulier pour le diagnostic des webhooks Stripe.
- Configurer les métriques d'application via Spring Boot Actuator.

---

# Nouveaux Sprints pour la Roadmap

Les tâches ci-dessous sont à intégrer dans la feuille de route pour le développement immédiat.

### Sprint 23 : Finalisation Idempotence Stripe & Sécurisation Infra (P0)
- **23.1 Entité et Repository StripeEvent** : Mapping JPA de la table `stripe_event`.
- **23.2 Logique d'idempotence Webhook** : Extraction de `event.id` du payload Stripe, vérification de non-existence en base avant traitement, et sauvegarde de l'événement.
- **23.3 Assainissement du script de déploiement** : Suppression du nettoyage Flyway (`DELETE FROM flyway_schema_history`) et du masquage d'erreur du healthcheck (`|| echo`).
- **23.4 Révocation des droits DBA applicatifs** : Ajustement des requêtes de création d'utilisateur dans le déploiement pour n'octroyer que les permissions DML/DDL de base.
- **23.5 Protection des branches GitHub** : Activation des *Branch Protection Rules* sur `develop` et `main` (PR et CI obligatoires).

### Sprint 24 : Qualité, CI/CD et Observabilité (P1 & P2)
- **24.1 Nettoyage des scories du projet** : Suppression de `STRIPE_SECRET_KEY` du `.env.example` frontend et suppression des `.DS_Store` trackés via `git rm --cached`.
- **24.2 Implémentation de Testcontainers** : Ajout de Testcontainers PostgreSQL pour les tests de la couche de persistance.
- **24.3 Découpage `PaymentController` et `PaymentService`** : Refactoring pour éliminer les "God Classes" de la logique de paiement.
- **24.4 Observabilité (Correlation ID)** : Mise en place d'un filtre interceptant ou générant un Request ID injecté dans le contexte de log (MDC) pour toutes les requêtes entrantes.
