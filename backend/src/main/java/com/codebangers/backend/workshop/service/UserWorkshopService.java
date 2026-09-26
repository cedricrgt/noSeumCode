package com.codebangers.backend.workshop.service;

import com.codebangers.backend.config.exception.DuplicateResourceException;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.workshop.model.UserWorkshop;
import com.codebangers.backend.workshop.model.Workshop;
import com.codebangers.backend.workshop.repository.UserWorkshopRepository;
import com.codebangers.backend.workshop.repository.WorkshopRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserWorkshopService {

    private final UserWorkshopRepository userWorkshopRepository;
    private final WorkshopRepository workshopRepository;

    public UserWorkshopService(UserWorkshopRepository userWorkshopRepository,
                            WorkshopRepository workshopRepository) {
        this.userWorkshopRepository = userWorkshopRepository;
        this.workshopRepository = workshopRepository;
    }

    @Transactional(readOnly = true)
    public Optional<UserWorkshop> getRegistration(UUID userId, UUID workshopId) {
        return userWorkshopRepository.findByUserIdAndWorkshopId(userId, workshopId);
    }

    @Transactional(readOnly = true)
    public List<UserWorkshop> getRegistrationsByWorkshop(UUID workshopId) {
        return userWorkshopRepository.findByWorkshopId(workshopId);
    }

    @Transactional(readOnly = true)
    public List<UserWorkshop> getRegistrationsByUser(UUID userId) {
        return userWorkshopRepository.findByUserIdWithWorkshop(userId);
    }

    @Transactional(readOnly = true)
    public int countRegistrationsByWorkshop(UUID workshopId) {
        return userWorkshopRepository.countByWorkshopId(workshopId);
    }

    @Transactional(readOnly = true)
    public int countAttendanceByWorkshop(UUID workshopId) {
        return userWorkshopRepository.countAttendanceByWorkshopId(workshopId);
    }

    public UserWorkshop registerUserToWorkshop(User user, UUID workshopId) {
        Workshop workshop = workshopRepository.findById(workshopId)
            .orElseThrow(() -> new ResourceNotFoundException("Workshop", workshopId));

        if (workshop.isDeleted()) {
            throw new ResourceNotFoundException("Workshop is no longer available");
        }

        Optional<UserWorkshop> existing = userWorkshopRepository.findByUserIdAndWorkshopId(user.getId(), workshopId);
        if (existing.isPresent()) {
            throw new DuplicateResourceException("Vous êtes déjà inscrit(e) à cet atelier.");
        }

        int max = workshop.getMaxParticipants() != null ? workshop.getMaxParticipants() : 6;
        int currentCount = userWorkshopRepository.countByWorkshopId(workshopId);
        if (currentCount >= max) {
            throw new IllegalStateException("Cet atelier est complet (jauge maximale de " + max + " participants atteinte).");
        }

        UserWorkshop registration = new UserWorkshop(user, workshop);
        return userWorkshopRepository.save(registration);
    }

    public UserWorkshop markAttendance(UUID registrationId, Boolean attended) {
        UserWorkshop registration = userWorkshopRepository.findById(registrationId)
            .orElseThrow(() -> new ResourceNotFoundException("Registration", registrationId));

        registration.setAttended(attended);
        return userWorkshopRepository.save(registration);
    }

    public void unregisterUserFromWorkshop(UUID registrationId, User currentUser) {
        UserWorkshop registration = userWorkshopRepository.findById(registrationId)
            .orElseThrow(() -> new ResourceNotFoundException("Registration", registrationId));

        boolean isOwner = registration.getUser().getId().equals(currentUser.getId());
        boolean isStaff = currentUser.getRole() == Role.ADMIN || currentUser.getRole() == Role.TEACHER;
        if (!isOwner && !isStaff) {
            throw new AccessDeniedException("Vous n'êtes pas autorisé à annuler cette inscription.");
        }

        userWorkshopRepository.delete(registration);
    }

    public void unregisterCurrentUserByWorkshop(UUID workshopId, User currentUser) {
        UserWorkshop registration = userWorkshopRepository.findByUserIdAndWorkshopId(currentUser.getId(), workshopId)
            .orElseThrow(() -> new ResourceNotFoundException("Inscription non trouvée pour cet atelier."));

        userWorkshopRepository.delete(registration);
    }

    public void unregisterUserFromWorkshop(UUID registrationId) {
        userWorkshopRepository.deleteById(registrationId);
    }
}
