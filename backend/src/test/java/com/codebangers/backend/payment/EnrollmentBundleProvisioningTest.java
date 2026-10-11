package com.codebangers.backend.payment;

import com.codebangers.backend.cohort.model.Cohort;
import com.codebangers.backend.cohort.repository.CohortRepository;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.model.EnrollmentTier;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.payment.service.EnrollmentProvisioningService;
import com.codebangers.backend.payment.service.StripeGateway;
import com.codebangers.backend.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EnrollmentBundleProvisioningTest {

    private EnrollmentRepository enrollmentRepository;
    private CourseRepository courseRepository;
    private CohortRepository cohortRepository;
    private StripeGateway stripeGateway;
    private EnrollmentProvisioningService provisioningService;

    private User testUser;
    private Course htmlCourse;
    private Course gitCourse;
    private Course jsCourse;

    private static final UUID HTML_ID = UUID.fromString("c1000000-0000-0000-0000-000000000001");
    private static final UUID JS_ID = UUID.fromString("c2000000-0000-0000-0000-000000000002");
    private static final UUID GIT_ID = UUID.fromString("c3000000-0000-0000-0000-000000000003");

    @BeforeEach
    void setUp() {
        enrollmentRepository = mock(EnrollmentRepository.class);
        courseRepository = mock(CourseRepository.class);
        cohortRepository = mock(CohortRepository.class);
        stripeGateway = mock(StripeGateway.class);

        provisioningService = new EnrollmentProvisioningService(
                enrollmentRepository,
                courseRepository,
                cohortRepository,
                stripeGateway,
                null
        );

        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("student@codebangers.fr");

        htmlCourse = new Course("HTML5 & CSS3 Moderne", "Fondations du Web");
        htmlCourse.setId(HTML_ID);
        htmlCourse.setSlug("html-css");

        gitCourse = new Course("Git, GitHub & Déploiement", "Workflow Git pro");
        gitCourse.setId(GIT_ID);
        gitCourse.setSlug("git-github");

        jsCourse = new Course("JavaScript ES6+ & DOM Interactif", "JS Moderne");
        jsCourse.setId(JS_ID);
        jsCourse.setSlug("javascript");

        when(courseRepository.findBySlug("html-css")).thenReturn(Optional.of(htmlCourse));
        when(courseRepository.findBySlug("git-github")).thenReturn(Optional.of(gitCourse));
        when(courseRepository.findBySlug("javascript")).thenReturn(Optional.of(jsCourse));

        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>());
    }

    @Test
    void enrollInBundleCourses_STARTER_enrollsInHtmlAndGitOnly() {
        provisioningService.enrollInBundleCourses(testUser, EnrollmentTier.STARTER, null, PaymentStatus.PAID);

        ArgumentCaptor<Enrollment> captor = ArgumentCaptor.forClass(Enrollment.class);
        verify(enrollmentRepository, times(2)).save(captor.capture());

        List<Enrollment> saved = captor.getAllValues();
        assertEquals(2, saved.size());

        List<UUID> enrolledCourseIds = saved.stream().map(e -> e.getCourse().getId()).toList();
        assertTrue(enrolledCourseIds.contains(HTML_ID), "STARTER doit inscrire à HTML/CSS");
        assertTrue(enrolledCourseIds.contains(GIT_ID), "STARTER doit inscrire à Git/GitHub");
        assertFalse(enrolledCourseIds.contains(JS_ID), "STARTER ne doit pas inscrire à JavaScript");

        saved.forEach(e -> {
            assertEquals(PaymentStatus.PAID, e.getPaymentStatus());
            assertEquals(EnrollmentTier.STARTER, e.getTier());
            assertEquals(testUser, e.getUser());
        });
    }

    @Test
    void enrollInBundleCourses_WEB_enrollsInHtmlGitAndJs() {
        provisioningService.enrollInBundleCourses(testUser, EnrollmentTier.WEB, null, PaymentStatus.PAID);

        ArgumentCaptor<Enrollment> captor = ArgumentCaptor.forClass(Enrollment.class);
        verify(enrollmentRepository, times(3)).save(captor.capture());

        List<Enrollment> saved = captor.getAllValues();
        assertEquals(3, saved.size());

        List<UUID> enrolledCourseIds = saved.stream().map(e -> e.getCourse().getId()).toList();
        assertTrue(enrolledCourseIds.contains(HTML_ID), "WEB doit inscrire à HTML/CSS");
        assertTrue(enrolledCourseIds.contains(GIT_ID), "WEB doit inscrire à Git/GitHub");
        assertTrue(enrolledCourseIds.contains(JS_ID), "WEB doit inscrire à JavaScript");

        saved.forEach(e -> {
            assertEquals(PaymentStatus.PAID, e.getPaymentStatus());
            assertEquals(EnrollmentTier.WEB, e.getTier());
        });
    }

    @Test
    void enrollInBundleCourses_VIP_enrollsInHtmlGitAndJs() {
        Cohort cohort = new Cohort();
        cohort.setId(UUID.randomUUID());
        cohort.setName("Promotion Alpha");

        provisioningService.enrollInBundleCourses(testUser, EnrollmentTier.VIP, cohort, PaymentStatus.PAID);

        ArgumentCaptor<Enrollment> captor = ArgumentCaptor.forClass(Enrollment.class);
        verify(enrollmentRepository, times(3)).save(captor.capture());

        List<Enrollment> saved = captor.getAllValues();
        assertEquals(3, saved.size());

        List<UUID> enrolledCourseIds = saved.stream().map(e -> e.getCourse().getId()).toList();
        assertTrue(enrolledCourseIds.contains(HTML_ID));
        assertTrue(enrolledCourseIds.contains(GIT_ID));
        assertTrue(enrolledCourseIds.contains(JS_ID));

        saved.forEach(e -> {
            assertEquals(PaymentStatus.PAID, e.getPaymentStatus());
            assertEquals(EnrollmentTier.VIP, e.getTier());
            assertEquals(cohort, e.getCohort());
        });
    }

    @Test
    void enrollInBundleCourses_resolvesViaUUIDFallbackWhenSlugMissing() {
        when(courseRepository.findBySlug("html-css")).thenReturn(Optional.empty());
        when(courseRepository.findBySlug("git-github")).thenReturn(Optional.empty());
        when(courseRepository.findById(HTML_ID)).thenReturn(Optional.of(htmlCourse));
        when(courseRepository.findById(GIT_ID)).thenReturn(Optional.of(gitCourse));

        provisioningService.enrollInBundleCourses(testUser, EnrollmentTier.STARTER, null, PaymentStatus.PAID);

        ArgumentCaptor<Enrollment> captor = ArgumentCaptor.forClass(Enrollment.class);
        verify(enrollmentRepository, times(2)).save(captor.capture());

        List<UUID> enrolledCourseIds = captor.getAllValues().stream().map(e -> e.getCourse().getId()).toList();
        assertTrue(enrolledCourseIds.contains(HTML_ID));
        assertTrue(enrolledCourseIds.contains(GIT_ID));
    }

    @Test
    void enrollInBundleCourses_resolvesViaLegacySlugFallback() {
        when(courseRepository.findBySlug("html-css")).thenReturn(Optional.empty());
        when(courseRepository.findById(HTML_ID)).thenReturn(Optional.empty());
        when(courseRepository.findBySlug("pack-starter")).thenReturn(Optional.of(htmlCourse));

        when(courseRepository.findBySlug("git-github")).thenReturn(Optional.empty());
        when(courseRepository.findById(GIT_ID)).thenReturn(Optional.empty());
        when(courseRepository.findBySlug("pack-mentorat-vip")).thenReturn(Optional.of(gitCourse));

        provisioningService.enrollInBundleCourses(testUser, EnrollmentTier.STARTER, null, PaymentStatus.PAID);

        ArgumentCaptor<Enrollment> captor = ArgumentCaptor.forClass(Enrollment.class);
        verify(enrollmentRepository, times(2)).save(captor.capture());

        List<UUID> enrolledCourseIds = captor.getAllValues().stream().map(e -> e.getCourse().getId()).toList();
        assertTrue(enrolledCourseIds.contains(HTML_ID));
        assertTrue(enrolledCourseIds.contains(GIT_ID));
    }

    @Test
    void enrollInBundleCourses_updatesExistingEnrollmentWithoutDuplicating() {
        Enrollment existingHtmlEnrollment = new Enrollment(testUser, htmlCourse, PaymentStatus.PENDING, 10, EnrollmentTier.STARTER, null);
        existingHtmlEnrollment.setId(UUID.randomUUID());

        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>(List.of(existingHtmlEnrollment)));

        provisioningService.enrollInBundleCourses(testUser, EnrollmentTier.STARTER, null, PaymentStatus.PAID);

        ArgumentCaptor<Enrollment> captor = ArgumentCaptor.forClass(Enrollment.class);
        verify(enrollmentRepository, times(2)).save(captor.capture());

        List<Enrollment> saved = captor.getAllValues();
        assertEquals(2, saved.size());

        Enrollment updatedHtml = saved.stream().filter(e -> e.getCourse().getId().equals(HTML_ID)).findFirst().orElseThrow();
        assertEquals(PaymentStatus.PAID, updatedHtml.getPaymentStatus());
        assertEquals(existingHtmlEnrollment.getId(), updatedHtml.getId(), "L'inscription HTML existante doit être mise à jour, non recréée");

        Enrollment createdGit = saved.stream().filter(e -> e.getCourse().getId().equals(GIT_ID)).findFirst().orElseThrow();
        assertEquals(PaymentStatus.PAID, createdGit.getPaymentStatus());
    }

    @Test
    void enrollInBundleCourses_nullSafe() {
        assertDoesNotThrow(() -> provisioningService.enrollInBundleCourses(null, EnrollmentTier.STARTER, null, PaymentStatus.PAID));
        assertDoesNotThrow(() -> provisioningService.enrollInBundleCourses(testUser, null, null, PaymentStatus.PAID));
        verify(enrollmentRepository, never()).save(any());
    }
}
