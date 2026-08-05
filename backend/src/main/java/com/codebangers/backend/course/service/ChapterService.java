package com.codebangers.backend.course.service;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.chapter.repository.ChapterRepository;
import com.codebangers.backend.course.repository.CourseRepository;
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

    public ChapterService(ChapterRepository chapterRepository,
                        CourseRepository courseRepository) {
        this.chapterRepository = chapterRepository;
        this.courseRepository = courseRepository;
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

    public Chapter createChapter(UUID courseId, String title, Integer position) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        Chapter chapter = new Chapter(course, title, position);
        return chapterRepository.save(chapter);
    }

    public Chapter createSubChapter(UUID parentChapterId, String title, Integer position) {
        Chapter parent = chapterRepository.findById(parentChapterId)
            .orElseThrow(() -> new IllegalArgumentException("Parent chapter not found: " + parentChapterId));

        Chapter chapter = new Chapter(parent.getCourse(), parent, title, position);
        return chapterRepository.save(chapter);
    }

    public Chapter updateChapter(UUID chapterId, String title, Integer position) {
        Chapter chapter = chapterRepository.findById(chapterId)
            .orElseThrow(() -> new IllegalArgumentException("Chapter not found: " + chapterId));

        chapter.setTitle(title);
        chapter.setPosition(position);
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
