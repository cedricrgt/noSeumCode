-- V020: Create course_teacher junction table for teacher assignment
CREATE TABLE IF NOT EXISTS course_teacher (
    course_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    assigned_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    assigned_by_id UUID,
    CONSTRAINT pk_course_teacher PRIMARY KEY (course_id, teacher_id),
    CONSTRAINT fk_course_teacher_course FOREIGN KEY (course_id) REFERENCES course (id) ON DELETE CASCADE,
    CONSTRAINT fk_course_teacher_teacher FOREIGN KEY (teacher_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_course_teacher_assigned_by FOREIGN KEY (assigned_by_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_course_teacher_teacher_id ON course_teacher(teacher_id);
CREATE INDEX IF NOT EXISTS idx_course_teacher_course_id ON course_teacher(course_id);
