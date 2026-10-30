package com.codebangers.backend.workshop.service;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.workshop.model.Workshop;
import com.codebangers.backend.workshop.repository.WorkshopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class WorkshopService {

    private final WorkshopRepository workshopRepository;

    public WorkshopService(WorkshopRepository workshopRepository) {
        this.workshopRepository = workshopRepository;
    }

    @Transactional(readOnly = true)
    public Optional<Workshop> getWorkshopById(UUID id) {
        return workshopRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Workshop> getAllActiveWorkshops() {
        return workshopRepository.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<Workshop> getUpcomingWorkshops() {
        return workshopRepository.findUpcomingWorkshops(LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public List<Workshop> getOngoingWorkshops() {
        LocalDateTime now = LocalDateTime.now();
        return workshopRepository.findOngoingWorkshops(now);
    }

    public Workshop createWorkshop(String title, String description,
                                 LocalDateTime startDate, LocalDateTime endDate, User createdBy) {
<<<<<<< HEAD
        return createWorkshop(title, null, description, 6, startDate, endDate, createdBy);
    }

    public Workshop createWorkshop(String title, String theme, String description,
                                 Integer maxParticipants, LocalDateTime startDate,
                                 LocalDateTime endDate, User createdBy) {
=======
>>>>>>> main
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be after start date");
        }

<<<<<<< HEAD
        Workshop workshop = new Workshop(title, theme, description, maxParticipants, startDate, endDate);
=======
        Workshop workshop = new Workshop(title, description, startDate, endDate);
>>>>>>> main
        workshop.setCreatedBy(createdBy);
        return workshopRepository.save(workshop);
    }

    public Workshop updateWorkshop(UUID workshopId, String title, String description,
                                 LocalDateTime startDate, LocalDateTime endDate) {
<<<<<<< HEAD
        return updateWorkshop(workshopId, title, null, description, 6, startDate, endDate);
    }

    public Workshop updateWorkshop(UUID workshopId, String title, String theme, String description,
                                 Integer maxParticipants, LocalDateTime startDate, LocalDateTime endDate) {
=======
>>>>>>> main
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be after start date");
        }

        Workshop workshop = workshopRepository.findById(workshopId)
            .orElseThrow(() -> new ResourceNotFoundException("Workshop", workshopId));

        workshop.setTitle(title);
<<<<<<< HEAD
        workshop.setTheme(theme);
        workshop.setDescription(description);
        workshop.setMaxParticipants(maxParticipants != null ? maxParticipants : 6);
=======
        workshop.setDescription(description);
>>>>>>> main
        workshop.setStartDate(startDate);
        workshop.setEndDate(endDate);
        return workshopRepository.save(workshop);
    }

    public void softDeleteWorkshop(UUID workshopId) {
        Workshop workshop = workshopRepository.findById(workshopId)
            .orElseThrow(() -> new ResourceNotFoundException("Workshop", workshopId));

        workshop.setDeleted(true);
        workshop.setDeletedAt(LocalDateTime.now());
        workshopRepository.save(workshop);
    }

    public void deleteWorkshop(UUID workshopId) {
        workshopRepository.deleteById(workshopId);
    }
}
