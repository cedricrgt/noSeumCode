package com.codebangers.backend.course.service;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.chapter.repository.ChapterRepository;
import com.codebangers.backend.course.model.ApprovalStatus;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.notification.model.NotificationType;
import com.codebangers.backend.notification.service.NotificationService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;
    private final NotificationService notificationService;

    public ChapterService(ChapterRepository chapterRepository,
                          CourseRepository courseRepository,
                          NotificationService notificationService) {
        this.chapterRepository = chapterRepository;
        this.courseRepository = courseRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public Optional<Chapter> getChapterById(UUID id) {
        return chapterRepository.findByIdWithAssociations(id);
    }

    @Transactional(readOnly = true)
    public List<Chapter> getRootChaptersByCourse(UUID courseId) {
        return chapterRepository.findRootChaptersByCourseId(courseId);
    }

    @Transactional(readOnly = true)
    public List<Chapter> getChaptersByCourse(UUID courseId) {
        return chapterRepository.findByCourseId(courseId);
    }

    @Transactional(readOnly = true)
    public List<Chapter> getSubChapters(UUID parentId) {
        return chapterRepository.findSubChaptersByParentId(parentId);
    }

    @Transactional(readOnly = true)
    public List<Chapter> getActiveChaptersByCourse(UUID courseId) {
        return chapterRepository.findActiveByCourseId(courseId);
    }

    @Transactional(readOnly = true)
    public List<Chapter> getApprovedChaptersByCourse(UUID courseId) {
        return chapterRepository.findApprovedByCourseId(courseId);
    }

    @Transactional(readOnly = true)
    public List<Chapter> getPendingApprovalChapters() {
        return chapterRepository.findByStatusWithCourse(ApprovalStatus.PENDING_APPROVAL);
    }

    public Chapter createChapter(UUID courseId, String title, Integer position, User author) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        Chapter chapter = new Chapter(course, title, position);
        chapter.setCreatedBy(author);

        if (author != null && author.getRole() == Role.ADMIN) {
            chapter.setStatus(ApprovalStatus.APPROVED);
        } else {
            chapter.setStatus(ApprovalStatus.PENDING_APPROVAL);
            chapter.setSubmittedAt(LocalDateTime.now());
            // Notification aux admins
            notificationService.notifyAdmins(
                    "Nouvelle section soumise",
                    (author != null ? author.getFirstName() + " " + author.getLastName() : "Un enseignant") +
                            " a soumis la section \"" + title + "\" dans le cours \"" + course.getTitle() + "\" pour validation.",
                    chapter.getId(),
                    "CHAPTER"
            );
        }

        return chapterRepository.save(chapter);
    }

    public Chapter createSubChapter(UUID parentChapterId, String title, Integer position, User author) {
        Chapter parent = chapterRepository.findById(parentChapterId)
                .orElseThrow(() -> new IllegalArgumentException("Parent chapter not found: " + parentChapterId));

        Chapter chapter = new Chapter(parent.getCourse(), parent, title, position);
        chapter.setCreatedBy(author);

        if (author != null && author.getRole() == Role.ADMIN) {
            chapter.setStatus(ApprovalStatus.APPROVED);
        } else {
            chapter.setStatus(ApprovalStatus.PENDING_APPROVAL);
            chapter.setSubmittedAt(LocalDateTime.now());
            // Notification aux admins
            notificationService.notifyAdmins(
                    "Nouvelle sous-section soumise",
                    (author != null ? author.getFirstName() + " " + author.getLastName() : "Un enseignant") +
                            " a soumis la sous-section \"" + title + "\" dans le cours \"" + parent.getCourse().getTitle() + "\" pour validation.",
                    chapter.getId(),
                    "CHAPTER"
            );
        }

        return chapterRepository.save(chapter);
    }

    public Chapter updateChapter(UUID chapterId, String title, Integer position, User editor) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found: " + chapterId));

        chapter.setTitle(title);
        chapter.setPosition(position);

        if (editor != null && editor.getRole() == Role.ADMIN) {
            chapter.setStatus(ApprovalStatus.APPROVED);
        } else {
            // Repasse en attente de validation si modifié par un enseignant
            chapter.setStatus(ApprovalStatus.PENDING_APPROVAL);
            chapter.setSubmittedAt(LocalDateTime.now());
            chapter.setRejectionReason(null);
            notificationService.notifyAdmins(
                    "Section modifiée en attente de validation",
                    (editor != null ? editor.getFirstName() + " " + editor.getLastName() : "Un enseignant") +
                            " a modifié la section \"" + title + "\" dans le cours \"" + chapter.getCourse().getTitle() + "\".",
                    chapter.getId(),
                    "CHAPTER"
            );
        }

        return chapterRepository.save(chapter);
    }

    public Chapter submitForApproval(UUID chapterId, User user) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found: " + chapterId));

        chapter.setStatus(ApprovalStatus.PENDING_APPROVAL);
        chapter.setSubmittedAt(LocalDateTime.now());
        chapter.setRejectionReason(null);

        notificationService.notifyAdmins(
                "Demande de validation de section",
                (user != null ? user.getFirstName() + " " + user.getLastName() : "Un enseignant") +
                        " a soumis la section \"" + chapter.getTitle() + "\" pour validation.",
                chapter.getId(),
                "CHAPTER"
        );

        return chapterRepository.save(chapter);
    }

    public Chapter approveChapter(UUID chapterId, User admin) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found: " + chapterId));

        chapter.setStatus(ApprovalStatus.APPROVED);
        chapter.setReviewedAt(LocalDateTime.now());
        chapter.setReviewedBy(admin);
        chapter.setRejectionReason(null);

        // Notifier l'auteur enseignant
        if (chapter.getCreatedBy() != null) {
            notificationService.notifyUser(
                    chapter.getCreatedBy(),
                    "Section validée !",
                    "Votre section \"" + chapter.getTitle() + "\" du cours \"" + chapter.getCourse().getTitle() + "\" a été validée et publiée.",
                    NotificationType.COURSE_APPROVED,
                    chapter.getId(),
                    "CHAPTER"
            );
        }

        return chapterRepository.save(chapter);
    }

    public Chapter rejectChapter(UUID chapterId, String reason, User admin) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found: " + chapterId));

        chapter.setStatus(ApprovalStatus.REJECTED);
        chapter.setRejectionReason(reason);
        chapter.setReviewedAt(LocalDateTime.now());
        chapter.setReviewedBy(admin);

        // Notifier l'auteur enseignant
        if (chapter.getCreatedBy() != null) {
            notificationService.notifyUser(
                    chapter.getCreatedBy(),
                    "Section refusée",
                    "Votre section \"" + chapter.getTitle() + "\" du cours \"" + chapter.getCourse().getTitle() +
                            "\" a été refusée. Motif : " + (reason != null && !reason.isBlank() ? reason : "Non spécifié"),
                    NotificationType.COURSE_REJECTED,
                    chapter.getId(),
                    "CHAPTER"
            );
        }

        return chapterRepository.save(chapter);
    }

    public void softDeleteChapter(UUID chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found: " + chapterId));

        chapter.setDeletedAt(LocalDateTime.now());
        chapterRepository.save(chapter);
    }

    public void deleteChapter(UUID chapterId) {
        chapterRepository.deleteById(chapterId);
    }
}
