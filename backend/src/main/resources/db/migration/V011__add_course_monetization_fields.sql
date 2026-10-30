-- V011: Add Course Monetization and Catalog Fields (Sprint 2)
-- Configures official catalog courses and pricing:
--   HTML & CSS: 579 EUR (57900 cents)
--   JavaScript: 579 EUR (57900 cents)
--   Git & GitHub: 279 EUR (27900 cents)

DO $$
BEGIN
    -- 1. Add price_in_cents
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course' AND column_name = 'price_in_cents') THEN
        ALTER TABLE course ADD COLUMN price_in_cents BIGINT NOT NULL DEFAULT 4900;
    END IF;

    -- 2. Add currency
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course' AND column_name = 'currency') THEN
        ALTER TABLE course ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'EUR';
    END IF;

    -- 3. Add slug
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course' AND column_name = 'slug') THEN
        ALTER TABLE course ADD COLUMN slug VARCHAR(255);
    END IF;

    -- 4. Add thumbnail_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course' AND column_name = 'thumbnail_url') THEN
        ALTER TABLE course ADD COLUMN thumbnail_url VARCHAR(500);
    END IF;

    -- 5. Add level
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course' AND column_name = 'level') THEN
        ALTER TABLE course ADD COLUMN level VARCHAR(50) NOT NULL DEFAULT 'BEGINNER';
    END IF;

    -- 6. Add is_published
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course' AND column_name = 'is_published') THEN
        ALTER TABLE course ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT true;
    END IF;
END $$;

-- Populate catalog data for seeded courses
UPDATE course
SET slug = 'fullstack-java-21-spring-boot-3',
    price_in_cents = 4900,
    currency = 'EUR',
    level = 'INTERMEDIATE',
    thumbnail_url = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    is_published = true
WHERE id = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d' OR title LIKE 'Fullstack Java 21%';

UPDATE course
SET slug = 'clean-architecture-ddd-en-pratique',
    price_in_cents = 6900,
    currency = 'EUR',
    level = 'ADVANCED',
    thumbnail_url = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    is_published = true
WHERE id = 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e' OR title LIKE 'Clean Architecture%';

-- Ensure any existing course has a slug
UPDATE course
SET slug = 'course-' || id
WHERE slug IS NULL;

-- 7. Seed Official NoSeumCode Courses & Chapters
DO $$
DECLARE
    admin_id UUID;
    
    course_html_id UUID := 'c1000000-0000-0000-0000-000000000001';
    course_js_id   UUID := 'c2000000-0000-0000-0000-000000000002';
    course_git_id  UUID := 'c3000000-0000-0000-0000-000000000003';

    chap_html_1 UUID := 'c1000001-0000-0000-0000-000000000001';
    chap_html_2 UUID := 'c1000002-0000-0000-0000-000000000002';
    chap_html_3 UUID := 'c1000003-0000-0000-0000-000000000003';

    chap_js_1 UUID := 'c2000001-0000-0000-0000-000000000001';
    chap_js_2 UUID := 'c2000002-0000-0000-0000-000000000002';
    chap_js_3 UUID := 'c2000003-0000-0000-0000-000000000003';

    chap_git_1 UUID := 'c3000001-0000-0000-0000-000000000001';
    chap_git_2 UUID := 'c3000002-0000-0000-0000-000000000002';
    chap_git_3 UUID := 'c3000003-0000-0000-0000-000000000003';
BEGIN
    SELECT id INTO admin_id FROM users WHERE role = 'ADMIN' OR email = 'admin@codebangers.fr' LIMIT 1;

    -- ========================================================
    -- Cours 1 : HTML & CSS (579 €)
    -- ========================================================
    IF NOT EXISTS (SELECT 1 FROM course WHERE id = course_html_id OR slug = 'html-css') THEN
        INSERT INTO course (id, title, description, slug, price_in_cents, currency, level, thumbnail_url, is_published, is_deleted, created_at, updated_at, created_by_id)
        VALUES (
            course_html_id,
            'HTML & CSS – Les Fondations indispensables au Web',
            'HTML structure ton contenu, CSS lui donne du style. Apprends comment ces langages transforment une simple page en une expérience visuelle immersive.',
            'html-css',
            57900,
            'EUR',
            'BEGINNER',
            'images/courses/html.webp',
            true,
            false,
            NOW(),
            NOW(),
            admin_id
        );
    ELSE
        UPDATE course
        SET price_in_cents = 57900,
            currency = 'EUR',
            slug = 'html-css',
            thumbnail_url = 'images/courses/html.webp',
            is_published = true
        WHERE id = course_html_id OR slug = 'html-css' OR title LIKE 'HTML & CSS%';
    END IF;

    -- Chapitres HTML & CSS
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap_html_1) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap_html_1, course_html_id, '1. Structure & Sémantique HTML5 (Aperçu Gratuit)', 1, NOW(), NOW(), admin_id, false, 'APPROVED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap_html_2) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap_html_2, course_html_id, '2. Style, Couleurs & Typographie CSS3', 2, NOW(), NOW(), admin_id, false, 'APPROVED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap_html_3) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap_html_3, course_html_id, '3. Layouts Flexbox & Responsive Design', 3, NOW(), NOW(), admin_id, false, 'APPROVED');
    END IF;

    -- Contenu pour Chapitre 1 HTML & CSS
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap_html_1) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(), chap_html_1, 'TEXT',
            '# 🚀 Bienvenue dans HTML & CSS

HTML et CSS sont les deux piliers indissociables de tout projet web moderne.

## Ce que tu vas apprendre dans ce premier module gratuit :
1. **La structure fondamentale** d''un document HTML5 (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`).
2. **Les balises sémantiques** : `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`.
3. **L''accessibilité native** et l''optimisation pour le référencement (SEO).

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Ma Première Page Web</title>
</head>
<body>
  <h1>Bienvenue sur NoSeumCode !</h1>
  <p>Le code sans le seum commence ici.</p>
</body>
</html>
```

Passe aux chapitres suivants pour maîtriser le CSS, les grilles et concevoir tes propres maquettes réactives !',
            1, NOW(), NOW(), false, 'APPROVED'
        );
    END IF;

    -- Contenu pour Chapitre 2 HTML & CSS (Payant)
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap_html_2) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(), chap_html_2, 'TEXT',
            '# 🎨 Maîtrise le CSS Moderne

CSS te donne le contrôle total sur l''esthétique de tes créations.

## Au programme :
- Le Box Model (marge, bordure, padding, contenu).
- Les variables CSS (`--primary-green: #00ff87;`).
- Les pseudo-classes (`:hover`, `:focus-visible`).
- Typographie responsive avec `clamp()` et `rem`.',
            1, NOW(), NOW(), false, 'APPROVED'
        );
    END IF;

    -- Contenu pour Chapitre 3 HTML & CSS (Payant)
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap_html_3) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(), chap_html_3, 'TEXT',
            '# 📱 Layouts Flexbox & Responsive Design

Conçois des interfaces fluides qui s''adaptent automatiquement aux smartphones, tablettes et écrans 4K.

## Points clés :
- Flexbox 1D : alignement parfait et distribution de l''espace.
- CSS Grid 2D : galeries d''images et structures complexes.
- Media Queries modernes et Container Queries.',
            1, NOW(), NOW(), false, 'APPROVED'
        );
    END IF;

    -- ========================================================
    -- Cours 2 : JavaScript (579 €)
    -- ========================================================
    IF NOT EXISTS (SELECT 1 FROM course WHERE id = course_js_id OR slug = 'javascript') THEN
        INSERT INTO course (id, title, description, slug, price_in_cents, currency, level, thumbnail_url, is_published, is_deleted, created_at, updated_at, created_by_id)
        VALUES (
            course_js_id,
            'JavaScript – L''interactivité au bout des doigts',
            'Ajoute du dynamisme à tes pages : animations, effets, interactions… JavaScript te permet de créer des sites vivants et réactifs !',
            'javascript',
            57900,
            'EUR',
            'INTERMEDIATE',
            'images/courses/javascript.webp',
            true,
            false,
            NOW(),
            NOW(),
            admin_id
        );
    ELSE
        UPDATE course
        SET price_in_cents = 57900,
            currency = 'EUR',
            slug = 'javascript',
            thumbnail_url = 'images/courses/javascript.webp',
            is_published = true
        WHERE id = course_js_id OR slug = 'javascript' OR title LIKE 'JavaScript%';
    END IF;

    -- Chapitres JavaScript
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap_js_1) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap_js_1, course_js_id, '1. Premiers Pas avec JavaScript & ES6+ (Aperçu Gratuit)', 1, NOW(), NOW(), admin_id, false, 'APPROVED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap_js_2) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap_js_2, course_js_id, '2. Manipulation du DOM & Événements', 2, NOW(), NOW(), admin_id, false, 'APPROVED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap_js_3) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap_js_3, course_js_id, '3. API Fetch & Programmation Asynchrone', 3, NOW(), NOW(), admin_id, false, 'APPROVED');
    END IF;

    -- Contenu pour Chapitre 1 JavaScript
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap_js_1) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(), chap_js_1, 'TEXT',
            '# ⚡ Premiers Pas avec JavaScript

JavaScript est le langage de programmation du navigateur web.

## Les fondamentaux abordés :
- Variables modernes : `const` et `let` (bannissons `var`).
- Types de données : string, number, boolean, array, object.
- Fonctions fléchées (arrow functions) et portée (scope).

```javascript
const message = "Bienvenue dans le monde du JS moderne !";
console.log(message);

const multiply = (a, b) => a * b;
console.log(multiply(6, 7)); // 42
```',
            1, NOW(), NOW(), false, 'APPROVED'
        );
    END IF;

    -- Contenu pour Chapitre 2 JavaScript (Payant)
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap_js_2) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(), chap_js_2, 'TEXT',
            '# 🎮 Manipulation du DOM & Événements

Le DOM (Document Object Model) te permet de manipuler les éléments HTML en temps réel.

## Au programme :
- `document.querySelector` et `querySelectorAll`.
- Écouteurs d''événements : `addEventListener("click", ...)`.
- Création dynamique de nœuds avec `createElement`.',
            1, NOW(), NOW(), false, 'APPROVED'
        );
    END IF;

    -- Contenu pour Chapitre 3 JavaScript (Payant)
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap_js_3) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(), chap_js_3, 'TEXT',
            '# 🌐 API Fetch & Asynchronisme

Connecte ton application à des données externes et des serveurs backend.

## Au programme :
- Les Promesses JavaScript (`Promise`).
- La syntaxe moderne `async / await`.
- Gestion propre des erreurs réseau avec `try / catch`.',
            1, NOW(), NOW(), false, 'APPROVED'
        );
    END IF;

    -- ========================================================
    -- Cours 3 : Git & GitHub (279 €)
    -- ========================================================
    IF NOT EXISTS (SELECT 1 FROM course WHERE id = course_git_id OR slug = 'git-github') THEN
        INSERT INTO course (id, title, description, slug, price_in_cents, currency, level, thumbnail_url, is_published, is_deleted, created_at, updated_at, created_by_id)
        VALUES (
            course_git_id,
            'Git & GitHub – L''outil n°1 des devs pro',
            'Ne perds plus jamais ton code et apprends à bosser à plusieurs sur le même projet sans tout casser. Versionne comme un expert !',
            'git-github',
            27900,
            'EUR',
            'BEGINNER',
            'images/logos/Git_Logo_full.svg',
            true,
            false,
            NOW(),
            NOW(),
            admin_id
        );
    ELSE
        UPDATE course
        SET price_in_cents = 27900,
            currency = 'EUR',
            slug = 'git-github',
            thumbnail_url = 'images/logos/Git_Logo_full.svg',
            is_published = true
        WHERE id = course_git_id OR slug = 'git-github' OR title LIKE 'Git & GitHub%';
    END IF;

    -- Chapitres Git & GitHub
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap_git_1) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap_git_1, course_git_id, '1. Installation, Configuration & Premiers Commits (Aperçu Gratuit)', 1, NOW(), NOW(), admin_id, false, 'APPROVED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap_git_2) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap_git_2, course_git_id, '2. Branches, Merge & Résolution de conflits', 2, NOW(), NOW(), admin_id, false, 'APPROVED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM chapter WHERE id = chap_git_3) THEN
        INSERT INTO chapter (id, course_id, title, position, created_at, updated_at, created_by_id, is_deleted, status)
        VALUES (chap_git_3, course_git_id, '3. Collaboration GitHub, Pull Requests & Code Review', 3, NOW(), NOW(), admin_id, false, 'APPROVED');
    END IF;

    -- Contenu pour Chapitre 1 Git & GitHub
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap_git_1) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(), chap_git_1, 'TEXT',
            '# 💾 Premiers Pas avec Git

Git est le système de gestion de versions décentralisé le plus populaire au monde.

## Commandes indispensables de ce module :
- `git init` : initialiser un nouveau dépôt local.
- `git status` : vérifier l''état de l''arbre de travail.
- `git add <fichier>` : ajouter des modifications à la zone de staging.
- `git commit -m "..."` : enregistrer un instantané de ton code.

```bash
git init
git add .
git commit -m "feat: initial commit"
```',
            1, NOW(), NOW(), false, 'APPROVED'
        );
    END IF;

    -- Contenu pour Chapitre 2 Git & GitHub (Payant)
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap_git_2) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(), chap_git_2, 'TEXT',
            '# 🌿 Branches & Stratégies de Merge

Isole tes fonctionnalités sans impacter la branche principale.

## Au programme :
- Création et bascule de branches (`git checkout -b feat/...`).
- Fusion (`git merge`) et rebase (`git rebase`).
- Gestion et résolution sereine des conflits de fusion.',
            1, NOW(), NOW(), false, 'APPROVED'
        );
    END IF;

    -- Contenu pour Chapitre 3 Git & GitHub (Payant)
    IF NOT EXISTS (SELECT 1 FROM content WHERE chapter_id = chap_git_3) THEN
        INSERT INTO content (id, chapter_id, content_type, body, position, created_at, updated_at, is_deleted, status)
        VALUES (
            gen_random_uuid(), chap_git_3, 'TEXT',
            '# 🤝 Collaboration GitHub & Pull Requests

Travaille en équipe comme dans les plus grandes entreprises tech.

## Au programme :
- Configuration des clés SSH et remotes (`git remote add origin`).
- Création et revue de Pull Requests (PR) sur GitHub.
- Bonne pratique des Conventional Commits sans emojis et CI/CD.',
            1, NOW(), NOW(), false, 'APPROVED'
        );
    END IF;

END $$;

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS uk_course_slug ON course(slug);
CREATE INDEX IF NOT EXISTS idx_course_is_published ON course(is_published);
