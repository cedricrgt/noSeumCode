package com.codebangers.backend.workshop.service;

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
                                 LocalDateTime startDate, LocalDateTime endDate) {
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be after start date");
        }

        Workshop workshop = new Workshop(title, description, startDate, endDate);
        return workshopRepository.save(workshop);
    }

    public Workshop updateWorkshop(UUID workshopId, String title, String description,
                                 LocalDateTime startDate, LocalDateTime endDate) {
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be after start date");
        }

        Workshop workshop = workshopRepository.findById(workshopId)
            .orElseThrow(() -> new IllegalArgumentException("Workshop not found: " + workshopId));

        workshop.setTitle(title);
        workshop.setDescription(description);
        workshop.setStartDate(startDate);
        workshop.setEndDate(endDate);
        return workshopRepository.save(workshop);
    }

    public void softDeleteWorkshop(UUID workshopId) {
        Workshop workshop = workshopRepository.findById(workshopId)
            .orElseThrow(() -> new IllegalArgumentException("Workshop not found: " + workshopId));

        workshop.setDeleted(true);
        workshop.setDeletedAt(LocalDateTime.now());
        workshopRepository.save(workshop);
    }

    public void deleteWorkshop(UUID workshopId) {
        workshopRepository.deleteById(workshopId);
    }
}
