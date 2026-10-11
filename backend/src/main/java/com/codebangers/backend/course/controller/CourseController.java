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
@RequestMapping({"/api/courses", "/api/parcours"})
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

    @GetMapping("/slug/{slug}")
    public ResponseEntity<CourseResponse> getCourseBySlug(@PathVariable String slug) {
        return courseService.getCourseBySlug(slug)
            .map(course -> ResponseEntity.ok(mapToResponse(course)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-assigned-courses")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<CourseResponse>> getMyAssignedCourses(org.springframework.security.core.Authentication authentication) {
        User user = resolveUserFromAuth(authentication);
        List<Course> courses;
        if (user.getRole() == com.codebangers.backend.user.model.Role.ADMIN) {
            courses = courseService.getAssignedCoursesForTeacher(user.getId());
            if (courses.isEmpty()) {
                courses = courseService.getAllActiveCourses();
            }
        } else {
            courses = courseService.getAssignedCoursesForTeacher(user.getId());
        }
        List<CourseResponse> responses = courses.stream()
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request,
                                                       org.springframework.security.core.Authentication authentication) {
        User creator = resolveUserFromAuth(authentication);
        Course course = courseService.createCourse(
            request.getTitle(),
            request.getDescription(),
            request.getPriceInCents(),
            request.getCurrency(),
            request.getSlug(),
            request.getThumbnailUrl(),
            request.getLevel(),
            request.getIsPublished(),
            creator
        );
        return new ResponseEntity<>(mapToResponse(course), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @courseSecurity.canManageCourse(#id, authentication)")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable UUID id,
                                                       @Valid @RequestBody CourseRequest request,
                                                       org.springframework.security.core.Authentication authentication) {
        User updater = resolveUserFromAuth(authentication);
        Course course = courseService.updateCourse(
            id,
            request.getTitle(),
            request.getDescription(),
            request.getPriceInCents(),
            request.getCurrency(),
            request.getSlug(),
            request.getThumbnailUrl(),
            request.getLevel(),
            request.getIsPublished(),
            updater
        );
        return ResponseEntity.ok(mapToResponse(course));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @courseSecurity.canManageCourse(#id, authentication)")
    public ResponseEntity<Void> softDeleteCourse(@PathVariable UUID id, org.springframework.security.core.Authentication authentication) {
        User deleter = resolveUserFromAuth(authentication);
        courseService.softDeleteCourse(id, deleter);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/teachers/{teacherId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponse> assignTeacherToCourse(@PathVariable UUID id,
                                                                @PathVariable UUID teacherId,
                                                                org.springframework.security.core.Authentication authentication) {
        User admin = resolveUserFromAuth(authentication);
        Course updatedCourse = courseService.assignTeacherToCourse(id, teacherId, admin);
        return ResponseEntity.ok(mapToResponse(updatedCourse));
    }

    @DeleteMapping("/{id}/teachers/{teacherId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponse> removeTeacherFromCourse(@PathVariable UUID id,
                                                                  @PathVariable UUID teacherId) {
        Course updatedCourse = courseService.removeTeacherFromCourse(id, teacherId);
        return ResponseEntity.ok(mapToResponse(updatedCourse));
    }

    private User resolveUser(Jwt jwt) {
        String email = jwt.getSubject();
        return userService.getUserByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", email));
    }

    private User resolveUserFromAuth(org.springframework.security.core.Authentication authentication) {
        if (authentication == null) {
            authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        }
        if (authentication == null) {
            throw new IllegalArgumentException("Non authentifié");
        }
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            return resolveUser(jwt);
        }
        String name = authentication.getName();
        return userService.getUserByEmail(name)
            .or(() -> userService.getUserByUserName(name))
            .orElseThrow(() -> new ResourceNotFoundException("User", name));
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

        CourseResponse response = new CourseResponse(
            course.getId(),
            course.getTitle(),
            course.getDescription(),
            course.getCreatedAt(),
            course.getUpdatedAt(),
            createdByName,
            updatedByName,
            chaptersCount,
            course.getPriceInCents(),
            course.getCurrency(),
            course.getSlug(),
            course.getThumbnailUrl(),
            course.getLevel(),
            course.isPublished()
        );
        response.setRequiredTier(course.getRequiredTier() != null ? course.getRequiredTier() : com.codebangers.backend.course.model.CourseTier.STARTER);

        if (course.getAssignedTeachers() != null) {
            try {
                response.setAssignedTeachers(course.getAssignedTeachers().stream()
                    .map(t -> new com.codebangers.backend.course.dto.TeacherResponse(
                        t.getId(),
                        t.getFirstName(),
                        t.getLastName(),
                        t.getEmail(),
                        t.getUserName()
                    ))
                    .toList());
            } catch (Exception ignored) {
            }
        }

        return response;
    }
}
