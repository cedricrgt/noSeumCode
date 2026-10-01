-- V018: Add Suivi Mentor add-on and modify Cohort table

-- 1. Modifying cohort table (acting as cohort_module)
ALTER TABLE cohort ADD COLUMN mentor_slots_total INT NOT NULL DEFAULT 3;
ALTER TABLE cohort ADD COLUMN mentor_slots_remaining INT NOT NULL DEFAULT 3;
ALTER TABLE cohort ADD COLUMN session_1_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Create student_mentor_quota table
CREATE TABLE student_mentor_quota (
    student_id UUID NOT NULL REFERENCES users(id),
    cohort_id UUID NOT NULL REFERENCES cohort(id),
    sessions_total INT NOT NULL,
    sessions_used INT NOT NULL DEFAULT 0,
    sessions_available_phase_current INT NOT NULL DEFAULT 0,
    sessions_reserved_phase_next INT NOT NULL DEFAULT 0,
    mentor_halfway_warning_shown BOOLEAN NOT NULL DEFAULT FALSE,
    last_recalculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (student_id, cohort_id)
);

-- 3. Create student_mentor_sessions table
CREATE TABLE student_mentor_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id),
    cohort_id UUID NOT NULL REFERENCES cohort(id),
    session_phase VARCHAR(50) NOT NULL, -- 'html_css' or 'js'
    session_number INT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending' | 'scheduled' | 'done'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Update Pack pricing to match briefing
-- Pack Starter: 299 EUR (instead of 89 EUR)
UPDATE course SET price_in_cents = 29900, updated_at = NOW() WHERE slug = 'pack-starter';
-- Pack Web Pro: 449 EUR (instead of 179 EUR)
UPDATE course SET price_in_cents = 44900, updated_at = NOW() WHERE slug = 'pack-web-pro';
