package com.codebangers.backend.cohort.dto;

import com.codebangers.backend.cohort.model.CohortStatus;
import com.codebangers.backend.course.model.EnrollmentTier;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class CohortRequest {

    @NotBlank(message = "Le nom de la cohorte est obligatoire")
    private String name;

    @NotBlank(message = "Le slug de la cohorte est obligatoire")
    private String slug;

    private String description;

    private EnrollmentTier tier = EnrollmentTier.WEB;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @NotNull(message = "La taille maximale de la cohorte est obligatoire")
    @Min(value = 1, message = "La taille minimale d'une cohorte est de 1 élève")
    @Max(value = 12, message = "La taille maximale d'une cohorte ne doit pas excéder 12 élèves (recommandé: 6)")
    private Integer maxStudents = 6;

    private CohortStatus status = CohortStatus.OPEN;

    public CohortRequest() {
    }

    public CohortRequest(String name, String slug, LocalDateTime startDate, Integer maxStudents) {
        this.name = name;
        this.slug = slug;
        this.startDate = startDate;
        this.maxStudents = maxStudents;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public EnrollmentTier getTier() {
        return tier;
    }

    public void setTier(EnrollmentTier tier) {
        this.tier = tier;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Integer getMaxStudents() {
        return maxStudents;
    }

    public void setMaxStudents(Integer maxStudents) {
        this.maxStudents = maxStudents;
    }

    public CohortStatus getStatus() {
        return status;
    }

    public void setStatus(CohortStatus status) {
        this.status = status;
    }
}
