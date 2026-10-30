package com.codebangers.backend.mentor.repository;

import com.codebangers.backend.mentor.model.StudentMentorSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface StudentMentorSessionRepository extends JpaRepository<StudentMentorSession, UUID> {
    List<StudentMentorSession> findByStudentId(UUID studentId);
}
