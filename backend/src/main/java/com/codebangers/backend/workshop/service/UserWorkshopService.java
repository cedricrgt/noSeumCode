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

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
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

    @Transactional(readOnly = true)
    public byte[] generateHubspotCsv(UUID workshopId) {
        List<UserWorkshop> list = (workshopId != null)
            ? userWorkshopRepository.findByWorkshopIdWithUserAndWorkshop(workshopId)
            : userWorkshopRepository.findAllWithUserAndWorkshop();

        StringBuilder sb = new StringBuilder();
        sb.append('\uFEFF'); // UTF-8 BOM pour compatibilité Excel & HubSpot
        sb.append("Email,First Name,Last Name,Lifecycle Stage,Atelier,Thématique,Date Atelier,Date Inscription\n");
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (UserWorkshop uw : list) {
            User u = uw.getUser();
            Workshop w = uw.getWorkshop();

            String email = (u != null && u.getEmail() != null) ? u.getEmail() : "";
            String firstName = (u != null && u.getFirstName() != null) ? u.getFirstName() : "";
            String lastName = (u != null && u.getLastName() != null) ? u.getLastName() : "";
            String lifecycleStage = "lead";
            String workshopTitle = (w != null && w.getTitle() != null) ? w.getTitle() : "";
            String theme = (w != null && w.getTheme() != null) ? w.getTheme() : "";
            String workshopDate = (w != null && w.getStartDate() != null) ? w.getStartDate().format(dtf) : "";
            String regDate = (uw.getRegisteredAt() != null) ? uw.getRegisteredAt().format(dtf) : "";

            sb.append(escapeCsv(email)).append(",")
              .append(escapeCsv(firstName)).append(",")
              .append(escapeCsv(lastName)).append(",")
              .append(escapeCsv(lifecycleStage)).append(",")
              .append(escapeCsv(workshopTitle)).append(",")
              .append(escapeCsv(theme)).append(",")
              .append(escapeCsv(workshopDate)).append(",")
              .append(escapeCsv(regDate)).append("\n");
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n") || value.contains("\r")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
