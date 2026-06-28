package com.codebangers.backend.course.repository;

import com.codebangers.backend.course.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    Optional<Course> findByCourseTitle(String courseTitle);

    Optional<Course> findById(UUID id);

}
