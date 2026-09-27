package com.codebangers.backend.cohort;

import com.codebangers.backend.cohort.dto.CohortRequest;
import com.codebangers.backend.cohort.dto.CohortResponse;
import com.codebangers.backend.cohort.model.Cohort;
import com.codebangers.backend.cohort.model.CohortStatus;
import com.codebangers.backend.cohort.repository.CohortRepository;
import com.codebangers.backend.cohort.service.CohortService;
import com.codebangers.backend.config.exception.DuplicateResourceException;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.model.EnrollmentTier;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CohortServiceTest {

    private CohortRepository cohortRepository;
    private CohortService cohortService;

    private User admin;
    private Cohort cohort;

    @BeforeEach
    void setUp() {
        cohortRepository = mock(CohortRepository.class);
        cohortService = new CohortService(cohortRepository);

        admin = new User("admin", "Admin", "User", "admin@codebangers.fr", "hash", Role.ADMIN);
        admin.setId(UUID.randomUUID());

        cohort = new Cohort(
                "Cohorte Novembre 2026",
                "cohorte-novembre-2026",
                LocalDateTime.of(2026, 11, 1, 9, 0),
                6
        );
        cohort.setId(UUID.randomUUID());
        cohort.setTier(EnrollmentTier.WEB);
        cohort.setStatus(CohortStatus.OPEN);
        cohort.setCreatedBy(admin);
    }

    @Test
    @DisplayName("createCohort should enforce 6 students maximum by default (ADR-013)")
    void createCohort_shouldDefaultToSixStudents() {
        CohortRequest request = new CohortRequest(
                "Nouvelle Cohorte",
                "nouvelle-cohorte",
                LocalDateTime.of(2027, 3, 1, 9, 0),
                null
        );
        request.setTier(EnrollmentTier.STARTER);

        when(cohortRepository.findBySlug("nouvelle-cohorte")).thenReturn(Optional.empty());
        when(cohortRepository.save(any(Cohort.class))).thenAnswer(invocation -> {
            Cohort saved = invocation.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });
        when(cohortRepository.countPaidEnrollments(any())).thenReturn(0L);

        Cohort created = cohortService.createCohort(request, admin);
        CohortResponse response = cohortService.mapToResponse(created);

        assertNotNull(response);
        assertEquals(6, response.getMaxStudents(), "Max students must default to 6 per ADR-013");
        assertEquals(6, response.getRemainingSeats());
        assertEquals(0, response.getEnrolledCount());
        verify(cohortRepository).save(any(Cohort.class));
    }

    @Test
    @DisplayName("createCohort should throw DuplicateResourceException on duplicate slug")
    void createCohort_shouldThrowOnDuplicateSlug() {
        CohortRequest request = new CohortRequest(
                "Cohorte Existante",
                "cohorte-existante",
                LocalDateTime.of(2027, 3, 1, 9, 0),
                6
        );

        when(cohortRepository.findBySlug("cohorte-existante")).thenReturn(Optional.of(cohort));

        assertThrows(DuplicateResourceException.class, () -> cohortService.createCohort(request, admin));
        verify(cohortRepository, never()).save(any(Cohort.class));
    }

    @Test
    @DisplayName("getCohortById should calculate remainingSeats accurately")
    void getCohortById_shouldReturnResponseWithCalculatedSeats() {
        when(cohortRepository.findById(cohort.getId())).thenReturn(Optional.of(cohort));
        when(cohortRepository.countPaidEnrollments(cohort.getId())).thenReturn(4L);

        Optional<CohortResponse> opt = cohortService.getCohortById(cohort.getId());

        assertTrue(opt.isPresent());
        CohortResponse response = opt.get();
        assertEquals(cohort.getId(), response.getId());
        assertEquals(cohort.getName(), response.getName());
        assertEquals(4, response.getEnrolledCount());
        assertEquals(2, response.getRemainingSeats(), "6 max - 4 enrolled = 2 remaining");
        assertFalse(response.isFull());
    }

    @Test
    @DisplayName("getCohortById should report isFull = true when cap of 6 is reached")
    void getCohortById_shouldReportIsFullWhenSixStudentsEnrolled() {
        when(cohortRepository.findById(cohort.getId())).thenReturn(Optional.of(cohort));
        when(cohortRepository.countPaidEnrollments(cohort.getId())).thenReturn(6L);

        Optional<CohortResponse> opt = cohortService.getCohortById(cohort.getId());

        assertTrue(opt.isPresent());
        CohortResponse response = opt.get();
        assertEquals(6, response.getEnrolledCount());
        assertEquals(0, response.getRemainingSeats());
        assertTrue(response.isFull());
    }

    @Test
    @DisplayName("getCohortEntity should throw ResourceNotFoundException when id unknown")
    void getCohortEntity_shouldThrowWhenNotFound() {
        UUID unknownId = UUID.randomUUID();
        when(cohortRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> cohortService.getCohortEntity(unknownId));
    }

    @Test
    @DisplayName("getCohortBySlug should return cohort if found")
    void getCohortBySlug_shouldReturnCohort() {
        when(cohortRepository.findBySlug("cohorte-novembre-2026")).thenReturn(Optional.of(cohort));
        when(cohortRepository.countPaidEnrollments(cohort.getId())).thenReturn(1L);

        Optional<CohortResponse> opt = cohortService.getCohortBySlug("cohorte-novembre-2026");

        assertTrue(opt.isPresent());
        CohortResponse response = opt.get();
        assertEquals("cohorte-novembre-2026", response.getSlug());
        assertEquals(1, response.getEnrolledCount());
    }

    @Test
    @DisplayName("getOpenCohorts should return open or in-progress cohorts sorted by startDate")
    void getOpenCohorts_shouldFilterActiveCohorts() {
        Cohort cohort2 = new Cohort(
                "Cohorte Janvier 2027",
                "cohorte-janvier-2027",
                LocalDateTime.of(2027, 1, 15, 9, 0),
                6
        );
        cohort2.setId(UUID.randomUUID());
        cohort2.setTier(EnrollmentTier.WEB);
        cohort2.setStatus(CohortStatus.OPEN);

        when(cohortRepository.findByStatusInOrderByStartDateAsc(List.of(CohortStatus.OPEN, CohortStatus.IN_PROGRESS)))
                .thenReturn(List.of(cohort, cohort2));
        when(cohortRepository.countPaidEnrollments(any())).thenReturn(2L);

        List<CohortResponse> results = cohortService.getOpenCohorts();

        assertEquals(2, results.size());
        assertEquals("cohorte-novembre-2026", results.get(0).getSlug());
        assertEquals("cohorte-janvier-2027", results.get(1).getSlug());
    }

    @Test
    @DisplayName("updateCohort should modify details and status")
    void updateCohort_shouldUpdateFields() {
        CohortRequest updateReq = new CohortRequest(
                "Cohorte Novembre Renommée",
                "cohorte-novembre-2026",
                LocalDateTime.of(2026, 11, 10, 9, 0),
                6
        );
        updateReq.setTier(EnrollmentTier.VIP);
        updateReq.setStatus(CohortStatus.IN_PROGRESS);

        when(cohortRepository.findById(cohort.getId())).thenReturn(Optional.of(cohort));
        when(cohortRepository.save(any(Cohort.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(cohortRepository.countPaidEnrollments(cohort.getId())).thenReturn(3L);

        Cohort updated = cohortService.updateCohort(cohort.getId(), updateReq, admin);
        CohortResponse response = cohortService.mapToResponse(updated);

        assertNotNull(response);
        assertEquals("Cohorte Novembre Renommée", response.getName());
        assertEquals(EnrollmentTier.VIP, response.getTier());
        assertEquals(CohortStatus.IN_PROGRESS, response.getStatus());
    }

    @Test
    @DisplayName("deleteCohort should delete entity when found")
    void deleteCohort_shouldDelete() {
        when(cohortRepository.findById(cohort.getId())).thenReturn(Optional.of(cohort));

        cohortService.deleteCohort(cohort.getId());

        verify(cohortRepository).delete(cohort);
    }
}
