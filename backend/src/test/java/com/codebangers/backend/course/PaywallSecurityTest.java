package com.codebangers.backend.course;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.content.model.Content;
import com.codebangers.backend.course.controller.ChapterController;
import com.codebangers.backend.course.controller.ContentController;
import com.codebangers.backend.course.dto.ChapterResponse;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.CourseTier;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.model.EnrollmentTier;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.course.service.ChapterService;
import com.codebangers.backend.course.service.ContentService;
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
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PaywallSecurityTest {

    private CourseRepository courseRepository;
    private EnrollmentRepository enrollmentRepository;
    private EnrollmentService enrollmentService;
    private ChapterService chapterService;
    private ContentService contentService;
    private UserRepository userRepository;
    private UserService userService;

    private Course course;
    private Chapter previewChapter;
    private Chapter lockedChapter;

    private User studentPaid;
    private User studentUnpaid;
    private User teacher;
    private User admin;

    @BeforeEach
    void setUp() {
        courseRepository = mock(CourseRepository.class);
        enrollmentRepository = mock(EnrollmentRepository.class);
        userRepository = mock(UserRepository.class);
        enrollmentService = new EnrollmentService(enrollmentRepository, courseRepository, userRepository);
        chapterService = mock(ChapterService.class);
        contentService = mock(ContentService.class);
        userService = mock(UserService.class);

        course = new Course("Java 21 Mastery", "Description");
        course.setId(UUID.randomUUID());
        course.setRequiredTier(CourseTier.STARTER);
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));

        // Chapitre 1 : Preview gratuit
        previewChapter = new Chapter(course, "1. Introduction", 1);
        previewChapter.setId(UUID.randomUUID());
        Content previewContent = new Content(previewChapter, Content.ContentType.TEXT, "Introduction libre", 1);
        previewChapter.addContent(previewContent);

        // Chapitre 2 : Verrouillé / Payant
        lockedChapter = new Chapter(course, "2. Architecture Avancée", 2);
        lockedChapter.setId(UUID.randomUUID());
        Content lockedContent = new Content(lockedChapter, Content.ContentType.PARAGRAPH, "Secrets d'architecture réservés aux abonnés", 1);
        lockedChapter.addContent(lockedContent);

        // Utilisateurs
        studentPaid = new User("paid_user", "Jean", "Payant", "paid@codebangers.fr", "hash", Role.STUDENT);
        studentPaid.setId(UUID.randomUUID());

        studentUnpaid = new User("unpaid_user", "Marc", "Gratuit", "unpaid@codebangers.fr", "hash", Role.STUDENT);
        studentUnpaid.setId(UUID.randomUUID());

        teacher = new User("prof_cedric", "Cédric", "Ragot", "teacher@codebangers.fr", "hash", Role.TEACHER);
        teacher.setId(UUID.randomUUID());

        admin = new User("admin_user", "Admin", "CodeBangers", "admin@codebangers.fr", "hash", Role.ADMIN);
        admin.setId(UUID.randomUUID());

        // Inscriptions
        Enrollment paidEnrollment = new Enrollment(studentPaid, course, PaymentStatus.PAID, 0);
        Enrollment unpaidEnrollment = new Enrollment(studentUnpaid, course, PaymentStatus.PENDING, 0);

        when(enrollmentRepository.findByUserIdAndCourseId(studentPaid.getId(), course.getId()))
                .thenReturn(Optional.of(paidEnrollment));
        when(enrollmentRepository.findByUserIdAndCourseId(studentUnpaid.getId(), course.getId()))
                .thenReturn(Optional.of(unpaidEnrollment));
    }

    @Test
    void chapterIsFreePreviewLogic() {
        assertTrue(previewChapter.isFreePreview(), "Le chapitre de position 1 doit être un preview gratuit.");
        assertFalse(lockedChapter.isFreePreview(), "Le chapitre de position 2 doit être payant.");

        Chapter subChapter1 = new Chapter(course, previewChapter, "1.1 Sous-partie", 1);
        assertTrue(subChapter1.isFreePreview(), "Une sous-section d'un chapitre gratuit doit être en preview.");

        Chapter subChapter2 = new Chapter(course, lockedChapter, "2.1 Sous-partie", 1);
        assertFalse(subChapter2.isFreePreview(), "Une sous-section d'un chapitre payant doit être verrouillée.");
    }

    @Test
    void enrollmentServiceAccessRightsVerification() {
        assertTrue(enrollmentService.hasPaidAccess(admin, course.getId()), "L'Admin doit avoir accès à tout.");
        assertTrue(enrollmentService.hasPaidAccess(teacher, course.getId()), "L'Enseignant doit avoir accès à tout.");
        assertTrue(enrollmentService.hasPaidAccess(studentPaid, course.getId()), "L'étudiant avec statut PAID doit avoir accès.");
        assertFalse(enrollmentService.hasPaidAccess(studentUnpaid, course.getId()), "L'étudiant avec statut PENDING doit être bloqué.");
        assertFalse(enrollmentService.hasPaidAccess(null, course.getId()), "Un utilisateur anonyme doit être bloqué.");
    }

    @Test
    void unpaidStudentCanAccessFreePreviewChapter() {
        ChapterController controller = new ChapterController(chapterService, enrollmentService, userRepository);

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(studentUnpaid.getEmail());
        when(userRepository.findByEmail(studentUnpaid.getEmail())).thenReturn(Optional.of(studentUnpaid));
        when(chapterService.getChapterById(previewChapter.getId())).thenReturn(Optional.of(previewChapter));

        ResponseEntity<?> response = controller.getChapterById(previewChapter.getId(), jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        ChapterResponse cr = (ChapterResponse) response.getBody();
        assertNotNull(cr);
        assertEquals("Introduction libre", cr.getContent());
    }

    @Test
    void unpaidStudentIsForbiddenFromAccessingPaidChapter() {
        ChapterController controller = new ChapterController(chapterService, enrollmentService, userRepository);

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(studentUnpaid.getEmail());
        when(userRepository.findByEmail(studentUnpaid.getEmail())).thenReturn(Optional.of(studentUnpaid));
        when(chapterService.getChapterById(lockedChapter.getId())).thenReturn(Optional.of(lockedChapter));

        ResponseEntity<?> response = controller.getChapterById(lockedChapter.getId(), jwt);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void paidStudentCanAccessPaidChapter() {
        ChapterController controller = new ChapterController(chapterService, enrollmentService, userRepository);

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(studentPaid.getEmail());
        when(userRepository.findByEmail(studentPaid.getEmail())).thenReturn(Optional.of(studentPaid));
        when(chapterService.getChapterById(lockedChapter.getId())).thenReturn(Optional.of(lockedChapter));

        ResponseEntity<?> response = controller.getChapterById(lockedChapter.getId(), jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        ChapterResponse cr = (ChapterResponse) response.getBody();
        assertNotNull(cr);
        assertEquals("Secrets d'architecture réservés aux abonnés", cr.getContent());
    }

    @Test
    void unpaidStudentListChaptersHidesPaidContentBodies() {
        ChapterController controller = new ChapterController(chapterService, enrollmentService, userRepository);

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(studentUnpaid.getEmail());
        when(userRepository.findByEmail(studentUnpaid.getEmail())).thenReturn(Optional.of(studentUnpaid));
        when(chapterService.getActiveChaptersByCourse(course.getId()))
                .thenReturn(List.of(previewChapter, lockedChapter));

        ResponseEntity<List<ChapterResponse>> response = controller.getActiveChaptersByCourse(course.getId(), jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<ChapterResponse> list = response.getBody();
        assertNotNull(list);
        assertEquals(2, list.size());

        // Chapitre 1 (Preview) : contenu visible
        assertEquals("Introduction libre", list.get(0).getContent());
        assertTrue(list.get(0).isFreePreview());

        // Chapitre 2 (Payant) : métadonnées visibles pour la table des matières mais contenu masqué (null)
        assertNull(list.get(1).getContent());
        assertFalse(list.get(1).isFreePreview());
    }

    @Test
    void contentControllerBlocksUnpaidUserOnPaidChapterContent() {
        ContentController contentController = new ContentController(contentService, userService, chapterService, enrollmentService);

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(studentUnpaid.getEmail());
        when(userService.getUserByEmail(studentUnpaid.getEmail())).thenReturn(Optional.of(studentUnpaid));
        when(chapterService.getChapterById(lockedChapter.getId())).thenReturn(Optional.of(lockedChapter));

        ResponseEntity<?> response = contentController.getActiveContentByChapter(lockedChapter.getId(), jwt);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void contentControllerAllowsUnpaidUserOnPreviewChapterContent() {
        ContentController contentController = new ContentController(contentService, userService, chapterService, enrollmentService);

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(studentUnpaid.getEmail());
        when(userService.getUserByEmail(studentUnpaid.getEmail())).thenReturn(Optional.of(studentUnpaid));
        when(chapterService.getChapterById(previewChapter.getId())).thenReturn(Optional.of(previewChapter));
        when(contentService.getActiveContentByChapter(previewChapter.getId())).thenReturn(previewChapter.getContents());

        ResponseEntity<?> response = contentController.getActiveContentByChapter(previewChapter.getId(), jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @DisplayName("Starter student has lifetime access to Starter courses but is blocked from Web courses (ADR-013)")
    void starterStudentHasAccessToStarterCourseLifetimeReplaysButBlockedFromWeb() {
        Course starterCourse = new Course("HTML & CSS", "Fondations");
        starterCourse.setId(UUID.randomUUID());
        starterCourse.setRequiredTier(CourseTier.STARTER);

        Course webCourse = new Course("JavaScript & APIs", "Avancé");
        webCourse.setId(UUID.randomUUID());
        webCourse.setRequiredTier(CourseTier.WEB);

        User starterStudent = new User("starter_student", "Bob", "Starter", "starter@codebangers.fr", "hash", Role.STUDENT);
        starterStudent.setId(UUID.randomUUID());

        Enrollment starterEnrollment = new Enrollment(starterStudent, starterCourse, PaymentStatus.PAID, 0, EnrollmentTier.STARTER, null);

        when(courseRepository.findById(starterCourse.getId())).thenReturn(Optional.of(starterCourse));
        when(courseRepository.findById(webCourse.getId())).thenReturn(Optional.of(webCourse));
        when(enrollmentRepository.findByUserIdAndCourseId(starterStudent.getId(), starterCourse.getId()))
                .thenReturn(Optional.of(starterEnrollment));
        when(enrollmentRepository.findByUserIdAndCourseId(starterStudent.getId(), webCourse.getId()))
                .thenReturn(Optional.empty());
        when(enrollmentRepository.findByUserId(starterStudent.getId()))
                .thenReturn(List.of(starterEnrollment));

        assertTrue(enrollmentService.hasPaidAccess(starterStudent, starterCourse.getId()),
                "L'étudiant Starter doit avoir accès illimité/à vie au cours Starter et à ses replays.");
        assertFalse(enrollmentService.hasPaidAccess(starterStudent, webCourse.getId()),
                "L'étudiant Starter ne doit PAS avoir accès aux cours Web.");
    }

    @Test
    @DisplayName("Web student can access both Starter and Web tier courses")
    void webStudentCanAccessBothStarterAndWebCourses() {
        Course starterCourse = new Course("HTML & CSS", "Fondations");
        starterCourse.setId(UUID.randomUUID());
        starterCourse.setRequiredTier(CourseTier.STARTER);

        Course webCourse = new Course("JavaScript & APIs", "Avancé");
        webCourse.setId(UUID.randomUUID());
        webCourse.setRequiredTier(CourseTier.WEB);

        User webStudent = new User("web_student", "Charlie", "Web", "web@codebangers.fr", "hash", Role.STUDENT);
        webStudent.setId(UUID.randomUUID());

        Enrollment webEnrollment = new Enrollment(webStudent, webCourse, PaymentStatus.PAID, 0, EnrollmentTier.WEB, null);

        when(courseRepository.findById(starterCourse.getId())).thenReturn(Optional.of(starterCourse));
        when(courseRepository.findById(webCourse.getId())).thenReturn(Optional.of(webCourse));
        when(enrollmentRepository.findByUserIdAndCourseId(webStudent.getId(), webCourse.getId()))
                .thenReturn(Optional.of(webEnrollment));
        when(enrollmentRepository.findByUserId(webStudent.getId()))
                .thenReturn(List.of(webEnrollment));

        assertTrue(enrollmentService.hasPaidAccess(webStudent, starterCourse.getId()),
                "L'étudiant Web doit avoir accès aux cours Starter.");
        assertTrue(enrollmentService.hasPaidAccess(webStudent, webCourse.getId()),
                "L'étudiant Web doit avoir accès aux cours Web.");
    }

    @Test
    @DisplayName("VIP student can access all courses and mentoring")
    void vipStudentCanAccessAllCourses() {
        Course starterCourse = new Course("Git & GitHub", "Outil dev");
        starterCourse.setId(UUID.randomUUID());
        starterCourse.setRequiredTier(CourseTier.STARTER);

        Course webCourse = new Course("JavaScript", "Interactif");
        webCourse.setId(UUID.randomUUID());
        webCourse.setRequiredTier(CourseTier.WEB);

        User vipStudent = new User("vip_student", "Diana", "VIP", "vip@codebangers.fr", "hash", Role.STUDENT);
        vipStudent.setId(UUID.randomUUID());

        Enrollment vipEnrollment = new Enrollment(vipStudent, webCourse, PaymentStatus.PAID, 0, EnrollmentTier.VIP, null);

        when(courseRepository.findById(starterCourse.getId())).thenReturn(Optional.of(starterCourse));
        when(courseRepository.findById(webCourse.getId())).thenReturn(Optional.of(webCourse));
        when(enrollmentRepository.findByUserId(vipStudent.getId()))
                .thenReturn(List.of(vipEnrollment));

        assertTrue(enrollmentService.hasPaidAccess(vipStudent, starterCourse.getId()),
                "L'étudiant VIP doit avoir accès aux cours Starter.");
        assertTrue(enrollmentService.hasPaidAccess(vipStudent, webCourse.getId()),
                "L'étudiant VIP doit avoir accès aux cours Web.");
    }
}
