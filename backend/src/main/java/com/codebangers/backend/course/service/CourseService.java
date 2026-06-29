package com.codebangers.backend.course.service;

import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Transactional(readOnly = true)
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Course> getAllActiveCourses() {
        return courseRepository.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<Course> getAllNonDeletedCourses() {
        return courseRepository.findAllNonDeleted();
    }

    @Transactional(readOnly = true)
    public Optional<Course> getCourseById(UUID id) {
        return courseRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Course> getCourseByTitle(String title) {
        return courseRepository.findByTitle(title);
    }

    public Course createCourse(String title, String description) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Course title cannot be empty");
        }

        // Check for duplicate title
        if (courseRepository.findByTitle(title).isPresent()) {
            throw new IllegalArgumentException("Course with this title already exists");
        }

        Course course = new Course(title, description);
        return courseRepository.save(course);
    }

    public Course updateCourse(UUID courseId, String title, String description) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        if (title != null && !title.isBlank()) {
            // Check if new title conflicts with existing course
            Optional<Course> existing = courseRepository.findByTitle(title);
            if (existing.isPresent() && !existing.get().getId().equals(courseId)) {
                throw new IllegalArgumentException("Course with this title already exists");
            }
            course.setTitle(title);
        }

        if (description != null) {
            course.setDescription(description);
        }

        return courseRepository.save(course);
    }

    public void softDeleteCourse(UUID courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        course.setDeleted(true);
        course.setDeletedAt(LocalDateTime.now());
        courseRepository.save(course);
    }

    public void deleteCourse(UUID courseId) {
        courseRepository.deleteById(courseId);
    }
}