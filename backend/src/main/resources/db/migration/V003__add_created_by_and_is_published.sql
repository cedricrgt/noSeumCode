-- V003: Add created_by and is_published fields (from MCD)

DO $$
BEGIN
    -- Chapter: add created_by_id and is_published
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapter' AND column_name = 'created_by_id') THEN
        ALTER TABLE chapter ADD COLUMN created_by_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapter' AND column_name = 'is_published') THEN
        ALTER TABLE chapter ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT false;
    END IF;

    -- Content: add created_by_id and is_published
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'created_by_id') THEN
        ALTER TABLE content ADD COLUMN created_by_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'is_published') THEN
        ALTER TABLE content ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT false;
    END IF;

    -- Workshop: add created_by_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workshop' AND column_name = 'created_by_id') THEN
        ALTER TABLE workshop ADD COLUMN created_by_id UUID;
    END IF;

    -- Foreign key constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_chapter_created_by') THEN
        ALTER TABLE chapter ADD CONSTRAINT fk_chapter_created_by FOREIGN KEY (created_by_id) REFERENCES users (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_content_created_by') THEN
        ALTER TABLE content ADD CONSTRAINT fk_content_created_by FOREIGN KEY (created_by_id) REFERENCES users (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_workshop_created_by') THEN
        ALTER TABLE workshop ADD CONSTRAINT fk_workshop_created_by FOREIGN KEY (created_by_id) REFERENCES users (id);
    END IF;
END $$;
