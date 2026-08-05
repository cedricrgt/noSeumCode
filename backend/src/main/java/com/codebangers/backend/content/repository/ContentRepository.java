package com.codebangers.backend.content.repository;

import com.codebangers.backend.content.model.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContentRepository extends JpaRepository<Content, UUID> {

    @Query("SELECT c FROM Content c WHERE c.chapter.id = :chapterId ORDER BY c.position ASC")
    List<Content> findByChapterId(@Param("chapterId") UUID chapterId);

    @Query("SELECT c FROM Content c WHERE c.chapter.id = :chapterId AND c.deletedAt IS NULL ORDER BY c.position ASC")
    List<Content> findActiveByChapterId(@Param("chapterId") UUID chapterId);
}
