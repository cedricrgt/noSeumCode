package com.codebangers.backend.course.security;

import com.codebangers.backend.chapter.repository.ChapterRepository;
import com.codebangers.backend.content.repository.ContentRepository;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component("courseSecurity")
public class CourseSecurity {

    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;

    public CourseSecurity(CourseRepository courseRepository,
                          ChapterRepository chapterRepository,
                          ContentRepository contentRepository,
                          UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.chapterRepository = chapterRepository;
        this.contentRepository = contentRepository;
        this.userRepository = userRepository;
    }

    public boolean canManageCourse(UUID courseId, Authentication authentication) {
        if (authentication == null || courseId == null) {
            return false;
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (isAdmin) {
            return true;
        }

        UUID userId = extractUserId(authentication);
        if (userId == null) {
            return false;
        }

        boolean isTeacher = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_TEACHER".equals(a.getAuthority()));
        if (!isTeacher) {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty() || userOpt.get().getRole() != Role.TEACHER) {
                return false;
            }
        }

        return courseRepository.isTeacherAssignedToCourse(courseId, userId);
    }

    public boolean canManageChapter(UUID chapterId, Authentication authentication) {
        if (authentication == null || chapterId == null) {
            return false;
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (isAdmin) {
            return true;
        }

        return chapterRepository.findById(chapterId)
                .map(ch -> ch.getCourse() != null ? ch.getCourse().getId() : null)
                .map(courseId -> canManageCourse(courseId, authentication))
                .orElse(false);
    }

    public boolean canManageContent(UUID contentId, Authentication authentication) {
        if (authentication == null || contentId == null) {
            return false;
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (isAdmin) {
            return true;
        }

        return contentRepository.findById(contentId)
                .map(c -> c.getChapter() != null ? c.getChapter().getId() : null)
                .map(chapterId -> canManageChapter(chapterId, authentication))
                .orElse(false);
    }

    private UUID extractUserId(Authentication authentication) {
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            String userIdClaim = jwt.getClaimAsString("userId");
            if (userIdClaim != null) {
                try {
                    return UUID.fromString(userIdClaim);
                } catch (IllegalArgumentException ignored) {
                }
            }
            String subject = jwt.getSubject();
            if (subject != null) {
                return userRepository.findByEmail(subject).map(User::getId).orElse(null);
            }
        }

        String name = authentication.getName();
        if (name != null) {
            return userRepository.findByEmail(name)
                    .or(() -> userRepository.findByUserName(name))
                    .map(User::getId)
                    .orElse(null);
        }

        return null;
    }
}
