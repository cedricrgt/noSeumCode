-- V008: Seed student demo accounts and enrollments with different payment statuses

DO $$
DECLARE
    student_paid_id UUID;
    student_pending_id UUID;
    course1_id UUID := 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
    course2_id UUID := 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e';
BEGIN
    -- 1. Compte étudiant payé (Accès complet)
    SELECT id INTO student_paid_id FROM users WHERE email = 'student.paid@codebangers.fr' LIMIT 1;
    IF student_paid_id IS NULL THEN
        student_paid_id := gen_random_uuid();
        INSERT INTO users (
            id, user_name, first_name, last_name, email, password_hash, role, provider, created_at, updated_at, is_deleted, is_blocked
        ) VALUES (
            student_paid_id, 'student_paid', 'Lucas', 'Payé', 'student.paid@codebangers.fr',
            '$2a$10$w3U6Yd48Kkg8E8NfW7i5q.Yd6rP5PsqsD/0y2u0w.8M1xG7P5f0mC',
            'STUDENT', 'LOCAL', NOW() - INTERVAL '5 days', NOW(), false, false
        );
    END IF;

    -- 2. Compte étudiant en attente de paiement (Accès bloqué)
    SELECT id INTO student_pending_id FROM users WHERE email = 'student.pending@codebangers.fr' LIMIT 1;
    IF student_pending_id IS NULL THEN
        student_pending_id := gen_random_uuid();
        INSERT INTO users (
            id, user_name, first_name, last_name, email, password_hash, role, provider, created_at, updated_at, is_deleted, is_blocked
        ) VALUES (
            student_pending_id, 'student_pending', 'Alex', 'EnAttente', 'student.pending@codebangers.fr',
            '$2a$10$w3U6Yd48Kkg8E8NfW7i5q.Yd6rP5PsqsD/0y2u0w.8M1xG7P5f0mC',
            'STUDENT', 'LOCAL', NOW() - INTERVAL '2 days', NOW(), false, false
        );
    END IF;

    -- 3. Inscription de Lucas au Cours 1 avec statut PAID
    IF NOT EXISTS (SELECT 1 FROM enrollment WHERE user_id = student_paid_id AND course_id = course1_id) THEN
        INSERT INTO enrollment (id, user_id, course_id, enrolled_at, payment_status, progress)
        VALUES (
            gen_random_uuid(),
            student_paid_id,
            course1_id,
            NOW() - INTERVAL '5 days',
            'PAID',
            35
        );
    END IF;

    -- 4. Inscription d'Alex au Cours 1 avec statut PENDING
    IF NOT EXISTS (SELECT 1 FROM enrollment WHERE user_id = student_pending_id AND course_id = course1_id) THEN
        INSERT INTO enrollment (id, user_id, course_id, enrolled_at, payment_status, progress)
        VALUES (
            gen_random_uuid(),
            student_pending_id,
            course1_id,
            NOW() - INTERVAL '2 days',
            'PENDING',
            0
        );
    END IF;

END $$;
