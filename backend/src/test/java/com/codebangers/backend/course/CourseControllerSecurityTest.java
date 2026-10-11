package com.codebangers.backend.course;

import com.codebangers.backend.course.controller.CourseController;
import com.codebangers.backend.course.dto.CourseRequest;
import com.codebangers.backend.course.dto.CourseResponse;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.security.CourseSecurity;
import com.codebangers.backend.course.service.CourseService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class CourseControllerSecurityTest {

    private CourseService courseService;
    private UserService userService;
    private CourseSecurity courseSecurity;
    private CourseController courseController;

    private User admin;
    private User teacherA;
    private User teacherB;
    private User student;
    private Course courseA;
    private Course courseB;

    @BeforeEach
    void setUp() {
        courseService = mock(CourseService.class);
        userService = mock(UserService.class);
        courseSecurity = mock(CourseSecurity.class);

        courseController = new CourseController(courseService, userService);

        admin = new User("admin", "Admin", "User", "admin@codebangers.fr", "hash", Role.ADMIN);
        admin.setId(UUID.randomUUID());

        teacherA = new User("teacher_a", "Teacher", "Alpha", "teacher.a@codebangers.fr", "hash", Role.TEACHER);
        teacherA.setId(UUID.randomUUID());

        teacherB = new User("teacher_b", "Teacher", "Beta", "teacher.b@codebangers.fr", "hash", Role.TEACHER);
        teacherB.setId(UUID.randomUUID());

        student = new User("student", "Student", "User", "student@codebangers.fr", "hash", Role.STUDENT);
        student.setId(UUID.randomUUID());

        courseA = new Course("Cours Alpha", "Description Alpha");
        courseA.setId(UUID.randomUUID());
        courseA.addTeacher(teacherA);

        courseB = new Course("Cours Beta", "Description Beta");
        courseB.setId(UUID.randomUUID());
        courseB.addTeacher(teacherB);

        when(userService.getUserByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(userService.getUserByEmail(teacherA.getEmail())).thenReturn(Optional.of(teacherA));
        when(userService.getUserByEmail(teacherB.getEmail())).thenReturn(Optional.of(teacherB));
        when(userService.getUserByEmail(student.getEmail())).thenReturn(Optional.of(student));

        when(userService.getUserByUserName(admin.getUserName())).thenReturn(Optional.of(admin));
        when(userService.getUserByUserName(teacherA.getUserName())).thenReturn(Optional.of(teacherA));
        when(userService.getUserByUserName(teacherB.getUserName())).thenReturn(Optional.of(teacherB));
        when(userService.getUserByUserName(student.getUserName())).thenReturn(Optional.of(student));
    }

    private Authentication mockAuth(User user, String roleName) {
        Authentication auth = mock(Authentication.class);
        doReturn(List.of(new SimpleGrantedAuthority(roleName))).when(auth).getAuthorities();
        when(auth.getName()).thenReturn(user.getEmail());

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(user.getEmail());
        when(jwt.getClaimAsString("userId")).thenReturn(user.getId().toString());
        when(auth.getPrincipal()).thenReturn(jwt);

        return auth;
    }

    // --- 1. GET /api/courses/my-assigned-courses ---

    @Test
    @DisplayName("Teacher A retrieves only their assigned courses")
    void teacherRetrievesOnlyAssignedCourses() {
        when(courseService.getAssignedCoursesForTeacher(teacherA.getId())).thenReturn(List.of(courseA));

        Authentication auth = mockAuth(teacherA, "ROLE_TEACHER");
        ResponseEntity<List<CourseResponse>> response = courseController.getMyAssignedCourses(auth);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals(courseA.getId(), response.getBody().get(0).getId());
        verify(courseService).getAssignedCoursesForTeacher(teacherA.getId());
    }

    @Test
    @DisplayName("Teacher with no assigned courses receives an empty list")
    void teacherWithNoCoursesReceivesEmptyList() {
        when(courseService.getAssignedCoursesForTeacher(teacherB.getId())).thenReturn(List.of());

        Authentication auth = mockAuth(teacherB, "ROLE_TEACHER");
        ResponseEntity<List<CourseResponse>> response = courseController.getMyAssignedCourses(auth);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    @DisplayName("Admin retrieves all active courses if none specifically assigned")
    void adminRetrievesAllActiveCoursesFallback() {
        when(courseService.getAssignedCoursesForTeacher(admin.getId())).thenReturn(List.of());
        when(courseService.getAllActiveCourses()).thenReturn(List.of(courseA, courseB));

        Authentication auth = mockAuth(admin, "ROLE_ADMIN");
        ResponseEntity<List<CourseResponse>> response = courseController.getMyAssignedCourses(auth);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
    }

    // --- 2. Admin assign & remove endpoints ---

    @Test
    @DisplayName("Admin assigns teacher to course successfully")
    void adminAssignsTeacherToCourse() {
        when(courseService.assignTeacherToCourse(eq(courseA.getId()), eq(teacherB.getId()), any(User.class)))
            .thenReturn(courseA);

        Authentication auth = mockAuth(admin, "ROLE_ADMIN");
        ResponseEntity<CourseResponse> response = courseController.assignTeacherToCourse(courseA.getId(), teacherB.getId(), auth);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(courseService).assignTeacherToCourse(eq(courseA.getId()), eq(teacherB.getId()), any(User.class));
    }

    @Test
    @DisplayName("Admin removes teacher from course successfully")
    void adminRemovesTeacherFromCourse() {
        when(courseService.removeTeacherFromCourse(courseA.getId(), teacherA.getId()))
            .thenReturn(courseA);

        ResponseEntity<CourseResponse> response = courseController.removeTeacherFromCourse(courseA.getId(), teacherA.getId());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(courseService).removeTeacherFromCourse(courseA.getId(), teacherA.getId());
    }

    // --- 3. PUT /api/courses/{id} & DELETE /api/courses/{id} ---

    @Test
    @DisplayName("Teacher can update assigned course via controller")
    void teacherUpdatesAssignedCourse() {
        CourseRequest req = new CourseRequest();
        req.setTitle("Updated Title");

        when(courseService.updateCourse(eq(courseA.getId()), any(), any(), any(), any(), any(), any(), any(), any(), any()))
            .thenReturn(courseA);

        Authentication auth = mockAuth(teacherA, "ROLE_TEACHER");
        ResponseEntity<CourseResponse> response = courseController.updateCourse(courseA.getId(), req, auth);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(courseService).updateCourse(eq(courseA.getId()), any(), any(), any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Teacher can soft-delete course via controller")
    void teacherSoftDeletesCourse() {
        Authentication auth = mockAuth(teacherA, "ROLE_TEACHER");
        ResponseEntity<Void> response = courseController.softDeleteCourse(courseA.getId(), auth);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(courseService).softDeleteCourse(eq(courseA.getId()), eq(teacherA));
    }
}
