package com.codebangers.backend.course.controller;

import com.codebangers.backend.course.dto.CourseRequest;
import com.codebangers.backend.course.dto.CourseResponse;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<Course> courses = courseService.getAllActiveCourses();
        List<CourseResponse> responses = courses.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CourseResponse>> getAllCoursesIncludingDeleted() {
        List<Course> courses = courseService.getAllNonDeletedCourses();
        List<CourseResponse> responses = courses.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable UUID id) {
        return courseService.getCourseById(id)
            .map(course -> ResponseEntity.ok(mapToResponse(course)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> createCourse(@RequestBody CourseRequest request) {
        try {
            if (request.getTitle() == null || request.getTitle().isBlank()) {
                return ResponseEntity.badRequest().body("Course title is required");
            }
            Course course = courseService.createCourse(request.getTitle(), request.getDescription());
            return new ResponseEntity<>(mapToResponse(course), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> updateCourse(@PathVariable UUID id, @RequestBody CourseRequest request) {
        try {
            Course course = courseService.updateCourse(id, request.getTitle(), request.getDescription());
            return ResponseEntity.ok(mapToResponse(course));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> softDeleteCourse(@PathVariable UUID id) {
        try {
            courseService.softDeleteCourse(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private CourseResponse mapToResponse(Course course) {
        return new CourseResponse(
            course.getId(),
            course.getTitle(),
            course.getDescription(),
            course.getCreatedAt(),
            course.getUpdatedAt()
        );
    }
}
