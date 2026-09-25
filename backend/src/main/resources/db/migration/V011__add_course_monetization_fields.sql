-- V011: Add Course Monetization and Catalog Fields (Sprint 2)

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
    thumbnail_url = 'images/illustrations/java-spring-card.webp',
    is_published = true
WHERE id = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d' OR title LIKE 'Fullstack Java 21%';

UPDATE course
SET slug = 'clean-architecture-ddd-en-pratique',
    price_in_cents = 6900,
    currency = 'EUR',
    level = 'ADVANCED',
    thumbnail_url = 'images/illustrations/clean-arch-card.webp',
    is_published = true
WHERE id = 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e' OR title LIKE 'Clean Architecture%';

-- Ensure any existing course has a slug
UPDATE course
SET slug = 'course-' || id
WHERE slug IS NULL;

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS uk_course_slug ON course(slug);
CREATE INDEX IF NOT EXISTS idx_course_is_published ON course(is_published);
