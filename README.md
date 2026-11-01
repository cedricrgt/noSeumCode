# NoSeumCode

NoSeumCode est une plateforme d'e-learning et un portfolio professionnel destiné aux développeurs web. Elle propose des parcours de formation (Pack Starter, Pack Web Pro, Mentorat) avec un système complet de gestion des paiements, des cohortes et une intégration communautaire.

## Architecture

Le projet adopte une architecture pragmatique, performante et robuste, privilégiant un monolithe modulaire (Modular Monolith) plutôt qu'une sur-ingénierie microservices prématurée.

### Backend (API REST)
- **Stack** : Java 21, Spring Boot 4.1.x, Spring Security 7.0.x.
- **Base de données** : PostgreSQL 16 avec migrations gérées par **Flyway**.
- **Design Pattern** : Monolithe modulaire avec isolation par domaines fonctionnels (Identity, Catalog, Commerce, Learning, Community).
- **Sécurité** : JWT (HS256) avec BCrypt (13 rounds), validation rigoureuse des accès (RBAC), Rate Limiting.
- **Intégrations (Ports & Adapters)** :
  - **Stripe** : Gestion des paiements (Checkout) avec idempotence stricte des webhooks et sécurisation des signatures.
  - **Discord** : Synchronisation automatisée des rôles utilisateurs post-achat.

### Frontend
- **Stack** : Vanilla HTML, CSS, JavaScript (sans framework lourd type React/Vue).
- **Performance & SEO** : Génération statique (SSG via `build-static.js`) pour un référencement optimal (Core Web Vitals ciblés) et une structure sémantique riche (JSON-LD, balisages IA).
- **Hébergement** : Nginx / Apache sur o2switch & Oracle Cloud avec Cloudflare (HTTPS, WAF).

## Lancement en développement

L'environnement de développement repose sur Docker pour la base de données, et Maven pour l'application Spring Boot.

### Pré-requis
- Docker & Docker Compose
- Java 21 (Temurin)
- Maven 3.9+

### Démarrage

1. Cloner le dépôt et configurer les variables d'environnement (`.env.example` -> `.env`).
2. Démarrer la base de données locale (PostgreSQL 16) :
   ```bash
   docker compose up -d postgres
   ```
3. Lancer l'application backend via Maven :
   ```bash
   ./mvnw spring-boot:run
   ```
4. Le frontend statique peut être servi avec n'importe quel serveur HTTP léger (ex: Live Server ou `python -m http.server`) depuis le dossier `frontend/`.

## Gouvernance & CI/CD

Le projet s'appuie sur une gouvernance Git stricte (détaillée dans les [ADR internes](docs/ai/DECISIONS.md)) :
- **Branche principale `main`** : Code en production, déploiement automatisé protégé.
- **Branche `develop`** : Environnement de staging. Interdiction formelle de commit direct.
- **Processus de contribution** : Création de branches dédiées (`feat/`, `fix/`) depuis `develop`, puis livraison systématique via **Pull Request**.
- **CI/CD** : Workflows GitHub Actions pour les tests backend (PostgreSQL 16 via Testcontainers), et déploiements conditionnels via scripts automatisés.

## Mémoire Architecturale (IA)

Ce dépôt est conçu pour collaborer de manière transparente avec des agents d'Intelligence Artificielle (Antigravity, GitHub Copilot). Le dossier `docs/ai/` contient le contexte du projet, les décisions architecturales (ADR), la feuille de route et l'historique des modifications. Il sert de mémoire permanente pour l'assistance au développement.

---
*Conçu et développé avec rigueur par Cédric.*
