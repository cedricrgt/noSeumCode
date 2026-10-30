package com.codebangers.backend.cohort.service;

import com.codebangers.backend.cohort.dto.CohortRequest;
import com.codebangers.backend.cohort.dto.CohortResponse;
import com.codebangers.backend.cohort.model.Cohort;
import com.codebangers.backend.cohort.model.CohortStatus;
import com.codebangers.backend.cohort.repository.CohortRepository;
import com.codebangers.backend.config.exception.DuplicateResourceException;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CohortService {

    private final CohortRepository cohortRepository;

    public CohortService(CohortRepository cohortRepository) {
        this.cohortRepository = cohortRepository;
    }

    @Transactional(readOnly = true)
    public List<CohortResponse> getAllCohorts() {
        return cohortRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CohortResponse> getOpenCohorts() {
        return cohortRepository.findByStatusInOrderByStartDateAsc(List.of(CohortStatus.OPEN, CohortStatus.IN_PROGRESS))
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public java.util.Map<String, com.codebangers.backend.cohort.dto.MentorStats> getCurrentMentorStats() {
        List<Cohort> openCohorts = cohortRepository.findByStatusInOrderByStartDateAsc(List.of(CohortStatus.OPEN, CohortStatus.IN_PROGRESS));
        java.util.Map<String, com.codebangers.backend.cohort.dto.MentorStats> map = new java.util.HashMap<>();
        for (Cohort cohort : openCohorts) {
            String key = cohort.getTier().name().toLowerCase();
            if (key.equals("web")) key = "web_pro";
            map.put(key, new com.codebangers.backend.cohort.dto.MentorStats(cohort.getMentorSlotsRemaining()));
        }
        return map;
    }

    @Transactional(readOnly = true)
    public Optional<CohortResponse> getCohortById(UUID id) {
        return cohortRepository.findById(id).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Optional<CohortResponse> getCohortBySlug(String slug) {
        return cohortRepository.findBySlug(slug).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Cohort getCohortEntity(UUID id) {
        return cohortRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cohorte introuvable avec l'identifiant: " + id));
    }

    @Transactional(readOnly = true)
    public boolean hasAvailableSeat(UUID cohortId) {
        Cohort cohort = getCohortEntity(cohortId);
        long count = cohortRepository.countPaidEnrollments(cohortId);
        return count < cohort.getMaxStudents();
    }

    public Cohort createCohort(CohortRequest request, User author) {
        if (cohortRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new DuplicateResourceException("Une cohorte avec le slug '" + request.getSlug() + "' existe déjà.");
        }

        Cohort cohort = new Cohort();
        cohort.setName(request.getName());
        cohort.setSlug(request.getSlug().trim().toLowerCase());
        cohort.setDescription(request.getDescription());
        cohort.setTier(request.getTier() != null ? request.getTier() : com.codebangers.backend.course.model.EnrollmentTier.WEB);
        cohort.setStartDate(request.getStartDate());
        cohort.setEndDate(request.getEndDate());
        cohort.setMaxStudents(request.getMaxStudents() != null ? request.getMaxStudents() : 6);
        cohort.setStatus(request.getStatus() != null ? request.getStatus() : CohortStatus.OPEN);
        cohort.setCreatedBy(author);

        return cohortRepository.save(cohort);
    }

    public Cohort updateCohort(UUID id, CohortRequest request, User editor) {
        Cohort cohort = getCohortEntity(id);

        if (!cohort.getSlug().equalsIgnoreCase(request.getSlug()) &&
                cohortRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new DuplicateResourceException("Une cohorte avec le slug '" + request.getSlug() + "' existe déjà.");
        }

        cohort.setName(request.getName());
        cohort.setSlug(request.getSlug().trim().toLowerCase());
        cohort.setDescription(request.getDescription());
        if (request.getTier() != null) {
            cohort.setTier(request.getTier());
        }
        cohort.setStartDate(request.getStartDate());
        cohort.setEndDate(request.getEndDate());
        if (request.getMaxStudents() != null) {
            cohort.setMaxStudents(request.getMaxStudents());
        }
        if (request.getStatus() != null) {
            cohort.setStatus(request.getStatus());
        }

        return cohortRepository.save(cohort);
    }

    public void archiveCohort(UUID id) {
        Cohort cohort = getCohortEntity(id);
        cohort.setStatus(CohortStatus.ARCHIVED);
        cohortRepository.save(cohort);
    }

    public void deleteCohort(UUID id) {
        Cohort cohort = getCohortEntity(id);
        cohortRepository.delete(cohort);
    }

    public CohortResponse mapToResponse(Cohort cohort) {
        long enrolledCount = cohortRepository.countPaidEnrollments(cohort.getId());
        String authorName = cohort.getCreatedBy() != null
                ? (cohort.getCreatedBy().getFirstName() + " " + cohort.getCreatedBy().getLastName()).trim()
                : null;
        UUID authorId = cohort.getCreatedBy() != null ? cohort.getCreatedBy().getId() : null;

        return new CohortResponse(
                cohort.getId(),
                cohort.getName(),
                cohort.getSlug(),
                cohort.getDescription(),
                cohort.getTier(),
                cohort.getStartDate(),
                cohort.getEndDate(),
                cohort.getMaxStudents(),
                cohort.getStatus(),
                enrolledCount,
                authorId,
                authorName,
                cohort.getCreatedAt(),
                cohort.getUpdatedAt()
        );
    }
}
