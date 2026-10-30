package com.codebangers.backend.mentor.service;

import com.codebangers.backend.cohort.model.Cohort;
import com.codebangers.backend.cohort.repository.CohortRepository;
import com.codebangers.backend.mentor.model.StudentMentorQuota;
import com.codebangers.backend.mentor.model.StudentMentorQuotaId;
import com.codebangers.backend.mentor.repository.StudentMentorQuotaRepository;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.course.model.EnrollmentTier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class MentorService {

    private final CohortRepository cohortRepository;
    private final StudentMentorQuotaRepository quotaRepository;

    public MentorService(CohortRepository cohortRepository, StudentMentorQuotaRepository quotaRepository) {
        this.cohortRepository = cohortRepository;
        this.quotaRepository = quotaRepository;
    }

    public void processMentorAddonPurchase(User user, Cohort cohort, String addon, EnrollmentTier currentTier) {
        if (cohort == null || addon == null || user == null) {
            return;
        }

        int sessionsToGive;
        if ("mentor_4sessions".equalsIgnoreCase(addon) || "mentor".equalsIgnoreCase(addon)) {
            sessionsToGive = 4;
        } else if ("mentor_2sessions".equalsIgnoreCase(addon) || "mentor_downsell_2sessions".equalsIgnoreCase(addon)) {
            sessionsToGive = 2;
        } else {
            return;
        }

        // Decrement cohort slots strictly upon confirmed payment
        if (cohort.getMentorSlotsRemaining() != null && cohort.getMentorSlotsRemaining() > 0) {
            cohort.setMentorSlotsRemaining(cohort.getMentorSlotsRemaining() - 1);
            cohortRepository.save(cohort);
        }

        StudentMentorQuotaId quotaId = new StudentMentorQuotaId(user.getId(), cohort.getId());
        StudentMentorQuota quota = quotaRepository.findById(quotaId).orElse(null);
        if (quota == null) {
            quota = new StudentMentorQuota();
            quota.setStudent(user);
            quota.setCohort(cohort);
            quota.setSessionsTotal(sessionsToGive);
            quota.setSessionsUsed(0);
        } else {
            quota.setSessionsTotal(quota.getSessionsTotal() + sessionsToGive);
        }

        int used = quota.getSessionsUsed() != null ? quota.getSessionsUsed() : 0;
        int total = quota.getSessionsTotal() != null ? quota.getSessionsTotal() : sessionsToGive;

        // Dynamic session distribution based on path (Section 3.3)
        if (currentTier == EnrollmentTier.STARTER) {
            // Case 1: Starter only -> all available during Starter
            quota.setSessionsAvailablePhaseCurrent(Math.max(0, total - used));
            quota.setSessionsReservedPhaseNext(0);
        } else if (currentTier == EnrollmentTier.WEB || currentTier == EnrollmentTier.VIP) {
            // Case 3: Direct Web Pro -> 1 session in HTML/CSS phase, remaining in JS phase
            if (sessionsToGive == 4) {
                quota.setSessionsAvailablePhaseCurrent(1);
                quota.setSessionsReservedPhaseNext(3);
            } else {
                // Downsell (2 sessions) on Web Pro -> 2 sessions for JS
                quota.setSessionsAvailablePhaseCurrent(0);
                quota.setSessionsReservedPhaseNext(Math.max(0, total - used));
            }
        }
        quota.setLastRecalculatedAt(LocalDateTime.now());
        quotaRepository.save(quota);
    }

    public void handleUpgradeToWebPro(User user, Cohort cohort) {
        if (user == null || cohort == null) return;
        StudentMentorQuotaId quotaId = new StudentMentorQuotaId(user.getId(), cohort.getId());
        quotaRepository.findById(quotaId).ifPresent(quota -> {
            int used = quota.getSessionsUsed() != null ? quota.getSessionsUsed() : 0;
            int total = quota.getSessionsTotal() != null ? quota.getSessionsTotal() : 0;
            int remaining = Math.max(0, total - used);
            if (remaining >= 2) {
                quota.setSessionsReservedPhaseNext(2);
                quota.setSessionsAvailablePhaseCurrent(remaining - 2);
            } else {
                quota.setSessionsReservedPhaseNext(remaining);
                quota.setSessionsAvailablePhaseCurrent(0);
            }
            quota.setLastRecalculatedAt(LocalDateTime.now());
            quotaRepository.save(quota);
        });
    }
}
