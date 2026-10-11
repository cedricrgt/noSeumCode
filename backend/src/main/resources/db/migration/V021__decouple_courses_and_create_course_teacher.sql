-- V021: Decouple bundle packages from real courses and ensure course_teacher table exists (Sprint 27)
-- Real pedagogical courses:
-- 1. Course 1: HTML5 & CSS3 Moderne (slug: html-css, required_tier: STARTER)
-- 2. Course 2: Git, GitHub & Déploiement (slug: git-github, required_tier: STARTER)
-- 3. Course 3: JavaScript ES6+ & DOM Interactif (slug: javascript, required_tier: WEB)

DO $$
BEGIN
    -- 1. Cours 1: HTML5 & CSS3 Moderne (c1)
    UPDATE course
    SET title = 'HTML5 & CSS3 Moderne',
        slug = 'html-css',
        required_tier = 'STARTER',
        updated_at = NOW()
    WHERE id = 'c1000000-0000-0000-0000-000000000001' OR slug = 'pack-starter' OR slug = 'html-css';

    -- 2. Cours 2: Git, GitHub & Déploiement (c3)
    UPDATE course
    SET title = 'Git, GitHub & Déploiement',
        slug = 'git-github',
        required_tier = 'STARTER',
        updated_at = NOW()
    WHERE id = 'c3000000-0000-0000-0000-000000000003' OR slug = 'pack-mentorat-vip' OR slug = 'git-github';

    -- 3. Cours 3: JavaScript ES6+ & DOM Interactif (c2)
    UPDATE course
    SET title = 'JavaScript ES6+ & DOM Interactif',
        slug = 'javascript',
        required_tier = 'WEB',
        updated_at = NOW()
    WHERE id = 'c2000000-0000-0000-0000-000000000002' OR slug = 'pack-web-pro' OR slug = 'javascript';
END $$;

-- 4. Table de liaison course_teacher (sécurité d'existence idempotente)
CREATE TABLE IF NOT EXISTS course_teacher (
    course_id UUID NOT NULL REFERENCES course(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    assigned_by_id UUID REFERENCES users(id),
    PRIMARY KEY (course_id, teacher_id)
);

CREATE INDEX IF NOT EXISTS idx_course_teacher_teacher_id ON course_teacher(teacher_id);
CREATE INDEX IF NOT EXISTS idx_course_teacher_course_id ON course_teacher(course_id);
