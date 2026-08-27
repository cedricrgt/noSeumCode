CREATE TABLE IF NOT EXISTS course (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_by_id UUID,
    updated_by_id UUID,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    deleted_by_id UUID
);

CREATE TABLE IF NOT EXISTS enrollment (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    enrolled_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    progress INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS chapter (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL,
    parent_id UUID,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY,
    chapter_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    body TEXT,
    media_url VARCHAR(500),
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS workshop (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS user_workshop (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    workshop_id UUID NOT NULL,
    registered_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    attended BOOLEAN NOT NULL DEFAULT false
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_course_created_by') THEN
        ALTER TABLE course ADD CONSTRAINT fk_course_created_by FOREIGN KEY (created_by_id) REFERENCES users (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_course_updated_by') THEN
        ALTER TABLE course ADD CONSTRAINT fk_course_updated_by FOREIGN KEY (updated_by_id) REFERENCES users (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_course_deleted_by') THEN
        ALTER TABLE course ADD CONSTRAINT fk_course_deleted_by FOREIGN KEY (deleted_by_id) REFERENCES users (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_enrollment_user') THEN
        ALTER TABLE enrollment ADD CONSTRAINT fk_enrollment_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_enrollment_course') THEN
        ALTER TABLE enrollment ADD CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) REFERENCES course (id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uk_enrollment_user_course') THEN
        ALTER TABLE enrollment ADD CONSTRAINT uk_enrollment_user_course UNIQUE (user_id, course_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_chapter_course') THEN
        ALTER TABLE chapter ADD CONSTRAINT fk_chapter_course FOREIGN KEY (course_id) REFERENCES course (id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_chapter_parent') THEN
        ALTER TABLE chapter ADD CONSTRAINT fk_chapter_parent FOREIGN KEY (parent_id) REFERENCES chapter (id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_content_chapter') THEN
        ALTER TABLE content ADD CONSTRAINT fk_content_chapter FOREIGN KEY (chapter_id) REFERENCES chapter (id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_workshop_user') THEN
        ALTER TABLE user_workshop ADD CONSTRAINT fk_user_workshop_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_workshop_workshop') THEN
        ALTER TABLE user_workshop ADD CONSTRAINT fk_user_workshop_workshop FOREIGN KEY (workshop_id) REFERENCES workshop (id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uk_user_workshop') THEN
        ALTER TABLE user_workshop ADD CONSTRAINT uk_user_workshop UNIQUE (user_id, workshop_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_enrollment_user ON enrollment(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_course ON enrollment(course_id);
CREATE INDEX IF NOT EXISTS idx_chapter_course ON chapter(course_id);
CREATE INDEX IF NOT EXISTS idx_chapter_parent ON chapter(parent_id);
CREATE INDEX IF NOT EXISTS idx_content_chapter ON content(chapter_id);
CREATE INDEX IF NOT EXISTS idx_user_workshop_user ON user_workshop(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workshop_workshop ON user_workshop(workshop_id);
CREATE INDEX IF NOT EXISTS idx_course_created_at ON course(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workshop_start_date ON workshop(start_date);
