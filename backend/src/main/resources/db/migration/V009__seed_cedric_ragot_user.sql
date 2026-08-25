-- V009: Seed user account for cedric.ragot.paris@gmail.com and enroll in active courses

DO $$
DECLARE
    cedric_id UUID;
    course1_id UUID := 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
    course2_id UUID := 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e';
BEGIN
    SELECT id INTO cedric_id FROM users WHERE email = 'cedric.ragot.paris@gmail.com' LIMIT 1;
    IF cedric_id IS NULL THEN
        cedric_id := gen_random_uuid();
        INSERT INTO users (
            id, user_name, first_name, last_name, email, password_hash, role, provider, created_at, updated_at, is_deleted, is_blocked
        ) VALUES (
            cedric_id, 'cedricragot', 'Cédric', 'Ragot', 'cedric.ragot.paris@gmail.com',
            '$2a$10$w3U6Yd48Kkg8E8NfW7i5q.Yd6rP5PsqsD/0y2u0w.8M1xG7P5f0mC',
            'STUDENT', 'LOCAL', NOW() - INTERVAL '3 days', NOW(), false, false
        );
    END IF;

    -- Inscription Cours 1 avec statut PAID
    IF EXISTS (SELECT 1 FROM course WHERE id = course1_id) AND NOT EXISTS (SELECT 1 FROM enrollment WHERE user_id = cedric_id AND course_id = course1_id) THEN
        INSERT INTO enrollment (id, user_id, course_id, enrolled_at, payment_status, progress)
        VALUES (
            gen_random_uuid(),
            cedric_id,
            course1_id,
            NOW() - INTERVAL '3 days',
            'PAID',
            25
        );
    END IF;

    -- Inscription Cours 2 avec statut PAID
    IF EXISTS (SELECT 1 FROM course WHERE id = course2_id) AND NOT EXISTS (SELECT 1 FROM enrollment WHERE user_id = cedric_id AND course_id = course2_id) THEN
        INSERT INTO enrollment (id, user_id, course_id, enrolled_at, payment_status, progress)
        VALUES (
            gen_random_uuid(),
            cedric_id,
            course2_id,
            NOW() - INTERVAL '3 days',
            'PAID',
            10
        );
    END IF;

END $$;
