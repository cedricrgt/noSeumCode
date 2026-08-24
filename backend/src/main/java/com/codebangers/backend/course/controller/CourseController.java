package com.codebangers.backend.course.controller;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.dto.CourseRequest;
import com.codebangers.backend.course.dto.CourseResponse;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.service.CourseService;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final UserService userService;

    public CourseController(CourseService courseService, UserService userService) {
        this.courseService = courseService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> responses = courseService.getAllActiveCourses().stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CourseResponse>> getAllCoursesIncludingDeleted() {
        List<CourseResponse> responses = courseService.getAllNonDeletedCourses().stream()
            .map(this::mapToResponse)
            .toList();
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
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request,
                                                       @AuthenticationPrincipal Jwt jwt) {
        User creator = resolveUser(jwt);
        Course course = courseService.createCourse(request.getTitle(), request.getDescription(), creator);
        return new ResponseEntity<>(mapToResponse(course), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable UUID id,
                                                       @Valid @RequestBody CourseRequest request,
                                                       @AuthenticationPrincipal Jwt jwt) {
        User updater = resolveUser(jwt);
        Course course = courseService.updateCourse(id, request.getTitle(), request.getDescription(), updater);
        return ResponseEntity.ok(mapToResponse(course));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<Void> softDeleteCourse(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        User deleter = resolveUser(jwt);
        courseService.softDeleteCourse(id, deleter);
        return ResponseEntity.noContent().build();
    }

    private User resolveUser(Jwt jwt) {
        String email = jwt.getSubject();
        return userService.getUserByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", email));
    }

    private CourseResponse mapToResponse(Course course) {
        String createdByName = "Admin";
        if (course.getCreatedBy() != null) {
            createdByName = (course.getCreatedBy().getFirstName() != null ? course.getCreatedBy().getFirstName() + " " + (course.getCreatedBy().getLastName() != null ? course.getCreatedBy().getLastName() : "") : course.getCreatedBy().getUserName()).trim();
        }

        String updatedByName = createdByName;
        if (course.getUpdatedBy() != null) {
            updatedByName = (course.getUpdatedBy().getFirstName() != null ? course.getUpdatedBy().getFirstName() + " " + (course.getUpdatedBy().getLastName() != null ? course.getUpdatedBy().getLastName() : "") : course.getUpdatedBy().getUserName()).trim();
        }

        int chaptersCount = (course.getChapters() != null) ? course.getChapters().size() : 0;

        return new CourseResponse(
            course.getId(),
            course.getTitle(),
            course.getDescription(),
            course.getCreatedAt(),
            course.getUpdatedAt(),
            createdByName,
            updatedByName,
            chaptersCount
        );
    }
}
