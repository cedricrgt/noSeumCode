package com.codebangers.backend.course;

import com.codebangers.backend.course.controller.CourseController;
import com.codebangers.backend.course.dto.CourseRequest;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.security.CourseSecurity;
import com.codebangers.backend.course.service.CourseService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = CourseMethodSecurityTest.TestConfig.class)
class CourseMethodSecurityTest {

    @Configuration
    @EnableMethodSecurity
    static class TestConfig {
        @Bean
        public CourseService courseService() {
            return mock(CourseService.class);
        }

        @Bean
        public UserService userService() {
            return mock(UserService.class);
        }

        @Bean(name = "courseSecurity")
        public CourseSecurity courseSecurity() {
            return mock(CourseSecurity.class);
        }

        @Bean
        public CourseController courseController(CourseService courseService, UserService userService) {
            return new CourseController(courseService, userService);
        }
    }

    @Autowired
    private CourseController courseController;

    @Autowired
    private CourseSecurity courseSecurity;

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    private UUID courseId;
    private User admin;
    private User teacherA;
    private User teacherB;
    private User student;
    private Course course;

    @BeforeEach
    void setUp() {
        reset(courseSecurity, courseService, userService);

        courseId = UUID.randomUUID();

        admin = new User("admin", "Admin", "User", "admin@codebangers.fr", "hash", Role.ADMIN);
        admin.setId(UUID.randomUUID());

        teacherA = new User("teacher_a", "Teacher", "A", "teacher.a@codebangers.fr", "hash", Role.TEACHER);
        teacherA.setId(UUID.randomUUID());

        teacherB = new User("teacher_b", "Teacher", "B", "teacher.b@codebangers.fr", "hash", Role.TEACHER);
        teacherB.setId(UUID.randomUUID());

        student = new User("student", "Student", "User", "student@codebangers.fr", "hash", Role.STUDENT);
        student.setId(UUID.randomUUID());

        course = new Course("Test Course", "Description");
        course.setId(courseId);

        when(userService.getUserByEmail("admin@codebangers.fr")).thenReturn(Optional.of(admin));
        when(userService.getUserByEmail("teacher.a@codebangers.fr")).thenReturn(Optional.of(teacherA));
        when(userService.getUserByEmail("teacher.b@codebangers.fr")).thenReturn(Optional.of(teacherB));
        when(userService.getUserByEmail("student@codebangers.fr")).thenReturn(Optional.of(student));

        when(courseService.getCourseById(courseId)).thenReturn(Optional.of(course));
        when(courseService.updateCourse(eq(courseId), any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(course);
    }

    @Test
    @WithMockUser(username = "admin@codebangers.fr", roles = "ADMIN")
    @DisplayName("ADMIN role is allowed to update course directly")
    void adminCanUpdateCourse() {
        CourseRequest req = new CourseRequest();
        req.setTitle("Updated");

        assertDoesNotThrow(() -> courseController.updateCourse(courseId, req, null));
    }

    @Test
    @WithMockUser(username = "teacher.a@codebangers.fr", roles = "TEACHER")
    @DisplayName("Assigned TEACHER (@courseSecurity allows) is allowed to update course")
    void assignedTeacherCanUpdateCourse() {
        when(courseSecurity.canManageCourse(eq(courseId), any())).thenReturn(true);

        CourseRequest req = new CourseRequest();
        req.setTitle("Updated");

        assertDoesNotThrow(() -> courseController.updateCourse(courseId, req, null));
    }

    @Test
    @WithMockUser(username = "teacher.b@codebangers.fr", roles = "TEACHER")
    @DisplayName("Unassigned TEACHER (@courseSecurity denies) receives AccessDeniedException (403 Forbidden)")
    void unassignedTeacherIsForbiddenFromUpdatingCourse() {
        when(courseSecurity.canManageCourse(eq(courseId), any())).thenReturn(false);

        CourseRequest req = new CourseRequest();
        req.setTitle("Updated");

        assertThrows(AccessDeniedException.class, () ->
                courseController.updateCourse(courseId, req, null)
        );
    }

    @Test
    @WithMockUser(username = "student@codebangers.fr", roles = "STUDENT")
    @DisplayName("STUDENT role receives AccessDeniedException (403 Forbidden) on course update")
    void studentIsForbiddenFromUpdatingCourse() {
        when(courseSecurity.canManageCourse(eq(courseId), any())).thenReturn(false);

        CourseRequest req = new CourseRequest();
        req.setTitle("Updated");

        assertThrows(AccessDeniedException.class, () ->
                courseController.updateCourse(courseId, req, null)
        );
    }

    @Test
    @WithMockUser(username = "teacher.b@codebangers.fr", roles = "TEACHER")
    @DisplayName("Unassigned TEACHER (@courseSecurity denies) receives AccessDeniedException (403 Forbidden) on course delete")
    void unassignedTeacherIsForbiddenFromDeletingCourse() {
        when(courseSecurity.canManageCourse(eq(courseId), any())).thenReturn(false);

        assertThrows(AccessDeniedException.class, () ->
                courseController.softDeleteCourse(courseId, null)
        );
    }

    @Test
    @WithMockUser(username = "teacher.a@codebangers.fr", roles = "TEACHER")
    @DisplayName("Assigned TEACHER (@courseSecurity allows) is allowed to delete course")
    void assignedTeacherCanDeleteCourse() {
        when(courseSecurity.canManageCourse(eq(courseId), any())).thenReturn(true);

        assertDoesNotThrow(() ->
                courseController.softDeleteCourse(courseId, null)
        );
    }

    @Test
    @WithMockUser(username = "teacher.a@codebangers.fr", roles = "TEACHER")
    @DisplayName("TEACHER role is forbidden from calling Admin assignTeacherToCourse endpoint (403 Forbidden)")
    void teacherForbiddenFromAssigningTeacherEndpoint() {
        UUID teacherToAssign = UUID.randomUUID();

        assertThrows(AccessDeniedException.class, () ->
                courseController.assignTeacherToCourse(courseId, teacherToAssign, null)
        );
    }

    @Test
    @WithMockUser(username = "teacher.a@codebangers.fr", roles = "TEACHER")
    @DisplayName("TEACHER role is forbidden from calling Admin removeTeacherFromCourse endpoint (403 Forbidden)")
    void teacherForbiddenFromRemovingTeacherEndpoint() {
        UUID teacherToRemove = UUID.randomUUID();

        assertThrows(AccessDeniedException.class, () ->
                courseController.removeTeacherFromCourse(courseId, teacherToRemove)
        );
    }

    @Test
    @WithMockUser(username = "admin@codebangers.fr", roles = "ADMIN")
    @DisplayName("ADMIN role is allowed to assign teachers to course")
    void adminAllowedToAssignTeacher() {
        UUID teacherToAssign = UUID.randomUUID();
        when(courseService.assignTeacherToCourse(eq(courseId), eq(teacherToAssign), any()))
                .thenReturn(course);

        assertDoesNotThrow(() ->
                courseController.assignTeacherToCourse(courseId, teacherToAssign, null)
        );
    }
}
