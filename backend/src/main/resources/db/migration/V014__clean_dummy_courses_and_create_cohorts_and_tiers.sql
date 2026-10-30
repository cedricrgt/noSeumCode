-- V014: Clean Dummy Courses, Add Cohorts and Product Tiers (Sprint 6 / ADR-013 & ADR-014)
-- 1. Nettoyage définitif des faux cours d'essai (Java 21 à 49 EUR et Clean Architecture à 69 EUR)
-- 2. Création de la table 'cohort' (petits groupes de 6 élèves max)
-- 3. Ajout de 'required_tier' sur la table 'course'
-- 4. Ajout de 'tier' et 'cohort_id' sur la table 'enrollment'

DO $$
BEGIN
    -- 1. Soft-delete / dépublication des faux cours d'essai
    UPDATE course
    SET is_deleted = true,
        is_published = false,
        updated_at = NOW()
    WHERE id IN ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e')
       OR slug IN ('fullstack-java-21-spring-boot-3', 'clean-architecture-ddd-en-pratique')
       OR title LIKE 'Fullstack Java 21%'
       OR title LIKE 'Clean Architecture%';

    -- 2. Ajout de required_tier sur la table course
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course' AND column_name = 'required_tier') THEN
        ALTER TABLE course ADD COLUMN required_tier VARCHAR(30) NOT NULL DEFAULT 'STARTER';
    END IF;

    -- 3. Mise à jour des cours officiels avec leur tier requis
    -- HTML & CSS : Tronc commun Starter (accessible Starter, Web, VIP)
    UPDATE course SET required_tier = 'STARTER' WHERE slug = 'html-css' OR id = 'c1000000-0000-0000-0000-000000000001';
    -- Git & GitHub : Tronc commun Starter (accessible Starter, Web, VIP)
    UPDATE course SET required_tier = 'STARTER' WHERE slug = 'git-github' OR id = 'c3000000-0000-0000-0000-000000000003';
    -- JavaScript : Module Avancé Web (accessible Web, VIP)
    UPDATE course SET required_tier = 'WEB' WHERE slug = 'javascript' OR id = 'c2000000-0000-0000-0000-000000000002';

END $$;

-- 4. Création de la table cohort (groupes de 6 max - ADR-013)
CREATE TABLE IF NOT EXISTS cohort (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    tier VARCHAR(30) NOT NULL DEFAULT 'WEB',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    max_students INT NOT NULL DEFAULT 6,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by_id UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_cohort_slug ON cohort(slug);
CREATE INDEX IF NOT EXISTS idx_cohort_status ON cohort(status);
CREATE INDEX IF NOT EXISTS idx_cohort_start_date ON cohort(start_date);

-- 5. Enrichissement de la table enrollment
DO $$
BEGIN
    -- Ajout du tier sur enrollment (STARTER, WEB, VIP)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enrollment' AND column_name = 'tier') THEN
        ALTER TABLE enrollment ADD COLUMN tier VARCHAR(30) NOT NULL DEFAULT 'WEB';
    END IF;

    -- Ajout du lien cohort_id sur enrollment
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enrollment' AND column_name = 'cohort_id') THEN
        ALTER TABLE enrollment ADD COLUMN cohort_id UUID REFERENCES cohort(id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_enrollment_tier ON enrollment(tier);
CREATE INDEX IF NOT EXISTS idx_enrollment_cohort_id ON enrollment(cohort_id);

-- 6. Initialisation des cohortes officielles pour l'automne / hiver 2026
DO $$
DECLARE
    admin_id UUID;
    cohort_1_id UUID := 'd1000000-0000-0000-0000-000000000001';
    cohort_2_id UUID := 'd2000000-0000-0000-0000-000000000002';
BEGIN
    SELECT id INTO admin_id FROM users WHERE role = 'ADMIN' OR email = 'admin@codebangers.fr' LIMIT 1;

    -- Cohorte Novembre 2026 - Alpha
    IF NOT EXISTS (SELECT 1 FROM cohort WHERE id = cohort_1_id OR slug = 'automne-2026-alpha') THEN
        INSERT INTO cohort (id, name, slug, description, tier, start_date, end_date, max_students, status, created_at, updated_at, created_by_id)
        VALUES (
            cohort_1_id,
            'Cohorte Novembre 2026 - Alpha',
            'automne-2026-alpha',
            'Promotion d''automne en petit groupe de 6 apprenants. 2h de cours live + 2h d''atelier projet immersif chaque semaine.',
            'WEB',
            TIMESTAMPTZ '2026-11-02 18:00:00+01',
            TIMESTAMPTZ '2026-12-18 20:00:00+01',
            6,
            'OPEN',
            NOW(),
            NOW(),
            admin_id
        );
    END IF;

    -- Cohorte Janvier 2027 - Beta
    IF NOT EXISTS (SELECT 1 FROM cohort WHERE id = cohort_2_id OR slug = 'hiver-2027-beta') THEN
        INSERT INTO cohort (id, name, slug, description, tier, start_date, end_date, max_students, status, created_at, updated_at, created_by_id)
        VALUES (
            cohort_2_id,
            'Cohorte Janvier 2027 - Beta',
            'hiver-2027-beta',
            'Promotion d''hiver NoSeumCode. Apprends à coder en équipe avec mentorat direct et replays illimités.',
            'WEB',
            TIMESTAMPTZ '2027-01-11 18:00:00+01',
            TIMESTAMPTZ '2027-02-26 20:00:00+01',
            6,
            'OPEN',
            NOW(),
            NOW(),
            admin_id
        );
    END IF;
END $$;
