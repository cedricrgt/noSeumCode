package com.codebangers.backend.course;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.service.CourseService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CourseTeacherServiceTest {

    private CourseRepository courseRepository;
    private UserRepository userRepository;
    private CourseService courseService;

    private User admin;
    private User teacher;
    private User student;
    private Course course;

    @BeforeEach
    void setUp() {
        courseRepository = mock(CourseRepository.class);
        userRepository = mock(UserRepository.class);
        courseService = new CourseService(courseRepository, userRepository);

        admin = new User("admin", "Admin", "User", "admin@codebangers.fr", "hash", Role.ADMIN);
        admin.setId(UUID.randomUUID());

        teacher = new User("teacher", "Teacher", "User", "teacher@codebangers.fr", "hash", Role.TEACHER);
        teacher.setId(UUID.randomUUID());

        student = new User("student", "Student", "User", "student@codebangers.fr", "hash", Role.STUDENT);
        student.setId(UUID.randomUUID());

        course = new Course("Pack Starter", "Fondations Web");
        course.setId(UUID.randomUUID());

        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(userRepository.findById(teacher.getId())).thenReturn(Optional.of(teacher));
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(courseRepository.save(any(Course.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    @DisplayName("getAssignedCoursesForTeacher delegates to courseRepository")
    void getAssignedCoursesForTeacherDelegates() {
        when(courseRepository.findAllByAssignedTeachersId(teacher.getId())).thenReturn(List.of(course));

        List<Course> result = courseService.getAssignedCoursesForTeacher(teacher.getId());

        assertEquals(1, result.size());
        assertEquals(course.getId(), result.get(0).getId());
        verify(courseRepository).findAllByAssignedTeachersId(teacher.getId());
    }

    @Test
    @DisplayName("assignTeacherToCourse successfully adds teacher with TEACHER role")
    void assignTeacherToCourseSuccess() {
        Course updated = courseService.assignTeacherToCourse(course.getId(), teacher.getId(), admin);

        assertNotNull(updated);
        assertTrue(updated.getAssignedTeachers().contains(teacher));
        verify(courseRepository).save(course);
    }

    @Test
    @DisplayName("assignTeacherToCourse rejects user without TEACHER role")
    void assignTeacherToCourseRejectsNonTeacher() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
            courseService.assignTeacherToCourse(course.getId(), student.getId(), admin)
        );

        assertTrue(ex.getMessage().contains("TEACHER role"));
        verify(courseRepository, never()).save(any());
    }

    @Test
    @DisplayName("assignTeacherToCourse throws ResourceNotFoundException on unknown course")
    void assignTeacherToCourseUnknownCourse() {
        UUID unknownId = UUID.randomUUID();
        when(courseRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
            courseService.assignTeacherToCourse(unknownId, teacher.getId(), admin)
        );
    }

    @Test
    @DisplayName("removeTeacherFromCourse successfully removes teacher")
    void removeTeacherFromCourseSuccess() {
        course.addTeacher(teacher);
        assertTrue(course.getAssignedTeachers().contains(teacher));

        Course updated = courseService.removeTeacherFromCourse(course.getId(), teacher.getId());

        assertNotNull(updated);
        assertFalse(updated.getAssignedTeachers().contains(teacher));
        verify(courseRepository).save(course);
    }

    @Test
    @DisplayName("createCourse by teacher automatically assigns the creator to assignedTeachers")
    void createCourseByTeacherAutoAssignsCreator() {
        when(courseRepository.findByTitle("Nouveau Cours")).thenReturn(Optional.empty());

        Course created = courseService.createCourse("Nouveau Cours", "Desc", teacher);

        assertNotNull(created);
        assertTrue(created.getAssignedTeachers().contains(teacher));
    }
}
