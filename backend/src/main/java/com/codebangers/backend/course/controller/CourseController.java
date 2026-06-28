package com.codebangers.backend.course.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.service.CourseService;

import java.util.UUID;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // GET /api/users - Liste tous les utilisateurs
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    // GET /api/courses/{id} - Récupère un utilisateur spécifique
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable UUID id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/users - Crée un utilisateur
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Course course) {
        try {
            Course createdCourse = courseService.createCourse(course);
            return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
