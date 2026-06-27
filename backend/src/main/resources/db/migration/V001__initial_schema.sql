CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_by_id UUID,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    deleted_by_id UUID,
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    blocked_at TIMESTAMP WITHOUT TIME ZONE,
    blocked_by_id UUID
);

ALTER TABLE users ADD CONSTRAINT fk_user_updated_by FOREIGN KEY (updated_by_id) REFERENCES users (id);
ALTER TABLE users ADD CONSTRAINT fk_user_deleted_by FOREIGN KEY (deleted_by_id) REFERENCES users (id);
ALTER TABLE users ADD CONSTRAINT fk_user_blocked_by FOREIGN KEY (blocked_by_id) REFERENCES users (id);
