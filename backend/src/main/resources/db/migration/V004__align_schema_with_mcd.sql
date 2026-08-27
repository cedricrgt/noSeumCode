-- V004: Align schema with MCD — add missing audit fields and new columns

DO $$
BEGIN
    -- ============================================================
    -- User: add phone, created_by_id
    -- ============================================================
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_by_id') THEN
        ALTER TABLE users ADD COLUMN created_by_id UUID;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_created_by') THEN
        ALTER TABLE users ADD CONSTRAINT fk_user_created_by FOREIGN KEY (created_by_id) REFERENCES users (id);
    END IF;

    -- ============================================================
    -- Chapter: add updated_by_id, is_deleted, deleted_by_id
    -- ============================================================
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapter' AND column_name = 'updated_by_id') THEN
        ALTER TABLE chapter ADD COLUMN updated_by_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapter' AND column_name = 'is_deleted') THEN
        ALTER TABLE chapter ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapter' AND column_name = 'deleted_by_id') THEN
        ALTER TABLE chapter ADD COLUMN deleted_by_id UUID;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_chapter_updated_by') THEN
        ALTER TABLE chapter ADD CONSTRAINT fk_chapter_updated_by FOREIGN KEY (updated_by_id) REFERENCES users (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_chapter_deleted_by') THEN
        ALTER TABLE chapter ADD CONSTRAINT fk_chapter_deleted_by FOREIGN KEY (deleted_by_id) REFERENCES users (id);
    END IF;

    -- ============================================================
    -- Content: add title, updated_by_id, deleted_by_id
    -- ============================================================
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'title') THEN
        ALTER TABLE content ADD COLUMN title VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'updated_by_id') THEN
        ALTER TABLE content ADD COLUMN updated_by_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'deleted_by_id') THEN
        ALTER TABLE content ADD COLUMN deleted_by_id UUID;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_content_updated_by') THEN
        ALTER TABLE content ADD CONSTRAINT fk_content_updated_by FOREIGN KEY (updated_by_id) REFERENCES users (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_content_deleted_by') THEN
        ALTER TABLE content ADD CONSTRAINT fk_content_deleted_by FOREIGN KEY (deleted_by_id) REFERENCES users (id);
    END IF;

    -- ============================================================
    -- Workshop: add theme, max_participants, updated_by_id, deleted_by_id
    -- ============================================================
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workshop' AND column_name = 'theme') THEN
        ALTER TABLE workshop ADD COLUMN theme VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workshop' AND column_name = 'max_participants') THEN
        ALTER TABLE workshop ADD COLUMN max_participants INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workshop' AND column_name = 'updated_by_id') THEN
        ALTER TABLE workshop ADD COLUMN updated_by_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workshop' AND column_name = 'deleted_by_id') THEN
        ALTER TABLE workshop ADD COLUMN deleted_by_id UUID;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_workshop_updated_by') THEN
        ALTER TABLE workshop ADD CONSTRAINT fk_workshop_updated_by FOREIGN KEY (updated_by_id) REFERENCES users (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_workshop_deleted_by') THEN
        ALTER TABLE workshop ADD CONSTRAINT fk_workshop_deleted_by FOREIGN KEY (deleted_by_id) REFERENCES users (id);
    END IF;
END $$;

-- Indexes on new FK columns
CREATE INDEX IF NOT EXISTS idx_chapter_updated_by ON chapter(updated_by_id);
CREATE INDEX IF NOT EXISTS idx_chapter_deleted_by ON chapter(deleted_by_id);
CREATE INDEX IF NOT EXISTS idx_content_updated_by ON content(updated_by_id);
CREATE INDEX IF NOT EXISTS idx_content_deleted_by ON content(deleted_by_id);
CREATE INDEX IF NOT EXISTS idx_workshop_updated_by ON workshop(updated_by_id);
CREATE INDEX IF NOT EXISTS idx_workshop_deleted_by ON workshop(deleted_by_id);
CREATE INDEX IF NOT EXISTS idx_user_created_by ON users(created_by_id);
