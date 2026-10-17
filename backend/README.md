# NoSeumCode — Backend API & Monolith

API REST sécurisée et services métier pour la plateforme d'apprentissage NoSeumCode.

---

## 1. Stack Technique

- **Langage** : Java 21 (LTS)
- **Framework** : Spring Boot 4.1.x / Spring Framework 7.x
- **Sécurité** : Spring Security 7.x (JWT Stateless + OAuth2 Google/Discord, RBAC strict)
- **Persistance** : Spring Data JPA, Hibernate, PostgreSQL 16, Migrations Flyway
- **Intégrations Externes** :
  - **Stripe** : Embedded Checkout, Customer Portal, Webhooks idempotents avec signature HMAC
  - **Discord** : Discord REST API v10 (OAuth2 Account Linking, rôles automatiques, salons vocaux/scènes)
  - **Mailer** : JavaMailSender (Reset de mot de passe, notifications)
- **Documentation & Outils** : Springdoc OpenAPI (Swagger UI), Maven Wrapper (`./mvnw`)

---

## 2. Démarrage Rapide

### Prérequis
- JDK 21+ (`java -version`)
- PostgreSQL 16 actif avec une base `codebangers`
- Maven 3.9+ ou le wrapper inclus (`./mvnw`)

### Configuration Locale
Créer ou adapter les variables dans `src/main/resources/application.properties` ou via profil `application-local.properties` :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/codebangers
spring.datasource.username=postgres
spring.datasource.password=postgres

jwt.secret=votre-cle-secrete-sha256-de-minimum-256-bits-pour-jwt
stripe.api-key=sk_test_...
stripe.webhook.secret=whsec_...
discord.bot-token=...
discord.guild-id=...
```

### Lancement & Tests
```bash
# Compilation du code et des tests
./mvnw clean test-compile

# Exécution des tests unitaires et d'intégration
./mvnw test

# Démarrage du serveur backend (port par défaut : 8080)
./mvnw spring-boot:run
```

---

## 3. Architecture Modulaire

Le backend est structuré selon une architecture modulaire en couches par domaine :

```
backend/src/main/java/com/codebangers/backend/
├── auth/          # Authentification JWT, Refresh Tokens, Reset Password, OAuth2 (Discord, Google)
├── chapter/       # Gestion des chapitres et sections de cours
├── cohort/        # Sessions d'apprentissage et groupes d'élèves (max 6 participants)
├── config/        # Sécurité Spring Security, filtres JWT, CORS, configs tiers
├── content/       # Blocs de contenu pédagogique (Markdown, Vidéo, Code)
├── course/        # Gestion du catalogue de cours, paliers (Starter, Web, VIP) et inscriptions
├── discord/       # Passerelle API Discord, synchronisation automatique des rôles et channels
├── payment/       # Passerelle Stripe Checkout, gestion des sessions et webhooks
├── user/          # Modèle User, RBAC (STUDENT, TEACHER, ADMIN), profil et gestion d'équipe
└── workshop/      # Ateliers découvertes en direct et réservations de créneaux
```

---

## 4. Matrice RBAC (Rôles & Permissions)

| Ressource / Action | GUEST | STUDENT | TEACHER | ADMIN |
|--------------------|:-----:|:-------:|:-------:|:-----:|
| Catalogue public (`GET /api/courses`) | ✅ | ✅ | ✅ | ✅ |
| Preview gratuit (Chapitre 1) | ✅ | ✅ | ✅ | ✅ |
| Chapitres payants (Chapitre 2+) | ❌ | ✅ (si PAID) | ✅ (si assigné) | ✅ |
| Création / édition de chapitres | ❌ | ❌ | ✅ (modération) | ✅ (direct) |
| Approbation de chapitres (`POST /approve`) | ❌ | ❌ | ❌ | ✅ |
| Synchronisation Discord (`POST /sync-roles`) | ❌ | ✅ | ✅ | ✅ |
| Administration Utilisateurs & Soft Delete | ❌ | ❌ | ❌ | ✅ |

---

## 5. Tests & Couverture

- **Tests unitaires** : Mockito / JUnit 5 (`AuthServiceTest`, `DiscordServiceTest`, etc.)
- **Tests de sécurité (Paywall)** : `PaywallSecurityTest` vérifie le cloisonnement strict des contenus payants contre les fuites non authentifiées.
- **Tests d'intégration réels** : `CourseTeacherIntegrationTest` valide le cycle complet d'assignation et de récupération eager sans lazy exceptions.
