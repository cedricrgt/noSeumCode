CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    deleted_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL,
    parent_id UUID,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_chapters_course FOREIGN KEY (course_id) REFERENCES courses (id),
    CONSTRAINT fk_chapters_parent FOREIGN KEY (parent_id) REFERENCES chapters (id)
);

CREATE TABLE IF NOT EXISTS contents (
    id UUID PRIMARY KEY,
    chapter_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    body TEXT,
    media_url VARCHAR(500),
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_contents_chapter FOREIGN KEY (chapter_id) REFERENCES chapters (id)
);

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    enrolled_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_enrollments_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses (id)
);

CREATE TABLE IF NOT EXISTS workshops (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITHOUT TIME ZONE,
    end_date TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    deleted_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS user_workshops (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    workshop_id UUID NOT NULL,
    registered_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    attended BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_user_workshops_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_user_workshops_workshop FOREIGN KEY (workshop_id) REFERENCES workshops (id)
);
