-- V007: Seed Courses, Chapters, and Rich Lorem Ipsum Content with Teacher & Admin authors

DO $$
DECLARE
    admin_id UUID;
    teacher_id UUID;
    course1_id UUID := 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
    course2_id UUID := 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e';
    
    chap1_id UUID := 'c1111111-1111-1111-1111-111111111111';
    chap2_id UUID := 'c2222222-2222-2222-2222-222222222222';
    chap3_id UUID := 'c3333333-3333-3333-3333-333333333333';
    chap4_id UUID := 'c4444444-4444-4444-4444-444444444444';
    
    chap21_id UUID := 'd1111111-1111-1111-1111-111111111111';
    chap22_id UUID := 'd2222222-2222-2222-2222-222222222222';
    chap23_id UUID := 'd3333333-3333-3333-3333-333333333333';
BEGIN
    -- 1. Récupérer ou créer l'ID de l'admin
    SELECT id INTO admin_id FROM users WHERE email = 'admin@codebangers.fr' LIMIT 1;
    IF admin_id IS NULL THEN
        SELECT id INTO admin_id FROM users WHERE role = 'ADMIN' LIMIT 1;
    END IF;

    -- 2. Créer un compte enseignant de démonstration si inexistant
    SELECT id INTO teacher_id FROM users WHERE email = 'teacher@codebangers.fr' LIMIT 1;
    IF teacher_id IS NULL THEN
        teacher_id := gen_random_uuid();
        INSERT INTO users (
            id, user_name, first_name, last_name, email, password_hash, role, provider, created_at, updated_at, is_deleted, is_blocked
        ) VALUES (
            teacher_id, 'prof_cedric', 'Cédric', 'Ragot', 'teacher@codebangers.fr',
            '$2a$10$w3U6Yd48Kkg8E8NfW7i5q.Yd6rP5PsqsD/0y2u0w.8M1xG7P5f0mC',
            'TEACHER', 'LOCAL', NOW(), NOW(), false, false
        );
    END IF;

    -- 3. Insérer ou mettre à jour le Cours 1 : Fullstack Java 21 & Spring Boot 3
    IF NOT EXISTS (SELECT 1 FROM course WHERE id = course1_id) THEN
        INSERT INTO course (id, title, description, created_at, updated_at, created_by_id, updated_by_id, is_deleted)
        VALUES (
            course1_id,
            'Fullstack Java 21 & Spring Boot 3.4+',
            'Apprenez à concevoir des architectures backend robustes et performantes avec Java 21 (Virtual Threads, Records, Pattern Matching), Spring Boot 3.4+, Spring Security, JWT RBAC et PostgreSQL.',
            NOW() - INTERVAL '15 days',
            NOW() - INTERVAL '1 hour',
            admin_id,
            teacher_id,
            false
        );
    END IF;

    -- 4. Insérer ou mettre à jour le Cours 2 : Clean Architecture & DDD
    IF NOT EXISTS (SELECT 1 FROM course WHERE id = course2_id) THEN
        INSERT INTO course (id, title, description, created_at, updated_at, created_by_id, updated_by_id, is_deleted)
        VALUES (
            course2_id,
            'Clean Architecture & DDD en Pratique',
            'Maîtrisez le découplage métier absolu, l''architecture hexagonale (Ports & Adapters) et le Domain-Driven Design pour concevoir des applications modulaires, testables et scalables.',
            NOW() - INTERVAL '10 days',
            NOW() - INTERVAL '2 days',
            teacher_id,
            teacher_id,
            false
        );
    END IF;

    -- 5. Chapitres pour le Cours 1
    -- Chapitre 1 (Validé)
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap1_id) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap1_id, course1_id, '1. Introduction & Écosystème Java 21 LTS', 1, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', admin_id, false, 'APPROVED');
    END IF;

    -- Chapitre 2 (Validé)
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap2_id) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap2_id, course1_id, '2. Architecture en Couches & Persistance JPA', 2, NOW() - INTERVAL '12 days', NOW() - INTERVAL '10 days', teacher_id, false, 'APPROVED');
    END IF;

    -- Chapitre 3 (Validé)
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap3_id) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap3_id, course1_id, '3. Sécurité Avancée, JWT & RBAC Zero Trust', 3, NOW() - INTERVAL '8 days', NOW() - INTERVAL '5 days', admin_id, false, 'APPROVED');
    END IF;

    -- Chapitre 4 (En attente de validation - Modifié par l'enseignant)
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap4_id) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status, submitted_at)
        VALUES (chap4_id, course1_id, '4. Intégration OAuth2 Social Login (Google & GitHub)', 4, NOW() - INTERVAL '2 days', NOW() - INTERVAL '30 minutes', teacher_id, false, 'PENDING_APPROVAL', NOW() - INTERVAL '30 minutes');
    END IF;

    -- 6. Chapitres pour le Cours 2
    -- Chapitre 2.1 (Validé)
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap21_id) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap21_id, course2_id, '1. Fondamentaux du Domain-Driven Design (DDD)', 1, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days', teacher_id, false, 'APPROVED');
    END IF;

    -- Chapitre 2.2 (En attente de validation)
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap22_id) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status, submitted_at)
        VALUES (chap22_id, course2_id, '2. Architecture Hexagonale : Ports & Adaptateurs', 2, NOW() - INTERVAL '6 days', NOW() - INTERVAL '2 hours', teacher_id, false, 'PENDING_APPROVAL', NOW() - INTERVAL '2 hours');
    END IF;

    -- Chapitre 2.3 (Validé)
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap23_id) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap23_id, course2_id, '3. Transactional Outbox Pattern & EDA', 3, NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day', admin_id, false, 'APPROVED');
    END IF;

    -- 7. Contenus fictifs enrichis (Lorem Ipsum technique & code source)
    -- Contenu pour Chapitre 1
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap1_id) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(),
            chap1_id,
            'MARKDOWN',
            '# 🚀 Bienvenue dans Java 21 LTS

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Java 21 apporte des fonctionnalités majeures dont les **Virtual Threads (Project Loom)**, les **Record Patterns** et le **Sequenced Collections**.

### 🌟 Les points clés du module :
- **Virtual Threads** : Concurrence à haut débit sans surcharge de threads système.
- **Pattern Matching** : Simplification des switch et instanceof.
- **Record classes** : Immutabilité élégante pour vos DTO et Value Objects.

```java
public record UserDto(UUID id, String email, Role role) {}

public void processUser(Object obj) {
    if (obj instanceof UserDto(var id, var email, var role)) {
        System.out.println("Utilisateur authentifié : " + email + " avec rôle : " + role);
    }
}
```

> **Conseil de pro :** Utilisez toujours la version LTS la plus récente pour vos nouveaux projets de production.',
            1,
            NOW(),
            NOW(),
            false,
            'APPROVED'
        );
    END IF;

    -- Contenu pour Chapitre 2
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap2_id) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(),
            chap2_id,
            'MARKDOWN',
            '# 🏛️ Architecture en Couches & Persistance JPA

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### 📐 Structuration recommandée :
1. **Controller Layer** : Exposition REST, validation des requêtes (`@Valid`), codes HTTP appropriés.
2. **Service Layer** : Logique métier pure, gestion transactionnelle (`@Transactional`).
3. **Repository Layer** : Interfaces Spring Data JPA pour les opérations en base PostgreSQL.

```java
@Service
@Transactional
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course createCourse(String title, String description, User creator) {
        Course course = new Course(title, description);
        course.setCreatedBy(creator);
        return courseRepository.save(course);
    }
}
```',
            1,
            NOW(),
            NOW(),
            false,
            'APPROVED'
        );
    END IF;

    -- Contenu pour Chapitre 3
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap3_id) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(),
            chap3_id,
            'MARKDOWN',
            '# 🛡️ Sécurité Avancée : JWT, RBAC & OWASP

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. La sécurité de votre API repose sur le principe **Never Trust the Client**.

### 🔒 Bonnes pratiques de sécurité :
- Authentification Stateless basée sur **JWT (JSON Web Tokens)** avec signature HMAC-SHA256 ou RSA.
- Contrôle d''accès granulaire basé sur les rôles avec `@PreAuthorize("hasRole(''ADMIN'')")`.
- Hachage robuste des mots de passe avec **BCrypt** (force 10+).

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    // Configuration sécurisée Spring Security 6.x
}
```',
            1,
            NOW(),
            NOW(),
            false,
            'APPROVED'
        );
    END IF;

    -- Contenu pour Chapitre 4 (Pending)
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap4_id) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(),
            chap4_id,
            'MARKDOWN',
            '# 🌐 Intégration OAuth2 Social Login

*Note : Cette section a été soumise par un enseignant et est en cours de révision par l''équipe d''administration.*

Lorem ipsum dolor sit amet, consectetur adipiscing elit. L''authentification sociale simplifie l''onboarding utilisateur en déléguant l''identité à des fournisseurs tiers réputés (Google, GitHub, Facebook, Discord).

### 🛠️ Étapes de mise en œuvre :
1. Enregistrement de l''application client auprès du fournisseur OAuth2.
2. Configuration des `client-id` et `client-secret` dans les variables d''environnement.
3. Implémentation du `CustomOAuth2UserService` pour provisionner automatiquement le profil utilisateur dans PostgreSQL.

```properties
spring.security.oauth2.client.registration.google.client-id=your-google-client-id
spring.security.oauth2.client.registration.google.client-secret=your-google-client-secret
spring.security.oauth2.client.registration.google.scope=email,profile
```',
            1,
            NOW(),
            NOW(),
            false,
            'PENDING_APPROVAL'
        );
    END IF;

END $$;
