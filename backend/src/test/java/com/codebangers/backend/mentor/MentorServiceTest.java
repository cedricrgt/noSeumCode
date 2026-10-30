package com.codebangers.backend.mentor;

import com.codebangers.backend.cohort.model.Cohort;
import com.codebangers.backend.cohort.model.CohortStatus;
import com.codebangers.backend.cohort.repository.CohortRepository;
import com.codebangers.backend.course.model.EnrollmentTier;
import com.codebangers.backend.mentor.model.StudentMentorQuota;
import com.codebangers.backend.mentor.model.StudentMentorQuotaId;
import com.codebangers.backend.mentor.repository.StudentMentorQuotaRepository;
import com.codebangers.backend.mentor.service.MentorService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MentorServiceTest {

    @Mock
    private CohortRepository cohortRepository;

    @Mock
    private StudentMentorQuotaRepository quotaRepository;

    private MentorService mentorService;
    private User testUser;
    private Cohort testCohort;

    @BeforeEach
    void setUp() {
        mentorService = new MentorService(cohortRepository, quotaRepository);

        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("student@noseumcode.fr");
        testUser.setRole(Role.STUDENT);

        testCohort = new Cohort("Cohorte Novembre 2026", "cohorte-nov-2026",
                java.time.LocalDateTime.now(), 6);
        testCohort.setId(UUID.randomUUID());
        testCohort.setTier(EnrollmentTier.STARTER);
        testCohort.setMentorSlotsTotal(3);
        testCohort.setMentorSlotsRemaining(3);
    }

    @Test
    @DisplayName("Achat Suivi Mentor (4 sessions) sur Starter : décrémente le stock et alloue 4 sessions Starter")
    void testPurchaseMentorAddonStarter() {
        when(quotaRepository.findById(any(StudentMentorQuotaId.class))).thenReturn(Optional.empty());

        mentorService.processMentorAddonPurchase(testUser, testCohort, "mentor_4sessions", EnrollmentTier.STARTER);

        assertThat(testCohort.getMentorSlotsRemaining()).isEqualTo(2);
        verify(cohortRepository).save(testCohort);

        ArgumentCaptor<StudentMentorQuota> captor = ArgumentCaptor.forClass(StudentMentorQuota.class);
        verify(quotaRepository).save(captor.capture());

        StudentMentorQuota savedQuota = captor.getValue();
        assertThat(savedQuota.getSessionsTotal()).isEqualTo(4);
        assertThat(savedQuota.getSessionsAvailablePhaseCurrent()).isEqualTo(4);
        assertThat(savedQuota.getSessionsReservedPhaseNext()).isEqualTo(0);
    }

    @Test
    @DisplayName("Achat Suivi Mentor (4 sessions) sur Web Pro : alloue 1 session HTML/CSS et réserve 3 sessions JS")
    void testPurchaseMentorAddonWebPro() {
        when(quotaRepository.findById(any(StudentMentorQuotaId.class))).thenReturn(Optional.empty());

        mentorService.processMentorAddonPurchase(testUser, testCohort, "mentor_4sessions", EnrollmentTier.WEB);

        assertThat(testCohort.getMentorSlotsRemaining()).isEqualTo(2);

        ArgumentCaptor<StudentMentorQuota> captor = ArgumentCaptor.forClass(StudentMentorQuota.class);
        verify(quotaRepository).save(captor.capture());

        StudentMentorQuota savedQuota = captor.getValue();
        assertThat(savedQuota.getSessionsTotal()).isEqualTo(4);
        assertThat(savedQuota.getSessionsAvailablePhaseCurrent()).isEqualTo(1);
        assertThat(savedQuota.getSessionsReservedPhaseNext()).isEqualTo(3);
    }

    @Test
    @DisplayName("Achat Downsell Mentor (2 sessions) sur Web Pro : alloue 2 sessions pour la phase JS")
    void testPurchaseMentorDownsellWebPro() {
        when(quotaRepository.findById(any(StudentMentorQuotaId.class))).thenReturn(Optional.empty());

        mentorService.processMentorAddonPurchase(testUser, testCohort, "mentor_downsell_2sessions", EnrollmentTier.WEB);

        assertThat(testCohort.getMentorSlotsRemaining()).isEqualTo(2);

        ArgumentCaptor<StudentMentorQuota> captor = ArgumentCaptor.forClass(StudentMentorQuota.class);
        verify(quotaRepository).save(captor.capture());

        StudentMentorQuota savedQuota = captor.getValue();
        assertThat(savedQuota.getSessionsTotal()).isEqualTo(2);
        assertThat(savedQuota.getSessionsAvailablePhaseCurrent()).isEqualTo(0);
        assertThat(savedQuota.getSessionsReservedPhaseNext()).isEqualTo(2);
    }

    @Test
    @DisplayName("Upgrade de Starter vers Web Pro avec 4 sessions restantes : réserve automatiquement 2 sessions pour JS")
    void testUpgradeStarterToWebPro() {
        StudentMentorQuota quota = new StudentMentorQuota();
        quota.setStudent(testUser);
        quota.setCohort(testCohort);
        quota.setSessionsTotal(4);
        quota.setSessionsUsed(0);
        quota.setSessionsAvailablePhaseCurrent(4);
        quota.setSessionsReservedPhaseNext(0);

        when(quotaRepository.findById(any(StudentMentorQuotaId.class))).thenReturn(Optional.of(quota));

        mentorService.handleUpgradeToWebPro(testUser, testCohort);

        verify(quotaRepository).save(quota);
        assertThat(quota.getSessionsReservedPhaseNext()).isEqualTo(2);
        assertThat(quota.getSessionsAvailablePhaseCurrent()).isEqualTo(2);
    }

    @Test
    @DisplayName("Upgrade de Starter vers Web Pro avec 1 seule session restante : réserve 1 session pour JS")
    void testUpgradeStarterToWebProLowQuota() {
        StudentMentorQuota quota = new StudentMentorQuota();
        quota.setStudent(testUser);
        quota.setCohort(testCohort);
        quota.setSessionsTotal(4);
        quota.setSessionsUsed(3);
        quota.setSessionsAvailablePhaseCurrent(1);
        quota.setSessionsReservedPhaseNext(0);

        when(quotaRepository.findById(any(StudentMentorQuotaId.class))).thenReturn(Optional.of(quota));

        mentorService.handleUpgradeToWebPro(testUser, testCohort);

        verify(quotaRepository).save(quota);
        assertThat(quota.getSessionsReservedPhaseNext()).isEqualTo(1);
        assertThat(quota.getSessionsAvailablePhaseCurrent()).isEqualTo(0);
    }
}
