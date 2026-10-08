package com.codebangers.backend.course;

import com.codebangers.backend.course.controller.EnrollmentController;
import com.codebangers.backend.course.dto.EnrollmentRequest;
import com.codebangers.backend.course.dto.EnrollmentResponse;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.course.security.EnrollmentSecurity;
import com.codebangers.backend.course.service.EnrollmentService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
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

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EnrollmentSecurityTest {

    private EnrollmentRepository enrollmentRepository;
    private CourseRepository courseRepository;
    private UserRepository userRepository;
    private UserService userService;
    private EnrollmentService enrollmentService;
    private EnrollmentController enrollmentController;
    private EnrollmentSecurity enrollmentSecurity;

    private User studentAlice;
    private User studentBob;
    private User admin;
    private Course course;
    private Enrollment aliceEnrollment;

    @BeforeEach
    void setUp() {
        enrollmentRepository = mock(EnrollmentRepository.class);
        courseRepository = mock(CourseRepository.class);
        userRepository = mock(UserRepository.class);
        userService = mock(UserService.class);

        enrollmentService = new EnrollmentService(enrollmentRepository, courseRepository, userRepository);
        enrollmentController = new EnrollmentController(enrollmentService, userService);
        enrollmentSecurity = new EnrollmentSecurity(enrollmentRepository);

        studentAlice = new User("alice", "Alice", "Dupont", "alice@codebangers.fr", "hash", Role.STUDENT);
        studentAlice.setId(UUID.randomUUID());

        studentBob = new User("bob", "Bob", "Martin", "bob@codebangers.fr", "hash", Role.STUDENT);
        studentBob.setId(UUID.randomUUID());

        admin = new User("admin", "Admin", "Admin", "admin@codebangers.fr", "hash", Role.ADMIN);
        admin.setId(UUID.randomUUID());

        course = new Course("Pack Web Pro", "Description");
        course.setId(UUID.randomUUID());

        aliceEnrollment = new Enrollment(studentAlice, course, PaymentStatus.PAID, 25);
        aliceEnrollment.setId(UUID.randomUUID());

        when(userRepository.findById(studentAlice.getId())).thenReturn(Optional.of(studentAlice));
        when(userRepository.findById(studentBob.getId())).thenReturn(Optional.of(studentBob));
        when(userRepository.findById(admin.getId())).thenReturn(Optional.of(admin));

        when(userService.getUserByEmail(studentAlice.getEmail())).thenReturn(Optional.of(studentAlice));
        when(userService.getUserByEmail(studentBob.getEmail())).thenReturn(Optional.of(studentBob));
        when(userService.getUserByEmail(admin.getEmail())).thenReturn(Optional.of(admin));

        when(userService.getUserById(studentAlice.getId())).thenReturn(Optional.of(studentAlice));
        when(userService.getUserById(studentBob.getId())).thenReturn(Optional.of(studentBob));
        when(userService.getUserById(admin.getId())).thenReturn(Optional.of(admin));

        when(enrollmentRepository.findById(aliceEnrollment.getId())).thenReturn(Optional.of(aliceEnrollment));
        when(enrollmentRepository.findByIdWithAssociations(aliceEnrollment.getId())).thenReturn(Optional.of(aliceEnrollment));
        when(enrollmentRepository.existsById(aliceEnrollment.getId())).thenReturn(true);
    }

    private Jwt mockJwt(User user) {
        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(user.getEmail());
        when(jwt.getClaimAsString("userId")).thenReturn(user.getId().toString());
        return jwt;
    }

    // --- 1. GET /api/enrollments/{id} ---

    @Test
    @DisplayName("Owner student can read their own enrollment")
    void ownerCanReadEnrollment() {
        Jwt jwt = mockJwt(studentAlice);
        ResponseEntity<EnrollmentResponse> response = enrollmentController.getEnrollmentById(aliceEnrollment.getId(), jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(aliceEnrollment.getId(), response.getBody().getId());
    }

    @Test
    @DisplayName("Admin can read any user's enrollment")
    void adminCanReadAnyEnrollment() {
        Jwt jwt = mockJwt(admin);
        ResponseEntity<EnrollmentResponse> response = enrollmentController.getEnrollmentById(aliceEnrollment.getId(), jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(aliceEnrollment.getId(), response.getBody().getId());
    }

    @Test
    @DisplayName("Other student is forbidden from reading someone else's enrollment (IDOR prevention)")
    void otherStudentForbiddenFromReadingEnrollment() {
        Jwt jwt = mockJwt(studentBob);

        assertThrows(AccessDeniedException.class, () ->
                enrollmentController.getEnrollmentById(aliceEnrollment.getId(), jwt));
    }

    // --- 2. PUT /api/enrollments/{id}/progress ---

    @Test
    @DisplayName("Owner can update progress on their own enrollment")
    void ownerCanUpdateProgress() {
        when(enrollmentRepository.findByIdAndUserId(aliceEnrollment.getId(), studentAlice.getId()))
                .thenReturn(Optional.of(aliceEnrollment));
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(i -> i.getArgument(0));

        Jwt jwt = mockJwt(studentAlice);
        ResponseEntity<?> response = enrollmentController.updateProgress(aliceEnrollment.getId(), 75, jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(75, aliceEnrollment.getProgress());
    }

    @Test
    @DisplayName("Admin can update progress on any enrollment")
    void adminCanUpdateProgress() {
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(i -> i.getArgument(0));

        Jwt jwt = mockJwt(admin);
        ResponseEntity<?> response = enrollmentController.updateProgress(aliceEnrollment.getId(), 100, jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(100, aliceEnrollment.getProgress());
    }

    @Test
    @DisplayName("Other student is forbidden from updating someone else's progress (IDOR prevention)")
    void otherStudentForbiddenFromUpdatingProgress() {
        when(enrollmentRepository.findByIdAndUserId(aliceEnrollment.getId(), studentBob.getId()))
                .thenReturn(Optional.empty());

        Jwt jwt = mockJwt(studentBob);

        assertThrows(AccessDeniedException.class, () ->
                enrollmentController.updateProgress(aliceEnrollment.getId(), 50, jwt));
    }

    // --- 3. POST /api/enrollments ---

    @Test
    @DisplayName("Student can enroll themselves without providing userId")
    void studentEnrollsSelfWithoutUserId() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(enrollmentRepository.findByUserIdAndCourseId(studentAlice.getId(), course.getId())).thenReturn(Optional.empty());
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(i -> {
            Enrollment e = i.getArgument(0);
            e.setId(UUID.randomUUID());
            return e;
        });

        Jwt jwt = mockJwt(studentAlice);
        EnrollmentRequest request = new EnrollmentRequest(null, course.getId());

        ResponseEntity<?> response = enrollmentController.enrollUserInCourse(request, jwt);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(enrollmentRepository).save(argThat(e -> e.getUser().getId().equals(studentAlice.getId())));
    }

    @Test
    @DisplayName("Student providing their own matching userId succeeds")
    void studentEnrollsSelfWithMatchingUserId() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(enrollmentRepository.findByUserIdAndCourseId(studentAlice.getId(), course.getId())).thenReturn(Optional.empty());
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(i -> {
            Enrollment e = i.getArgument(0);
            e.setId(UUID.randomUUID());
            return e;
        });

        Jwt jwt = mockJwt(studentAlice);
        EnrollmentRequest request = new EnrollmentRequest(studentAlice.getId(), course.getId());

        ResponseEntity<?> response = enrollmentController.enrollUserInCourse(request, jwt);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(enrollmentRepository).save(argThat(e -> e.getUser().getId().equals(studentAlice.getId())));
    }

    @Test
    @DisplayName("Student trying to enroll another user is forbidden (IDOR prevention)")
    void studentForbiddenFromEnrollingOtherUser() {
        Jwt jwt = mockJwt(studentBob);
        EnrollmentRequest request = new EnrollmentRequest(studentAlice.getId(), course.getId());

        assertThrows(AccessDeniedException.class, () ->
                enrollmentController.enrollUserInCourse(request, jwt));
        verify(enrollmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Admin can enroll another user")
    void adminCanEnrollOtherUser() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(enrollmentRepository.findByUserIdAndCourseId(studentAlice.getId(), course.getId())).thenReturn(Optional.empty());
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(i -> {
            Enrollment e = i.getArgument(0);
            e.setId(UUID.randomUUID());
            return e;
        });

        Jwt jwt = mockJwt(admin);
        EnrollmentRequest request = new EnrollmentRequest(studentAlice.getId(), course.getId());

        ResponseEntity<?> response = enrollmentController.enrollUserInCourse(request, jwt);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(enrollmentRepository).save(argThat(e -> e.getUser().getId().equals(studentAlice.getId())));
    }

    // --- 4. EnrollmentSecurity component ---

    @Test
    @DisplayName("EnrollmentSecurity allows ADMIN role")
    void enrollmentSecurityAllowsAdmin() {
        Authentication auth = mock(Authentication.class);
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))).when(auth).getAuthorities();

        assertTrue(enrollmentSecurity.canAccessEnrollment(aliceEnrollment.getId(), auth));
    }

    @Test
    @DisplayName("EnrollmentSecurity allows owner matching JWT userId")
    void enrollmentSecurityAllowsOwner() {
        Authentication auth = mock(Authentication.class);
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))).when(auth).getAuthorities();

        Jwt jwt = mock(Jwt.class);
        when(jwt.getClaimAsString("userId")).thenReturn(studentAlice.getId().toString());
        when(auth.getPrincipal()).thenReturn(jwt);

        assertTrue(enrollmentSecurity.canAccessEnrollment(aliceEnrollment.getId(), auth));
    }

    @Test
    @DisplayName("EnrollmentSecurity denies non-owner with different JWT userId")
    void enrollmentSecurityDeniesNonOwner() {
        Authentication auth = mock(Authentication.class);
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))).when(auth).getAuthorities();

        Jwt jwt = mock(Jwt.class);
        when(jwt.getClaimAsString("userId")).thenReturn(studentBob.getId().toString());
        when(auth.getPrincipal()).thenReturn(jwt);

        assertFalse(enrollmentSecurity.canAccessEnrollment(aliceEnrollment.getId(), auth));
    }
}
