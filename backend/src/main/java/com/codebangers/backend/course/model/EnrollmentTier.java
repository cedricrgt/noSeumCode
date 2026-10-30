package com.codebangers.backend.course.model;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * Offres et formules souscrites par les apprenants NoSeumCode (ADR-013).
 * - STARTER (279 €) : Découverte & Fondations (6 semaines), replays à vie illimités sur le tronc commun.
 * - WEB (579 €) : Parcours complet Bootcamp (sessions lives, projets complets, tous modules).
 * - VIP (879 €) : Pack Web complet + 4 sessions individuelles 1-to-1 d'1h avec Cédric.
 */
public enum EnrollmentTier {
    STARTER(1),
    WEB(2),
    VIP(3);

    private final int level;

    EnrollmentTier(int level) {
        this.level = level;
    }

    public int getLevel() {
        return level;
    }

    /**
     * Détermine si le niveau de souscription de l'apprenant donne accès au cours ciblé.
     */
    public boolean canAccess(CourseTier courseTier) {
        if (courseTier == null) {
            return true;
        }
        return switch (courseTier) {
            case STARTER -> true; // Tout abonné payant (STARTER, WEB, VIP) accède au tronc commun Starter
            case WEB -> this == WEB || this == VIP;
            case VIP -> this == VIP;
        };
    }

    @JsonCreator
    public static EnrollmentTier fromString(String value) {
        if (value == null || value.isBlank()) {
            return WEB;
        }
        try {
            return EnrollmentTier.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return WEB;
        }
    }
}
