package com.codebangers.backend.course.service;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.chapter.repository.ChapterRepository;
import com.codebangers.backend.content.model.Content;
import com.codebangers.backend.course.dto.LiveRecapBatchRequest;
import com.codebangers.backend.course.dto.LiveRecapBatchResponse;
import com.codebangers.backend.course.dto.LiveRecapSubChapterDto;
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
import java.util.ArrayList;
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
        return createChapter(courseId, title, position, null, author);
    }

    public Chapter createChapter(UUID courseId, String title, Integer position, String content, User author) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        Chapter chapter = new Chapter(course, title, position);
        chapter.setCreatedBy(author);

        if (content != null && !content.trim().isEmpty()) {
            Content c = new Content(chapter, Content.ContentType.PARAGRAPH, content.trim(), 1);
            c.setCreatedBy(author);
            chapter.addContent(c);
        }

        if (author != null && author.getRole() == Role.ADMIN) {
            chapter.setStatus(ApprovalStatus.APPROVED);
        } else {
            chapter.setStatus(ApprovalStatus.PENDING_APPROVAL);
            chapter.setSubmittedAt(LocalDateTime.now());
        }

        Chapter savedChapter = chapterRepository.save(chapter);

        if (savedChapter.getStatus() == ApprovalStatus.PENDING_APPROVAL) {
            // Notification aux admins
            notificationService.notifyAdmins(
                    "Nouvelle section soumise",
                    (author != null ? (author.getFirstName() != null ? author.getFirstName() + " " + (author.getLastName() != null ? author.getLastName() : "") : author.getUserName()) : "Un enseignant") +
                            " a soumis la section \"" + title + "\" dans le cours \"" + course.getTitle() + "\" pour validation.",
                    savedChapter.getId(),
                    "CHAPTER"
            );
        }

        return savedChapter;
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
        }

        Chapter savedChapter = chapterRepository.save(chapter);

        if (savedChapter.getStatus() == ApprovalStatus.PENDING_APPROVAL) {
            // Notification aux admins
            notificationService.notifyAdmins(
                    "Nouvelle sous-section soumise",
                    (author != null ? (author.getFirstName() != null ? author.getFirstName() + " " + (author.getLastName() != null ? author.getLastName() : "") : author.getUserName()) : "Un enseignant") +
                            " a soumis la sous-section \"" + title + "\" dans le cours \"" + parent.getCourse().getTitle() + "\" pour validation.",
                    savedChapter.getId(),
                    "CHAPTER"
            );
        }

        return savedChapter;
    }

    public Chapter updateChapter(UUID chapterId, String title, Integer position, User editor) {
        return updateChapter(chapterId, title, position, null, editor);
    }

    public Chapter updateChapter(UUID chapterId, String title, Integer position, String content, User editor) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found: " + chapterId));

        chapter.setTitle(title);
        chapter.setPosition(position);

        if (content != null) {
            if (chapter.getContents() == null || chapter.getContents().isEmpty()) {
                Content c = new Content(chapter, Content.ContentType.PARAGRAPH, content.trim(), 1);
                c.setCreatedBy(editor);
                chapter.addContent(c);
            } else {
                Content first = chapter.getContents().get(0);
                first.setBody(content.trim());
            }
        }

        if (editor != null && editor.getRole() == Role.ADMIN) {
            chapter.setStatus(ApprovalStatus.APPROVED);
        } else {
            // Repasse en attente de validation si modifié par un enseignant
            chapter.setStatus(ApprovalStatus.PENDING_APPROVAL);
            chapter.setSubmittedAt(LocalDateTime.now());
            chapter.setRejectionReason(null);
        }

        Chapter savedChapter = chapterRepository.save(chapter);

        if (savedChapter.getStatus() == ApprovalStatus.PENDING_APPROVAL) {
            notificationService.notifyAdmins(
                    "Section modifiée en attente",
                    (editor != null ? (editor.getFirstName() != null ? editor.getFirstName() + " " + (editor.getLastName() != null ? editor.getLastName() : "") : editor.getUserName()) : "Un enseignant") +
                            " a modifié la section \"" + title + "\" dans le cours \"" + (savedChapter.getCourse() != null ? savedChapter.getCourse().getTitle() : "") + "\".",
                    savedChapter.getId(),
                    "CHAPTER"
            );
        }

        return savedChapter;
    }

    public Chapter submitForApproval(UUID chapterId, User user) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found: " + chapterId));

        chapter.setStatus(ApprovalStatus.PENDING_APPROVAL);
        chapter.setSubmittedAt(LocalDateTime.now());
        chapter.setRejectionReason(null);

        Chapter savedChapter = chapterRepository.save(chapter);

        notificationService.notifyAdmins(
                "Demande de validation de section",
                (user != null ? (user.getFirstName() != null ? user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : "") : user.getUserName()) : "Un enseignant") +
                        " a soumis la section \"" + savedChapter.getTitle() + "\" pour validation.",
                savedChapter.getId(),
                "CHAPTER"
        );

        return savedChapter;
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

    public LiveRecapBatchResponse createLiveRecapBatch(LiveRecapBatchRequest request, User author) {
        if (request == null) {
            throw new IllegalArgumentException("La requête de récapitulatif live ne peut pas être nulle.");
        }
        if (request.getSessionTitle() == null || request.getSessionTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Le titre de la session live est obligatoire.");
        }

        Course course;
        if (request.getCourseId() != null) {
            course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new IllegalArgumentException("Cours introuvable avec l'identifiant: " + request.getCourseId()));
        } else if (request.getCourseSlug() != null && !request.getCourseSlug().trim().isEmpty()) {
            course = courseRepository.findBySlug(request.getCourseSlug().trim())
                    .orElseThrow(() -> new IllegalArgumentException("Cours introuvable avec le slug: " + request.getCourseSlug()));
        } else {
            throw new IllegalArgumentException("Un identifiant de cours (courseId) ou un slug (courseSlug) est requis.");
        }

        // Détermination de la prochaine position pour le chapitre racine
        List<Chapter> rootChapters = chapterRepository.findRootChaptersByCourseId(course.getId());
        int nextPos = rootChapters.stream()
                .mapToInt(c -> c.getPosition() != null ? c.getPosition() : 0)
                .max()
                .orElse(0) + 1;

        // Création du Chapitre Parent (statut PENDING_APPROVAL pour validation enseignant/admin)
        Chapter rootChapter = new Chapter(course, request.getSessionTitle().trim(), nextPos);
        rootChapter.setCreatedBy(author);
        rootChapter.setStatus(ApprovalStatus.PENDING_APPROVAL);
        rootChapter.setSubmittedAt(LocalDateTime.now());

        if ((request.getSummary() != null && !request.getSummary().isBlank()) ||
            (request.getVideoUrl() != null && !request.getVideoUrl().isBlank())) {
            StringBuilder sb = new StringBuilder();
            if (request.getSummary() != null && !request.getSummary().isBlank()) {
                sb.append("> ").append(request.getSummary().trim()).append("\n\n");
            }
            if (request.getVideoUrl() != null && !request.getVideoUrl().isBlank()) {
                sb.append("📺 **Replay Vidéo de la session :** [Visionner la conférence en plein écran](")
                  .append(request.getVideoUrl().trim())
                  .append(")\n");
            }
            Content rootContent = new Content(rootChapter, Content.ContentType.MARKDOWN, sb.toString().trim(), 1);
            rootContent.setMediaUrl(request.getVideoUrl());
            rootContent.setCreatedBy(author);
            rootContent.setStatus(ApprovalStatus.PENDING_APPROVAL);
            rootContent.setSubmittedAt(LocalDateTime.now());
            rootChapter.addContent(rootContent);
        }

        Chapter savedRoot = chapterRepository.save(rootChapter);
        List<UUID> subChapterIds = new ArrayList<>();

        if (request.getSubChapters() != null && !request.getSubChapters().isEmpty()) {
            int subIndex = 1;
            for (LiveRecapSubChapterDto subDto : request.getSubChapters()) {
                int pos = subDto.getPosition() != null ? subDto.getPosition() : subIndex;
                Chapter subChapter = new Chapter(course, savedRoot, subDto.getTitle().trim(), pos);
                subChapter.setCreatedBy(author);
                subChapter.setStatus(ApprovalStatus.PENDING_APPROVAL);
                subChapter.setSubmittedAt(LocalDateTime.now());

                StringBuilder mdBody = new StringBuilder();
                if (subDto.getVideoTimestampStart() != null && !subDto.getVideoTimestampStart().isBlank()) {
                    mdBody.append("⏱️ *Début du segment : ").append(subDto.getVideoTimestampStart().trim()).append("*\n\n");
                }
                if (subDto.getMarkdownContent() != null) {
                    mdBody.append(subDto.getMarkdownContent().trim());
                }

                String media = (subDto.getMediaUrl() != null && !subDto.getMediaUrl().isBlank())
                        ? subDto.getMediaUrl().trim()
                        : request.getVideoUrl();

                Content subContent = new Content(subChapter, Content.ContentType.MARKDOWN, mdBody.toString(), 1);
                subContent.setMediaUrl(media);
                subContent.setCreatedBy(author);
                subContent.setStatus(ApprovalStatus.PENDING_APPROVAL);
                subContent.setSubmittedAt(LocalDateTime.now());
                subChapter.addContent(subContent);

                Chapter savedSub = chapterRepository.save(subChapter);
                subChapterIds.add(savedSub.getId());
                subIndex++;
            }
        }

        notificationService.notifyAdmins(
                "Nouveau récapitulatif live généré",
                (author != null ? author.getUserName() : "Le système d'ingestion") +
                        " a généré le récapitulatif live \"" + savedRoot.getTitle() + "\" (" + subChapterIds.size() + " sous-chapitres) dans le cours \"" + course.getTitle() + "\" pour relecture et approbation.",
                savedRoot.getId(),
                "CHAPTER"
        );

        return new LiveRecapBatchResponse(
                savedRoot.getId(),
                course.getId(),
                course.getTitle(),
                course.getSlug(),
                savedRoot.getTitle(),
                savedRoot.getStatus(),
                subChapterIds.size(),
                subChapterIds,
                savedRoot.getCreatedAt() != null ? savedRoot.getCreatedAt() : LocalDateTime.now()
        );
    }
}
