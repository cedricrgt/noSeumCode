package com.codebangers.backend.course.repository;

import com.codebangers.backend.course.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    @Query("SELECT c FROM Course c WHERE c.title = :title")
    Optional<Course> findByTitle(@Param("title") String title);

    @Query("SELECT c FROM Course c WHERE c.isDeleted = false ORDER BY c.createdAt DESC")
    List<Course> findAllActive();

    @Query("SELECT c FROM Course c WHERE c.isDeleted = false")
    List<Course> findAllNonDeleted();
}

