package com.codebangers.backend.course;

import com.codebangers.backend.course.controller.ChapterController;
import com.codebangers.backend.course.dto.LiveRecapBatchRequest;
import com.codebangers.backend.course.dto.LiveRecapBatchResponse;
import com.codebangers.backend.course.dto.LiveRecapSubChapterDto;
import com.codebangers.backend.course.model.ApprovalStatus;
import com.codebangers.backend.course.service.ChapterService;
import com.codebangers.backend.course.service.EnrollmentService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class ChapterControllerSecurityTest {

    private ChapterService chapterService;
    private EnrollmentService enrollmentService;
    private UserRepository userRepository;
    private ChapterController chapterController;

    private User teacher;
    private Jwt jwt;

    @BeforeEach
    void setUp() {
        chapterService = mock(ChapterService.class);
        enrollmentService = mock(EnrollmentService.class);
        userRepository = mock(UserRepository.class);

        chapterController = new ChapterController(chapterService, enrollmentService, userRepository);

        teacher = new User("teacher_html", "Cédric", "Ragot", "teacher@codebangers.com", "hash", Role.TEACHER);
        teacher.setId(UUID.randomUUID());

        jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn("teacher@codebangers.com");
        when(userRepository.findByEmail("teacher@codebangers.com")).thenReturn(Optional.of(teacher));
    }

    @Test
    @DisplayName("POST /api/chapters/course/{courseId}/live-recap should return 201 CREATED with batch response")
    void createLiveRecapBatchShouldReturnCreated() {
        UUID courseId = UUID.randomUUID();
        UUID rootId = UUID.randomUUID();

        LiveRecapSubChapterDto sub = new LiveRecapSubChapterDto("Sous-chapitre 1", 1, "Markdown contenu", "00:05:00", null);
        LiveRecapBatchRequest request = new LiveRecapBatchRequest(
                courseId, "html-css", "Live #04", "Résumé", "https://cdn.noseumcode.fr/live.mp4", List.of(sub)
        );

        LiveRecapBatchResponse expectedResponse = new LiveRecapBatchResponse(
                rootId, courseId, "HTML5 & CSS3", "html-css", "Live #04", ApprovalStatus.PENDING_APPROVAL, 1, List.of(UUID.randomUUID()), LocalDateTime.now()
        );

        when(chapterService.createLiveRecapBatch(any(LiveRecapBatchRequest.class), eq(teacher))).thenReturn(expectedResponse);

        ResponseEntity<?> response = chapterController.createLiveRecapBatch(courseId, request, jwt);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof LiveRecapBatchResponse);
        LiveRecapBatchResponse actual = (LiveRecapBatchResponse) response.getBody();
        assertEquals(rootId, actual.getParentChapterId());
        assertEquals("Live #04", actual.getSessionTitle());
        assertEquals(ApprovalStatus.PENDING_APPROVAL, actual.getStatus());
    }

    @Test
    @DisplayName("POST /api/chapters/course/{courseId}/live-recap should return 400 Bad Request on service IllegalArgumentException")
    void createLiveRecapBatchShouldHandleIllegalArgumentException() {
        UUID courseId = UUID.randomUUID();
        LiveRecapBatchRequest request = new LiveRecapBatchRequest();

        when(chapterService.createLiveRecapBatch(any(LiveRecapBatchRequest.class), eq(teacher)))
                .thenThrow(new IllegalArgumentException("Le titre de la session live est obligatoire."));

        ResponseEntity<?> response = chapterController.createLiveRecapBatch(courseId, request, jwt);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
