-- V015: Transform course 3 into Pack Mentorat VIP and align titles & tiers (ADR-013 & ADR-014)
DO $$
DECLARE
    admin_id UUID;
    course_vip_id UUID := 'c3000000-0000-0000-0000-000000000003';
BEGIN
    SELECT id INTO admin_id FROM users WHERE role = 'ADMIN' OR email = 'admin@codebangers.fr' LIMIT 1;

    -- 1. Align Starter Pack Fondations (c1)
    UPDATE course
    SET title = 'Starter Pack Fondations – HTML5, CSS3 & Git',
        description = 'Apprends à structurer tes pages en HTML5 sémantique et à créer des designs modernes, responsives et accessibles avec CSS3, Flexbox, Grid et la maîtrise de Git.',
        price_in_cents = 27900,
        currency = 'EUR',
        level = 'DEBUTANT',
        required_tier = 'STARTER',
        updated_at = NOW()
    WHERE id = 'c1000000-0000-0000-0000-000000000001' OR slug = 'html-css';

    -- 2. Align Pack Dynamique (c2)
    UPDATE course
    SET title = 'Pack Dynamique – JavaScript ES6+ & APIs REST',
        description = 'Donne vie à tes créations web : manipulation du DOM, requêtes API asynchrones, animations dynamiques et logique applicative complète en cohortes de 6 élèves max.',
        price_in_cents = 57900,
        currency = 'EUR',
        level = 'INTERMEDIAIRE',
        required_tier = 'WEB',
        updated_at = NOW()
    WHERE id = 'c2000000-0000-0000-0000-000000000002' OR slug = 'javascript';

    -- 3. Transform c3 into Pack Mentorat VIP (c3)
    UPDATE course
    SET slug = 'pack-mentorat-vip',
        title = 'Pack Mentorat VIP – Coaching Individuel & Accompagnement Sur Mesure',
        description = 'L''excellence NoSeumCode : Tout le Pack Dynamique (HTML/CSS, JS, APIs) plus 4 heures de coaching individuel 1-to-1 avec Cédric Ragot, revues de code dédiées et préparation aux entretiens techniques.',
        price_in_cents = 87900,
        currency = 'EUR',
        level = 'AVANCE',
        required_tier = 'VIP',
        thumbnail_url = 'images/courses/vip.webp',
        updated_at = NOW()
    WHERE id = course_vip_id OR slug = 'git-github';

    -- Mettre à jour les titres des chapitres de c3 pour le Pack VIP
    UPDATE chapter
    SET title = '1. Diagnostic de Compétences & Roadmap Personnalisée (Aperçu)'
    WHERE id = 'c3000001-0000-0000-0000-000000000001';

    UPDATE chapter
    SET title = '2. Coaching 1-to-1 & Revues de Code en Direct (4h)'
    WHERE id = 'c3000002-0000-0000-0000-000000000002';

    UPDATE chapter
    SET title = '3. Immersion Portfolio & Préparation aux Entretiens Tech'
    WHERE id = 'c3000003-0000-0000-0000-000000000003';

END $$;
