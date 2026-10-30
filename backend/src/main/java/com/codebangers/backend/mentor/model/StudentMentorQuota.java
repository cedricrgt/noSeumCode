package com.codebangers.backend.mentor.model;

import com.codebangers.backend.cohort.model.Cohort;
import com.codebangers.backend.user.model.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_mentor_quota")
@IdClass(StudentMentorQuotaId.class)
public class StudentMentorQuota {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cohort_id", nullable = false)
    private Cohort cohort;

    @Column(name = "sessions_total", nullable = false)
    private Integer sessionsTotal;

    @Column(name = "sessions_used", nullable = false)
    private Integer sessionsUsed = 0;

    @Column(name = "sessions_available_phase_current", nullable = false)
    private Integer sessionsAvailablePhaseCurrent = 0;

    @Column(name = "sessions_reserved_phase_next", nullable = false)
    private Integer sessionsReservedPhaseNext = 0;

    @Column(name = "mentor_halfway_warning_shown", nullable = false)
    private Boolean mentorHalfwayWarningShown = false;

    @Column(name = "last_recalculated_at")
    private LocalDateTime lastRecalculatedAt;

    public StudentMentorQuota() {}

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Cohort getCohort() {
        return cohort;
    }

    public void setCohort(Cohort cohort) {
        this.cohort = cohort;
    }

    public Integer getSessionsTotal() {
        return sessionsTotal;
    }

    public void setSessionsTotal(Integer sessionsTotal) {
        this.sessionsTotal = sessionsTotal;
    }

    public Integer getSessionsUsed() {
        return sessionsUsed;
    }

    public void setSessionsUsed(Integer sessionsUsed) {
        this.sessionsUsed = sessionsUsed;
    }

    public Integer getSessionsAvailablePhaseCurrent() {
        return sessionsAvailablePhaseCurrent;
    }

    public void setSessionsAvailablePhaseCurrent(Integer sessionsAvailablePhaseCurrent) {
        this.sessionsAvailablePhaseCurrent = sessionsAvailablePhaseCurrent;
    }

    public Integer getSessionsReservedPhaseNext() {
        return sessionsReservedPhaseNext;
    }

    public void setSessionsReservedPhaseNext(Integer sessionsReservedPhaseNext) {
        this.sessionsReservedPhaseNext = sessionsReservedPhaseNext;
    }

    public Boolean getMentorHalfwayWarningShown() {
        return mentorHalfwayWarningShown;
    }

    public void setMentorHalfwayWarningShown(Boolean mentorHalfwayWarningShown) {
        this.mentorHalfwayWarningShown = mentorHalfwayWarningShown;
    }

    public LocalDateTime getLastRecalculatedAt() {
        return lastRecalculatedAt;
    }

    public void setLastRecalculatedAt(LocalDateTime lastRecalculatedAt) {
        this.lastRecalculatedAt = lastRecalculatedAt;
    }
}
