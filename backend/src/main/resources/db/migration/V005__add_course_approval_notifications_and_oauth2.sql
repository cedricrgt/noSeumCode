-- V005: Add Course Approval Workflow, Notifications, and OAuth2 Support

DO $$
BEGIN
    -- 1. Users: OAuth2 and Profile fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'provider') THEN
        ALTER TABLE users ADD COLUMN provider VARCHAR(50) NOT NULL DEFAULT 'LOCAL';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'provider_id') THEN
        ALTER TABLE users ADD COLUMN provider_id VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url') THEN
        ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);
    END IF;

    -- Make password_hash nullable for OAuth2 users
    ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

    -- 2. Chapter: Approval Workflow fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapter' AND column_name = 'status') THEN
        ALTER TABLE chapter ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'APPROVED';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapter' AND column_name = 'rejection_reason') THEN
        ALTER TABLE chapter ADD COLUMN rejection_reason TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapter' AND column_name = 'submitted_at') THEN
        ALTER TABLE chapter ADD COLUMN submitted_at TIMESTAMP WITHOUT TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapter' AND column_name = 'reviewed_at') THEN
        ALTER TABLE chapter ADD COLUMN reviewed_at TIMESTAMP WITHOUT TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapter' AND column_name = 'reviewed_by_id') THEN
        ALTER TABLE chapter ADD COLUMN reviewed_by_id UUID;
    END IF;

    -- 3. Content: Approval Workflow fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'status') THEN
        ALTER TABLE content ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'APPROVED';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'rejection_reason') THEN
        ALTER TABLE content ADD COLUMN rejection_reason TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'submitted_at') THEN
        ALTER TABLE content ADD COLUMN submitted_at TIMESTAMP WITHOUT TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'reviewed_at') THEN
        ALTER TABLE content ADD COLUMN reviewed_at TIMESTAMP WITHOUT TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'reviewed_by_id') THEN
        ALTER TABLE content ADD COLUMN reviewed_by_id UUID;
    END IF;

    -- 4. Foreign Key Constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_chapter_reviewed_by') THEN
        ALTER TABLE chapter ADD CONSTRAINT fk_chapter_reviewed_by FOREIGN KEY (reviewed_by_id) REFERENCES users (id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_content_reviewed_by') THEN
        ALTER TABLE content ADD CONSTRAINT fk_content_reviewed_by FOREIGN KEY (reviewed_by_id) REFERENCES users (id);
    END IF;
END $$;

-- 5. Notification Table
CREATE TABLE IF NOT EXISTS notification (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id UUID,
    reference_type VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_notification_user') THEN
        ALTER TABLE notification ADD CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
    END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chapter_status ON chapter(status);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_notification_user_read ON notification(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notification_created_at ON notification(created_at DESC);
