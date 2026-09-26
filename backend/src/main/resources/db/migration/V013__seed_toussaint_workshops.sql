-- V013: Seed Toussaint Discovery Workshops (Sprint 6)
-- Free 2-hour interactive live sessions with strict capacity limit of 6 students per session

INSERT INTO workshop (id, title, theme, description, max_participants, start_date, end_date, created_at, updated_at, is_deleted)
VALUES
(
    'w1000000-0000-0000-0000-000000000001',
    'HTML & CSS — Crée ta première page Web en direct',
    'HTML & CSS',
    'Découvre les balises sémantiques, le style moderne avec Flexbox, et construis ta première page web responsive guidé pas à pas par ton mentor. Zéro prérequis.',
    6,
    '2026-10-26 10:00:00',
    '2026-10-26 12:00:00',
    NOW(),
    NOW(),
    false
),
(
    'w1000000-0000-0000-0000-000000000002',
    'JavaScript — Donne vie à ton code & anime le DOM',
    'JavaScript',
    'Passe à l''action avec JavaScript : variables, fonctions, événements et manipulation dynamique du DOM pour créer une application interactive et réactive.',
    6,
    '2026-10-27 10:00:00',
    '2026-10-27 12:00:00',
    NOW(),
    NOW(),
    false
),
(
    'w1000000-0000-0000-0000-000000000003',
    'Git & GitHub — Maîtrise le versioning comme un pro',
    'Git & GitHub',
    'Apprends à utiliser Git comme les développeurs en entreprise : commits propres, branches, gestion des conflits et hébergement de ton code sur GitHub.',
    6,
    '2026-10-28 10:00:00',
    '2026-10-28 12:00:00',
    NOW(),
    NOW(),
    false
),
(
    'w1000000-0000-0000-0000-000000000004',
    'Mini-Projet Guidé — Code ton premier portfolio interactif',
    'Mini-Projet Guidé',
    'Mets en pratique toutes les compétences acquises lors d''un atelier immersif de 2h : construis et personnalise ton portfolio en direct avec retours instantanés du mentor.',
    6,
    '2026-10-29 10:00:00',
    '2026-10-29 12:00:00',
    NOW(),
    NOW(),
    false
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    theme = EXCLUDED.theme,
    description = EXCLUDED.description,
    max_participants = EXCLUDED.max_participants,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = NOW();
