package com.codebangers.backend.chapter.repository;

import com.codebangers.backend.chapter.model.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, UUID> {

    @Query("SELECT c FROM Chapter c JOIN FETCH c.course LEFT JOIN FETCH c.parent WHERE c.id = :id")
    Optional<Chapter> findByIdWithAssociations(@Param("id") UUID id);

    @Query("SELECT c FROM Chapter c JOIN FETCH c.course WHERE c.course.id = :courseId AND c.parent IS NULL ORDER BY c.position ASC")
    List<Chapter> findRootChaptersByCourseId(@Param("courseId") UUID courseId);

    @Query("SELECT c FROM Chapter c JOIN FETCH c.course WHERE c.course.id = :courseId ORDER BY c.position ASC")
    List<Chapter> findByCourseId(@Param("courseId") UUID courseId);

    @Query("SELECT c FROM Chapter c JOIN FETCH c.course JOIN FETCH c.parent WHERE c.parent.id = :parentId ORDER BY c.position ASC")
    List<Chapter> findSubChaptersByParentId(@Param("parentId") UUID parentId);

    @Query("SELECT c FROM Chapter c JOIN FETCH c.course WHERE c.course.id = :courseId AND c.deletedAt IS NULL")
    List<Chapter> findActiveByCourseId(@Param("courseId") UUID courseId);

    @Query("SELECT c FROM Chapter c JOIN FETCH c.course LEFT JOIN FETCH c.createdBy WHERE c.status = :status AND c.deletedAt IS NULL ORDER BY c.submittedAt ASC")
    List<Chapter> findByStatusWithCourse(@Param("status") com.codebangers.backend.course.model.ApprovalStatus status);

    @Query("SELECT c FROM Chapter c JOIN FETCH c.course WHERE c.course.id = :courseId AND c.status = com.codebangers.backend.course.model.ApprovalStatus.APPROVED AND c.deletedAt IS NULL ORDER BY c.position ASC")
    List<Chapter> findApprovedByCourseId(@Param("courseId") UUID courseId);
}
