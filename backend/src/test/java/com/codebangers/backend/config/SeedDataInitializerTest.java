package com.codebangers.backend.config;

import com.codebangers.backend.chapter.repository.ChapterRepository;
import com.codebangers.backend.content.repository.ContentRepository;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import com.codebangers.backend.workshop.repository.UserWorkshopRepository;
import com.codebangers.backend.workshop.repository.WorkshopRepository;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SeedDataInitializerTest {

    @Test
    void shouldNotAttemptToInsertDuplicateUsersWhenSeedAlreadyExists() {
        UserRepository userRepository = mock(UserRepository.class);
        CourseRepository courseRepository = mock(CourseRepository.class);
        ChapterRepository chapterRepository = mock(ChapterRepository.class);
        ContentRepository contentRepository = mock(ContentRepository.class);
        EnrollmentRepository enrollmentRepository = mock(EnrollmentRepository.class);
        WorkshopRepository workshopRepository = mock(WorkshopRepository.class);
        UserWorkshopRepository userWorkshopRepository = mock(UserWorkshopRepository.class);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        SeedDataInitializer initializer = new SeedDataInitializer(
                userRepository,
                courseRepository,
                chapterRepository,
                contentRepository,
                enrollmentRepository,
                workshopRepository,
                userWorkshopRepository,
                passwordEncoder
        );

        User existingAdmin = new User("admin", "Admin", "User", "admin@codebangers.com", "hash", Role.ADMIN);
        when(userRepository.findByEmail("admin@codebangers.com")).thenReturn(Optional.of(existingAdmin));
        when(userRepository.findByEmail("teacher@codebangers.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("student@codebangers.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@codebangers.com")).thenReturn(Optional.empty());
        when(userRepository.findByUserName("teacher")).thenReturn(Optional.empty());
        when(userRepository.findByUserName("student")).thenReturn(Optional.empty());
        when(userRepository.findByUserName("testuser")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenThrow(new DataIntegrityViolationException("duplicate"));

        when(courseRepository.findAll()).thenReturn(List.of());
        when(chapterRepository.findAll()).thenReturn(List.of());
        when(contentRepository.findAll()).thenReturn(List.of());
        when(enrollmentRepository.findAll()).thenReturn(List.of());
        when(workshopRepository.findAll()).thenReturn(List.of());
        when(userWorkshopRepository.findAll()).thenReturn(List.of());
        when(courseRepository.save(any(Course.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertDoesNotThrow(initializer::seed);

        verify(userRepository).findByEmail("admin@codebangers.com");
        verify(userRepository, never()).save(any(User.class));
    }
}
