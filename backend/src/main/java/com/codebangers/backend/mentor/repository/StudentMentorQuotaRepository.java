package com.codebangers.backend.mentor.repository;

import com.codebangers.backend.mentor.model.StudentMentorQuota;
import com.codebangers.backend.mentor.model.StudentMentorQuotaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface StudentMentorQuotaRepository extends JpaRepository<StudentMentorQuota, StudentMentorQuotaId> {
    List<StudentMentorQuota> findByStudentId(UUID studentId);
}
