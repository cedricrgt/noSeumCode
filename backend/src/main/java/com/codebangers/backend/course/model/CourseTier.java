package com.codebangers.backend.course.model;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * Niveaux de souscription requis pour accéder aux modules de formation NoSeumCode (ADR-013).
 * - STARTER : Tronc commun (HTML & CSS, Git & GitHub), replays à vie conservés.
 * - WEB : Parcours complet (JavaScript, API, architecture, lives et replays complets).
 * - VIP : Parcours complet + Mentorat VIP (4 sessions individuelles 1-to-1).
 */
public enum CourseTier {
    STARTER,
    WEB,
    VIP;

    @JsonCreator
    public static CourseTier fromString(String value) {
        if (value == null || value.isBlank()) {
            return STARTER;
        }
        try {
            return CourseTier.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return STARTER;
        }
    }
}
