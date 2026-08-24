package com.codebangers.backend.course;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.chapter.repository.ChapterRepository;
import com.codebangers.backend.course.model.ApprovalStatus;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.service.ChapterService;
import com.codebangers.backend.notification.model.NotificationType;
import com.codebangers.backend.notification.service.NotificationService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import org.junit.jupiter.api.Test;

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
}
