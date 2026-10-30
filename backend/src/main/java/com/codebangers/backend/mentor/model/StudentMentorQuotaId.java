package com.codebangers.backend.mentor.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class StudentMentorQuotaId implements Serializable {
    private UUID student;
    private UUID cohort;

    public StudentMentorQuotaId() {}

    public StudentMentorQuotaId(UUID student, UUID cohort) {
        this.student = student;
        this.cohort = cohort;
    }

    public UUID getStudent() {
        return student;
    }

    public void setStudent(UUID student) {
        this.student = student;
    }

    public UUID getCohort() {
        return cohort;
    }

    public void setCohort(UUID cohort) {
        this.cohort = cohort;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StudentMentorQuotaId)) return false;
        StudentMentorQuotaId that = (StudentMentorQuotaId) o;
        return Objects.equals(getStudent(), that.getStudent()) &&
               Objects.equals(getCohort(), that.getCohort());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getStudent(), getCohort());
    }
}
