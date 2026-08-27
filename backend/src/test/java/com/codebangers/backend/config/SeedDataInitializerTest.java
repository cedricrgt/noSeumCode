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
        User existingTeacher = new User("teacher", "Jane", "Doe", "teacher@codebangers.com", "hash", Role.TEACHER);
        User existingStudent = new User("student", "John", "Smith", "student@codebangers.com", "hash", Role.STUDENT);
        User existingTest = new User("testuser", "Test", "User", "test@codebangers.com", "hash", Role.ADMIN);

        // Return existing users so save is never called
        when(userRepository.findByEmail("admin@codebangers.com")).thenReturn(Optional.of(existingAdmin));
        when(userRepository.findByEmail("teacher@codebangers.com")).thenReturn(Optional.of(existingTeacher));
        when(userRepository.findByEmail("student@codebangers.com")).thenReturn(Optional.of(existingStudent));
        when(userRepository.findByEmail("test@codebangers.com")).thenReturn(Optional.of(existingTest));

        // Courses already exist — seed should return early
        when(courseRepository.findAll()).thenReturn(List.of(new Course("Existing", "Already seeded")));

        assertDoesNotThrow(initializer::seed);

        // Since courses already exist, no save calls should happen at all
        verify(userRepository, never()).save(any(User.class));
    }
}
