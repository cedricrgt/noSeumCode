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

<<<<<<< HEAD
    @Query("SELECT c FROM Course c WHERE c.slug = :slug AND c.isDeleted = false")
    Optional<Course> findBySlug(@Param("slug") String slug);

=======
>>>>>>> main
    @Query("SELECT c FROM Course c WHERE c.isDeleted = false ORDER BY c.createdAt DESC")
    List<Course> findAllActive();

    @Query("SELECT c FROM Course c WHERE c.isDeleted = false")
    List<Course> findAllNonDeleted();
<<<<<<< HEAD

    @Query("SELECT DISTINCT c FROM Course c " +
           "LEFT JOIN FETCH c.assignedTeachers t " +
           "LEFT JOIN FETCH c.createdBy " +
           "LEFT JOIN FETCH c.updatedBy " +
           "WHERE t.id = :teacherId AND (c.isDeleted = false OR c.isDeleted IS NULL) " +
           "ORDER BY c.createdAt DESC")
    List<Course> findAllByAssignedTeachersId(@Param("teacherId") UUID teacherId);

    @Query("SELECT DISTINCT c FROM Course c " +
           "LEFT JOIN FETCH c.assignedTeachers t " +
           "LEFT JOIN FETCH c.createdBy " +
           "LEFT JOIN FETCH c.updatedBy " +
           "WHERE t.id = :teacherId AND (c.isDeleted = false OR c.isDeleted IS NULL)")
    List<Course> findAllByAssignedTeacherId(@Param("teacherId") UUID teacherId);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Course c JOIN c.assignedTeachers t WHERE c.id = :courseId AND t.id = :teacherId AND (c.isDeleted = false OR c.isDeleted IS NULL)")
    boolean isTeacherAssignedToCourse(@Param("courseId") UUID courseId, @Param("teacherId") UUID teacherId);
=======
>>>>>>> main
}

