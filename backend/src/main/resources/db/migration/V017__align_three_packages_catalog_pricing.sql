-- V017: Align 3 Packages catalog pricing & titles (Sprint 14 / ADR-013 / Briefing 2026-09)
DO $$
BEGIN
    -- 1. Align Pack Starter (c1) - 89 EUR
    UPDATE course
    SET slug = 'pack-starter',
        title = 'Pack Starter – Les Fondations du Web',
        description = 'Les fondations indispensables du web moderne : structure HTML5, design CSS3, Flexbox & Grid, responsive mobile et 2 projets portfolio complets.',
        price_in_cents = 8900,
        currency = 'EUR',
        level = 'DEBUTANT',
        required_tier = 'STARTER',
        updated_at = NOW()
    WHERE id = 'c1000000-0000-0000-0000-000000000001' OR slug = 'html-css' OR slug = 'pack-starter';

    -- 2. Align Pack Web Pro (c2) - 179 EUR
    UPDATE course
    SET slug = 'pack-web-pro',
        title = 'Pack Web Pro – L''Autonomie Complète',
        description = 'Deviens un développeur web frontend autonome : tout le Pack Starter + JavaScript ES6+, manipulation du DOM, requêtes API et bonus Git & GitHub offert.',
        price_in_cents = 17900,
        currency = 'EUR',
        level = 'INTERMEDIAIRE',
        required_tier = 'WEB',
        updated_at = NOW()
    WHERE id = 'c2000000-0000-0000-0000-000000000002' OR slug = 'javascript' OR slug = 'pack-web-pro' OR slug = 'pack-web';

    -- 3. Align Pack Mentorat VIP (c3) - 389 EUR
    UPDATE course
    SET slug = 'pack-mentorat-vip',
        title = 'Pack Mentorat VIP – L''Accompagnement Sur-Mesure',
        description = 'L''accélération ultime avec un formateur senior dédié : tout le Pack Web Pro + 4h de mentorat individuel en visio, revues de code et coaching carrière.',
        price_in_cents = 38900,
        currency = 'EUR',
        level = 'ACCOMPAGNE',
        required_tier = 'VIP',
        updated_at = NOW()
    WHERE id = 'c3000000-0000-0000-0000-000000000003' OR slug = 'pack-mentorat-vip' OR slug = 'git-github';

END $$;
