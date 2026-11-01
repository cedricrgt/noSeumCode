package com.codebangers.backend.cohort.model;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * Statuts du cycle de vie d'une cohorte NoSeumCode.
 */
public enum CohortStatus {
    DRAFT,
    OPEN,
    IN_PROGRESS,
    COMPLETED,
    ARCHIVED;

    @JsonCreator
    public static CohortStatus fromString(String value) {
        if (value == null || value.isBlank()) {
            return OPEN;
        }
        try {
            return CohortStatus.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return OPEN;
        }
    }
}
