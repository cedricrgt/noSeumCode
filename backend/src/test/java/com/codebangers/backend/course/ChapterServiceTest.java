package com.codebangers.backend.course;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.chapter.repository.ChapterRepository;
import com.codebangers.backend.course.dto.LiveRecapBatchRequest;
import com.codebangers.backend.course.dto.LiveRecapBatchResponse;
import com.codebangers.backend.course.dto.LiveRecapSubChapterDto;
import com.codebangers.backend.course.model.ApprovalStatus;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.service.ChapterService;
import com.codebangers.backend.notification.model.NotificationType;
import com.codebangers.backend.notification.service.NotificationService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ChapterServiceTest {

    @Test
    void teacherCreatingChapterShouldBePendingApprovalAndNotifyAdmins() {
        ChapterRepository chapterRepository = mock(ChapterRepository.class);
        CourseRepository courseRepository = mock(CourseRepository.class);
        NotificationService notificationService = mock(NotificationService.class);
        ChapterService chapterService = new ChapterService(chapterRepository, courseRepository, notificationService);

        UUID courseId = UUID.randomUUID();
        Course course = new Course("Spring Boot Mastery", "Desc");
        course.setId(courseId);
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));

        User teacher = new User("teacher1", "Jane", "Doe", "teacher@codebangers.com", "pass", Role.TEACHER);
        when(chapterRepository.save(any(Chapter.class))).thenAnswer(i -> i.getArgument(0));

        Chapter chapter = chapterService.createChapter(courseId, "Security Module", 1, teacher);

        assertNotNull(chapter);
        assertEquals(ApprovalStatus.PENDING_APPROVAL, chapter.getStatus());
        assertNotNull(chapter.getSubmittedAt());
        verify(notificationService).notifyAdmins(anyString(), anyString(), any(), eq("CHAPTER"));
    }

    @Test
    void adminApprovingChapterShouldChangeStatusToApprovedAndNotifyTeacher() {
        ChapterRepository chapterRepository = mock(ChapterRepository.class);
        CourseRepository courseRepository = mock(CourseRepository.class);
        NotificationService notificationService = mock(NotificationService.class);
        ChapterService chapterService = new ChapterService(chapterRepository, courseRepository, notificationService);

        UUID chapterId = UUID.randomUUID();
        User teacher = new User("teacher1", "Jane", "Doe", "teacher@codebangers.com", "pass", Role.TEACHER);
        Course course = new Course("Spring Boot Mastery", "Desc");
        Chapter chapter = new Chapter(course, "Security Module", 1);
        chapter.setId(chapterId);
        chapter.setCreatedBy(teacher);
        chapter.setStatus(ApprovalStatus.PENDING_APPROVAL);

        when(chapterRepository.findById(chapterId)).thenReturn(Optional.of(chapter));
        when(chapterRepository.save(any(Chapter.class))).thenAnswer(i -> i.getArgument(0));

        User admin = new User("admin1", "Admin", "User", "admin@codebangers.com", "pass", Role.ADMIN);
        Chapter approved = chapterService.approveChapter(chapterId, admin);

        assertEquals(ApprovalStatus.APPROVED, approved.getStatus());
        assertNotNull(approved.getReviewedAt());
        assertEquals(admin, approved.getReviewedBy());
        verify(notificationService).notifyUser(eq(teacher), anyString(), anyString(), eq(NotificationType.COURSE_APPROVED), eq(chapterId), eq("CHAPTER"));
    }

    @Test
    void adminRejectingChapterShouldChangeStatusToRejectedAndStoreReason() {
        ChapterRepository chapterRepository = mock(ChapterRepository.class);
        CourseRepository courseRepository = mock(CourseRepository.class);
        NotificationService notificationService = mock(NotificationService.class);
        ChapterService chapterService = new ChapterService(chapterRepository, courseRepository, notificationService);

        UUID chapterId = UUID.randomUUID();
        User teacher = new User("teacher1", "Jane", "Doe", "teacher@codebangers.com", "pass", Role.TEACHER);
        Course course = new Course("Spring Boot Mastery", "Desc");
        Chapter chapter = new Chapter(course, "Security Module", 1);
        chapter.setId(chapterId);
        chapter.setCreatedBy(teacher);
        chapter.setStatus(ApprovalStatus.PENDING_APPROVAL);

        when(chapterRepository.findById(chapterId)).thenReturn(Optional.of(chapter));
        when(chapterRepository.save(any(Chapter.class))).thenAnswer(i -> i.getArgument(0));

        User admin = new User("admin1", "Admin", "User", "admin@codebangers.com", "pass", Role.ADMIN);
        Chapter rejected = chapterService.rejectChapter(chapterId, "Le contenu doit être plus détaillé.", admin);

        assertEquals(ApprovalStatus.REJECTED, rejected.getStatus());
        assertEquals("Le contenu doit être plus détaillé.", rejected.getRejectionReason());
        verify(notificationService).notifyUser(eq(teacher), anyString(), anyString(), eq(NotificationType.COURSE_REJECTED), eq(chapterId), eq("CHAPTER"));
    }

    @Test
    void createLiveRecapBatchWithCourseSlugShouldCreateParentAndSubChapters() {
        ChapterRepository chapterRepository = mock(ChapterRepository.class);
        CourseRepository courseRepository = mock(CourseRepository.class);
        NotificationService notificationService = mock(NotificationService.class);
        ChapterService chapterService = new ChapterService(chapterRepository, courseRepository, notificationService);

        UUID courseId = UUID.randomUUID();
        Course course = new Course("HTML5 & CSS3", "Apprendre HTML et CSS");
        course.setId(courseId);
        course.setSlug("html-css");

        when(courseRepository.findBySlug("html-css")).thenReturn(Optional.of(course));
        when(chapterRepository.findRootChaptersByCourseId(courseId)).thenReturn(List.of());
        when(chapterRepository.save(any(Chapter.class))).thenAnswer(i -> {
            Chapter c = i.getArgument(0);
            if (c.getId() == null) {
                c.setId(UUID.randomUUID());
            }
            return c;
        });

        User teacher = new User("teacher1", "Cédric", "Ragot", "teacher@codebangers.com", "pass", Role.TEACHER);

        LiveRecapSubChapterDto sub1 = new LiveRecapSubChapterDto(
                "1. Sémantique HTML5", 1, "## Balises sémantiques\nLe header et le main.", "00:10:00", "https://cdn.noseumcode.fr/live.mp4#t=600"
        );
        LiveRecapSubChapterDto sub2 = new LiveRecapSubChapterDto(
                "2. Formulaires accessibles", 2, "## Formulaires\nInputs et labels.", "00:45:00", "https://cdn.noseumcode.fr/live.mp4#t=2700"
        );

        LiveRecapBatchRequest req = new LiveRecapBatchRequest(
                null, "html-css", "[Live #04] Sémantique & Formulaires",
                "Revue approfondie des bonnes pratiques HTML5", "https://cdn.noseumcode.fr/live.mp4",
                List.of(sub1, sub2)
        );

        LiveRecapBatchResponse resp = chapterService.createLiveRecapBatch(req, teacher);

        assertNotNull(resp);
        assertNotNull(resp.getParentChapterId());
        assertEquals(courseId, resp.getCourseId());
        assertEquals("html-css", resp.getCourseSlug());
        assertEquals("[Live #04] Sémantique & Formulaires", resp.getSessionTitle());
        assertEquals(ApprovalStatus.PENDING_APPROVAL, resp.getStatus());
        assertEquals(2, resp.getSubChaptersCount());
        assertEquals(2, resp.getSubChapterIds().size());

        verify(notificationService).notifyAdmins(anyString(), anyString(), eq(resp.getParentChapterId()), eq("CHAPTER"));
    }

    @Test
    void createLiveRecapBatchWithoutCourseShouldThrow() {
        ChapterRepository chapterRepository = mock(ChapterRepository.class);
        CourseRepository courseRepository = mock(CourseRepository.class);
        NotificationService notificationService = mock(NotificationService.class);
        ChapterService chapterService = new ChapterService(chapterRepository, courseRepository, notificationService);

        User teacher = new User("teacher1", "Cédric", "Ragot", "teacher@codebangers.com", "pass", Role.TEACHER);
        LiveRecapBatchRequest req = new LiveRecapBatchRequest();
        req.setSessionTitle("Session Test");

        assertThrows(IllegalArgumentException.class, () -> chapterService.createLiveRecapBatch(req, teacher));
    }
}
