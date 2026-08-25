-- V010: Purge all non-admin users and retain only the default administrator account

DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- 1. Trouver ou s'assurer de l'existence du compte Administrateur
    SELECT id INTO admin_id FROM users WHERE email = 'admin@codebangers.fr' LIMIT 1;
    IF admin_id IS NULL THEN
        SELECT id INTO admin_id FROM users WHERE role = 'ADMIN' LIMIT 1;
    END IF;

    -- Si aucun compte admin n'existe, en créer un
    IF admin_id IS NULL THEN
        admin_id := gen_random_uuid();
        INSERT INTO users (
            id, user_name, first_name, last_name, email, password_hash, role, provider, created_at, updated_at, is_deleted, is_blocked
        ) VALUES (
            admin_id, 'admin', 'Admin', 'CodeBangers', 'admin@codebangers.fr',
            '$2a$10$w3U6Yd48Kkg8E8NfW7i5q.Yd6rP5PsqsD/0y2u0w.8M1xG7P5f0mC',
            'ADMIN', 'LOCAL', NOW(), NOW(), false, false
        );
    END IF;

    -- 2. Réassigner toutes les références de clés étrangères vers l'administrateur
    UPDATE course SET created_by_id = admin_id WHERE created_by_id != admin_id OR created_by_id IS NULL;
    UPDATE course SET updated_by_id = admin_id WHERE updated_by_id IS NOT NULL AND updated_by_id != admin_id;
    UPDATE course SET deleted_by_id = NULL WHERE deleted_by_id IS NOT NULL AND deleted_by_id != admin_id;

    UPDATE chapter SET created_by_id = admin_id WHERE created_by_id != admin_id OR created_by_id IS NULL;
    UPDATE chapter SET updated_by_id = admin_id WHERE updated_by_id IS NOT NULL AND updated_by_id != admin_id;
    UPDATE chapter SET reviewed_by_id = admin_id WHERE reviewed_by_id IS NOT NULL AND reviewed_by_id != admin_id;
    UPDATE chapter SET deleted_by_id = NULL WHERE deleted_by_id IS NOT NULL AND deleted_by_id != admin_id;

    UPDATE content SET created_by_id = admin_id WHERE created_by_id IS NOT NULL AND created_by_id != admin_id;
    UPDATE content SET updated_by_id = admin_id WHERE updated_by_id IS NOT NULL AND updated_by_id != admin_id;
    UPDATE content SET reviewed_by_id = admin_id WHERE reviewed_by_id IS NOT NULL AND reviewed_by_id != admin_id;
    UPDATE content SET deleted_by_id = NULL WHERE deleted_by_id IS NOT NULL AND deleted_by_id != admin_id;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workshop') THEN
        UPDATE workshop SET created_by_id = admin_id WHERE created_by_id IS NOT NULL AND created_by_id != admin_id;
        UPDATE workshop SET updated_by_id = admin_id WHERE updated_by_id IS NOT NULL AND updated_by_id != admin_id;
        UPDATE workshop SET deleted_by_id = NULL WHERE deleted_by_id IS NOT NULL AND deleted_by_id != admin_id;
    END IF;

    UPDATE users SET created_by_id = NULL WHERE created_by_id IS NOT NULL;
    UPDATE users SET updated_by_id = NULL WHERE updated_by_id IS NOT NULL;
    UPDATE users SET deleted_by_id = NULL WHERE deleted_by_id IS NOT NULL;
    UPDATE users SET blocked_by_id = NULL WHERE blocked_by_id IS NOT NULL;

    -- 3. Supprimer les inscriptions et données liées aux autres utilisateurs
    DELETE FROM enrollment WHERE user_id != admin_id;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_workshop') THEN
        DELETE FROM user_workshop WHERE user_id != admin_id;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notification') THEN
        DELETE FROM notification WHERE user_id != admin_id;
    END IF;

    -- 4. Supprimer tous les utilisateurs sauf l'administrateur
    DELETE FROM users WHERE id != admin_id AND email != 'admin@codebangers.fr';

END $$;
