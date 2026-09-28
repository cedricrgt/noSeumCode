-- V016: Add Discord Integration Fields to Users (Sprint 11)

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'discord_user_id') THEN
        ALTER TABLE users ADD COLUMN discord_user_id VARCHAR(50);
        CREATE INDEX idx_users_discord_user_id ON users(discord_user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'discord_username') THEN
        ALTER TABLE users ADD COLUMN discord_username VARCHAR(100);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'discord_avatar') THEN
        ALTER TABLE users ADD COLUMN discord_avatar VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'discord_linked_at') THEN
        ALTER TABLE users ADD COLUMN discord_linked_at TIMESTAMP WITHOUT TIME ZONE;
    END IF;
END $$;
