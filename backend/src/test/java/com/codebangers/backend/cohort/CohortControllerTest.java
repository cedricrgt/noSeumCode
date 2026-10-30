package com.codebangers.backend.cohort;

import com.codebangers.backend.cohort.controller.CohortController;
import com.codebangers.backend.cohort.dto.CohortRequest;
import com.codebangers.backend.cohort.dto.CohortResponse;
import com.codebangers.backend.cohort.model.Cohort;
import com.codebangers.backend.cohort.model.CohortStatus;
import com.codebangers.backend.cohort.service.CohortService;
import com.codebangers.backend.course.model.EnrollmentTier;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
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

class CohortControllerTest {

    private CohortService cohortService;
    private UserService userService;
    private CohortController controller;

    private User admin;
    private Cohort cohort;
    private CohortResponse cohortResponse;

    @BeforeEach
    void setUp() {
        cohortService = mock(CohortService.class);
        userService = mock(UserService.class);
        controller = new CohortController(cohortService, userService);

        admin = new User("admin", "Admin", "User", "admin@codebangers.fr", "hash", Role.ADMIN);
        admin.setId(UUID.randomUUID());

        cohort = new Cohort("Cohorte Novembre 2026", "cohorte-novembre-2026", LocalDateTime.of(2026, 11, 1, 9, 0), 6);
        cohort.setId(UUID.randomUUID());
        cohort.setTier(EnrollmentTier.WEB);
        cohort.setStatus(CohortStatus.OPEN);
        cohort.setCreatedBy(admin);

        cohortResponse = new CohortResponse();
        cohortResponse.setId(cohort.getId());
        cohortResponse.setName("Cohorte Novembre 2026");
        cohortResponse.setSlug("cohorte-novembre-2026");
        cohortResponse.setTier(EnrollmentTier.WEB);
        cohortResponse.setStartDate(LocalDateTime.of(2026, 11, 1, 9, 0));
        cohortResponse.setMaxStudents(6);
        cohortResponse.setStatus(CohortStatus.OPEN);
        cohortResponse.setEnrolledCount(2);
        cohortResponse.setRemainingSeats(4);
        cohortResponse.setFull(false);
    }

    @Test
    @DisplayName("GET /api/cohorts should return open cohorts")
    void getOpenCohorts_shouldReturnOkList() {
        when(cohortService.getOpenCohorts()).thenReturn(List.of(cohortResponse));

        ResponseEntity<List<CohortResponse>> response = controller.getOpenCohorts();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("cohorte-novembre-2026", response.getBody().get(0).getSlug());
    }

    @Test
    @DisplayName("GET /api/cohorts/{id} should return cohort response")
    void getCohortById_shouldReturnOk() {
        UUID id = cohortResponse.getId();
        when(cohortService.getCohortById(id)).thenReturn(Optional.of(cohortResponse));

        ResponseEntity<CohortResponse> response = controller.getCohortById(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(id, response.getBody().getId());
        assertEquals(4, response.getBody().getRemainingSeats());
    }

    @Test
    @DisplayName("GET /api/cohorts/slug/{slug} should return cohort response")
    void getCohortBySlug_shouldReturnOk() {
        when(cohortService.getCohortBySlug("cohorte-novembre-2026")).thenReturn(Optional.of(cohortResponse));

        ResponseEntity<CohortResponse> response = controller.getCohortBySlug("cohorte-novembre-2026");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("cohorte-novembre-2026", response.getBody().getSlug());
    }

    @Test
    @DisplayName("POST /api/cohorts should create cohort with authenticated admin user")
    void createCohort_shouldReturnCreated() {
        CohortRequest request = new CohortRequest(
                "Cohorte Novembre 2026",
                "cohorte-novembre-2026",
                LocalDateTime.of(2026, 11, 1, 9, 0),
                6
        );

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(admin.getEmail());
        when(userService.getUserByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(cohortService.createCohort(eq(request), eq(admin))).thenReturn(cohort);
        when(cohortService.mapToResponse(cohort)).thenReturn(cohortResponse);

        ResponseEntity<CohortResponse> response = controller.createCohort(request, jwt);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(cohortResponse.getId(), response.getBody().getId());
        verify(cohortService).createCohort(eq(request), eq(admin));
    }

    @Test
    @DisplayName("PUT /api/cohorts/{id} should update cohort")
    void updateCohort_shouldReturnOk() {
        UUID id = cohortResponse.getId();
        CohortRequest request = new CohortRequest(
                "Cohorte Mise à Jour",
                "cohorte-novembre-2026",
                LocalDateTime.of(2026, 11, 1, 9, 0),
                6
        );

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(admin.getEmail());
        when(userService.getUserByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(cohortService.updateCohort(eq(id), eq(request), eq(admin))).thenReturn(cohort);
        when(cohortService.mapToResponse(cohort)).thenReturn(cohortResponse);

        ResponseEntity<CohortResponse> response = controller.updateCohort(id, request, jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(cohortService).updateCohort(eq(id), eq(request), eq(admin));
    }

    @Test
    @DisplayName("DELETE /api/cohorts/{id} should return no content")
    void deleteCohort_shouldReturnNoContent() {
        UUID id = cohortResponse.getId();

        ResponseEntity<Void> response = controller.deleteCohort(id);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(cohortService).deleteCohort(id);
    }
}
