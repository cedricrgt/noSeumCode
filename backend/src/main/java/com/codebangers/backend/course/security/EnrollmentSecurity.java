package com.codebangers.backend.course.security;

import com.codebangers.backend.course.repository.EnrollmentRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("enrollmentSecurity")
public class EnrollmentSecurity {

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentSecurity(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    public boolean canAccessEnrollment(UUID enrollmentId, Authentication authentication) {
        if (authentication == null || enrollmentId == null) {
            return false;
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (isAdmin) {
            return true;
        }

        String userId = null;
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            userId = jwt.getClaimAsString("userId");
        }

        if (userId == null) {
            return false;
        }

        String finalUserId = userId;
        return enrollmentRepository.findById(enrollmentId)
                .map(enrollment -> enrollment.getUser() != null && finalUserId.equals(enrollment.getUser().getId().toString()))
                .orElse(true);
    }
}
