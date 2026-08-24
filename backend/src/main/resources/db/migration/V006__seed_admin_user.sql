-- V006: Seed or Update Default Administrator Account
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE email = 'admin@codebangers.fr') THEN
        UPDATE users
        SET role = 'ADMIN',
            password_hash = '$2a$10$w3U6Yd48Kkg8E8NfW7i5q.Yd6rP5PsqsD/0y2u0w.8M1xG7P5f0mC',
            user_name = 'admin',
            first_name = 'Admin',
            last_name = 'CodeBangers',
            updated_at = NOW()
        WHERE email = 'admin@codebangers.fr';
    ELSIF EXISTS (SELECT 1 FROM users WHERE user_name = 'admin') THEN
        UPDATE users
        SET role = 'ADMIN',
            email = 'admin@codebangers.fr',
            password_hash = '$2a$10$w3U6Yd48Kkg8E8NfW7i5q.Yd6rP5PsqsD/0y2u0w.8M1xG7P5f0mC',
            first_name = 'Admin',
            last_name = 'CodeBangers',
            updated_at = NOW()
        WHERE user_name = 'admin';
    ELSE
        INSERT INTO users (
            id,
            user_name,
            first_name,
            last_name,
            email,
            password_hash,
            role,
            provider,
            created_at,
            updated_at,
            is_deleted,
            is_blocked
        ) VALUES (
            gen_random_uuid(),
            'admin',
            'Admin',
            'CodeBangers',
            'admin@codebangers.fr',
            '$2a$10$w3U6Yd48Kkg8E8NfW7i5q.Yd6rP5PsqsD/0y2u0w.8M1xG7P5f0mC',
            'ADMIN',
            'LOCAL',
            NOW(),
            NOW(),
            false,
            false
        );
    END IF;
END $$;

