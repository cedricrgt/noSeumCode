package com.codebangers.backend.course.service;

import com.codebangers.backend.config.exception.DuplicateResourceException;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.user.model.User;
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

    public Course createCourse(String title, String description, User createdBy) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Course title cannot be empty");
        }

        if (courseRepository.findByTitle(title).isPresent()) {
            throw new DuplicateResourceException("Course with this title already exists");
        }

        Course course = new Course(title, description);
        course.setCreatedBy(createdBy);
        return courseRepository.save(course);
    }

    public Course updateCourse(UUID courseId, String title, String description, User updatedBy) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course", courseId));

        if (title != null && !title.isBlank()) {
            Optional<Course> existing = courseRepository.findByTitle(title);
            if (existing.isPresent() && !existing.get().getId().equals(courseId)) {
                throw new DuplicateResourceException("Course with this title already exists");
            }
            course.setTitle(title);
        }

        if (description != null) {
            course.setDescription(description);
        }

        course.setUpdatedBy(updatedBy);
        return courseRepository.save(course);
    }

    public void softDeleteCourse(UUID courseId, User deletedBy) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course", courseId));

        course.setDeleted(true);
        course.setDeletedAt(LocalDateTime.now());
        course.setDeletedBy(deletedBy);
        courseRepository.save(course);
    }

    public void deleteCourse(UUID courseId) {
        courseRepository.deleteById(courseId);
    }
}