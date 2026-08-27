package com.codebangers.backend.workshop.service;

import com.codebangers.backend.config.exception.DuplicateResourceException;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.workshop.model.UserWorkshop;
import com.codebangers.backend.workshop.model.Workshop;
import com.codebangers.backend.workshop.repository.UserWorkshopRepository;
import com.codebangers.backend.workshop.repository.WorkshopRepository;
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
        return userWorkshopRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public int countAttendanceByWorkshop(UUID workshopId) {
        return userWorkshopRepository.countAttendanceByWorkshopId(workshopId);
    }

    public UserWorkshop registerUserToWorkshop(User user, UUID workshopId) {
        Workshop workshop = workshopRepository.findById(workshopId)
            .orElseThrow(() -> new ResourceNotFoundException("Workshop", workshopId));

        Optional<UserWorkshop> existing = userWorkshopRepository.findByUserIdAndWorkshopId(user.getId(), workshopId);
        if (existing.isPresent()) {
            throw new DuplicateResourceException("User already registered for this workshop");
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

    public void unregisterUserFromWorkshop(UUID registrationId) {
        userWorkshopRepository.deleteById(registrationId);
    }
}
