package com.codebangers.backend.course;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.chapter.repository.ChapterRepository;
import com.codebangers.backend.content.model.Content;
import com.codebangers.backend.content.repository.ContentRepository;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.security.CourseSecurity;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class CourseSecurityTest {

    private CourseRepository courseRepository;
    private ChapterRepository chapterRepository;
    private ContentRepository contentRepository;
    private UserRepository userRepository;
    private CourseSecurity courseSecurity;

    private User admin;
    private User teacherA;
    private User teacherB;
    private User student;
    private Course course;
    private Chapter chapter;
    private Content content;

    @BeforeEach
    void setUp() {
        courseRepository = mock(CourseRepository.class);
        chapterRepository = mock(ChapterRepository.class);
        contentRepository = mock(ContentRepository.class);
        userRepository = mock(UserRepository.class);

        courseSecurity = new CourseSecurity(courseRepository, chapterRepository, contentRepository, userRepository);

        admin = new User("admin", "Admin", "User", "admin@codebangers.fr", "hash", Role.ADMIN);
        admin.setId(UUID.randomUUID());

        teacherA = new User("teacher_a", "Teacher", "Alpha", "teacher.a@codebangers.fr", "hash", Role.TEACHER);
        teacherA.setId(UUID.randomUUID());

        teacherB = new User("teacher_b", "Teacher", "Beta", "teacher.b@codebangers.fr", "hash", Role.TEACHER);
        teacherB.setId(UUID.randomUUID());

        student = new User("student", "Student", "User", "student@codebangers.fr", "hash", Role.STUDENT);
        student.setId(UUID.randomUUID());

        course = new Course("Web Pro", "Description");
        course.setId(UUID.randomUUID());

        chapter = new Chapter(course, "Chapter 1", 1);
        chapter.setId(UUID.randomUUID());

        content = new Content(chapter, Content.ContentType.TEXT, "Sample Body", 1);
        content.setId(UUID.randomUUID());

        when(userRepository.findById(teacherA.getId())).thenReturn(Optional.of(teacherA));
        when(userRepository.findById(teacherB.getId())).thenReturn(Optional.of(teacherB));
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(userRepository.findById(admin.getId())).thenReturn(Optional.of(admin));

        when(userRepository.findByEmail(teacherA.getEmail())).thenReturn(Optional.of(teacherA));
        when(userRepository.findByEmail(teacherB.getEmail())).thenReturn(Optional.of(teacherB));
        when(userRepository.findByEmail(student.getEmail())).thenReturn(Optional.of(student));
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));

        when(courseRepository.isTeacherAssignedToCourse(course.getId(), teacherA.getId())).thenReturn(true);
        when(courseRepository.isTeacherAssignedToCourse(course.getId(), teacherB.getId())).thenReturn(false);

        when(chapterRepository.findById(chapter.getId())).thenReturn(Optional.of(chapter));
        when(chapterRepository.findByIdWithAssociations(chapter.getId())).thenReturn(Optional.of(chapter));
        when(contentRepository.findById(content.getId())).thenReturn(Optional.of(content));
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

    // --- canManageCourse tests ---

    @Test
    @DisplayName("Admin can manage any course")
    void adminCanManageCourse() {
        Authentication auth = mockAuth(admin, "ROLE_ADMIN");
        assertTrue(courseSecurity.canManageCourse(course.getId(), auth));
    }

    @Test
    @DisplayName("Assigned teacher can manage course")
    void assignedTeacherCanManageCourse() {
        Authentication auth = mockAuth(teacherA, "ROLE_TEACHER");
        assertTrue(courseSecurity.canManageCourse(course.getId(), auth));
    }

    @Test
    @DisplayName("Unassigned teacher cannot manage course")
    void unassignedTeacherCannotManageCourse() {
        Authentication auth = mockAuth(teacherB, "ROLE_TEACHER");
        assertFalse(courseSecurity.canManageCourse(course.getId(), auth));
    }

    @Test
    @DisplayName("Student cannot manage course")
    void studentCannotManageCourse() {
        Authentication auth = mockAuth(student, "ROLE_STUDENT");
        assertFalse(courseSecurity.canManageCourse(course.getId(), auth));
    }

    @Test
    @DisplayName("Null authentication returns false")
    void nullAuthenticationReturnsFalse() {
        assertFalse(courseSecurity.canManageCourse(course.getId(), null));
    }

    @Test
    @DisplayName("Null courseId returns false")
    void nullCourseIdReturnsFalse() {
        Authentication auth = mockAuth(teacherA, "ROLE_TEACHER");
        assertFalse(courseSecurity.canManageCourse(null, auth));
    }

    // --- canManageChapter tests ---

    @Test
    @DisplayName("Admin can manage any chapter")
    void adminCanManageChapter() {
        Authentication auth = mockAuth(admin, "ROLE_ADMIN");
        assertTrue(courseSecurity.canManageChapter(chapter.getId(), auth));
    }

    @Test
    @DisplayName("Assigned teacher can manage chapter of their course")
    void assignedTeacherCanManageChapter() {
        Authentication auth = mockAuth(teacherA, "ROLE_TEACHER");
        assertTrue(courseSecurity.canManageChapter(chapter.getId(), auth));
    }

    @Test
    @DisplayName("Unassigned teacher cannot manage chapter")
    void unassignedTeacherCannotManageChapter() {
        Authentication auth = mockAuth(teacherB, "ROLE_TEACHER");
        assertFalse(courseSecurity.canManageChapter(chapter.getId(), auth));
    }

    @Test
    @DisplayName("Non-existent chapter returns false")
    void nonExistentChapterReturnsFalse() {
        UUID unknownChapterId = UUID.randomUUID();
        when(chapterRepository.findByIdWithAssociations(unknownChapterId)).thenReturn(Optional.empty());
        when(chapterRepository.findById(unknownChapterId)).thenReturn(Optional.empty());

        Authentication auth = mockAuth(teacherA, "ROLE_TEACHER");
        assertFalse(courseSecurity.canManageChapter(unknownChapterId, auth));
    }

    // --- canManageContent tests ---

    @Test
    @DisplayName("Admin can manage any content")
    void adminCanManageContent() {
        Authentication auth = mockAuth(admin, "ROLE_ADMIN");
        assertTrue(courseSecurity.canManageContent(content.getId(), auth));
    }

    @Test
    @DisplayName("Assigned teacher can manage content in their course")
    void assignedTeacherCanManageContent() {
        Authentication auth = mockAuth(teacherA, "ROLE_TEACHER");
        assertTrue(courseSecurity.canManageContent(content.getId(), auth));
    }

    @Test
    @DisplayName("Unassigned teacher cannot manage content")
    void unassignedTeacherCannotManageContent() {
        Authentication auth = mockAuth(teacherB, "ROLE_TEACHER");
        assertFalse(courseSecurity.canManageContent(content.getId(), auth));
    }

    @Test
    @DisplayName("Non-existent content returns false")
    void nonExistentContentReturnsFalse() {
        UUID unknownContentId = UUID.randomUUID();
        when(contentRepository.findById(unknownContentId)).thenReturn(Optional.empty());

        Authentication auth = mockAuth(teacherA, "ROLE_TEACHER");
        assertFalse(courseSecurity.canManageContent(unknownContentId, auth));
    }
}
