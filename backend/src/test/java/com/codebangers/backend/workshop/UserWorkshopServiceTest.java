package com.codebangers.backend.workshop;

import com.codebangers.backend.config.exception.DuplicateResourceException;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.workshop.model.UserWorkshop;
import com.codebangers.backend.workshop.model.Workshop;
import com.codebangers.backend.workshop.repository.UserWorkshopRepository;
import com.codebangers.backend.workshop.repository.WorkshopRepository;
import com.codebangers.backend.workshop.service.UserWorkshopService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserWorkshopServiceTest {

    @Mock
    private UserWorkshopRepository userWorkshopRepository;

    @Mock
    private WorkshopRepository workshopRepository;

    @InjectMocks
    private UserWorkshopService userWorkshopService;

    private User student;
    private User otherStudent;
    private User admin;
    private Workshop workshop;
    private UUID workshopId;
    private UUID registrationId;

    @BeforeEach
    void setUp() {
        student = new User();
        student.setId(UUID.randomUUID());
        student.setEmail("student@codebangers.fr");
        student.setRole(Role.STUDENT);

        otherStudent = new User();
        otherStudent.setId(UUID.randomUUID());
        otherStudent.setEmail("other@codebangers.fr");
        otherStudent.setRole(Role.STUDENT);

        admin = new User();
        admin.setId(UUID.randomUUID());
        admin.setEmail("admin@codebangers.fr");
        admin.setRole(Role.ADMIN);

        workshopId = UUID.randomUUID();
        registrationId = UUID.randomUUID();

        workshop = new Workshop(
            "HTML & CSS Live",
            "HTML & CSS",
            "Atelier découverte",
            6,
            LocalDateTime.now().plusDays(5),
            LocalDateTime.now().plusDays(5).plusHours(2)
        );
        workshop.setId(workshopId);
    }

    @Test
    @DisplayName("Devrait inscrire l'étudiant avec succès quand des places sont disponibles")
    void registerUserToWorkshop_success() {
        when(workshopRepository.findById(workshopId)).thenReturn(Optional.of(workshop));
        when(userWorkshopRepository.findByUserIdAndWorkshopId(student.getId(), workshopId)).thenReturn(Optional.empty());
        when(userWorkshopRepository.countByWorkshopId(workshopId)).thenReturn(3);
        when(userWorkshopRepository.save(any(UserWorkshop.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserWorkshop result = userWorkshopService.registerUserToWorkshop(student, workshopId);

        assertThat(result).isNotNull();
        assertThat(result.getUser()).isEqualTo(student);
        assertThat(result.getWorkshop()).isEqualTo(workshop);
        verify(userWorkshopRepository).save(any(UserWorkshop.class));
    }

    @Test
    @DisplayName("Devrait rejeter l'inscription si l'étudiant est déjà inscrit (DuplicateResourceException)")
    void registerUserToWorkshop_alreadyRegistered_throwsException() {
        when(workshopRepository.findById(workshopId)).thenReturn(Optional.of(workshop));
        when(userWorkshopRepository.findByUserIdAndWorkshopId(student.getId(), workshopId))
            .thenReturn(Optional.of(new UserWorkshop(student, workshop)));

        assertThatThrownBy(() -> userWorkshopService.registerUserToWorkshop(student, workshopId))
            .isInstanceOf(DuplicateResourceException.class)
            .hasMessageContaining("déjà inscrit");

        verify(userWorkshopRepository, never()).save(any());
    }

    @Test
    @DisplayName("Devrait bloquer l'inscription si la jauge stricte de 6 participants est atteinte")
    void registerUserToWorkshop_capacityReached_throwsIllegalStateException() {
        when(workshopRepository.findById(workshopId)).thenReturn(Optional.of(workshop));
        when(userWorkshopRepository.findByUserIdAndWorkshopId(student.getId(), workshopId)).thenReturn(Optional.empty());
        when(userWorkshopRepository.countByWorkshopId(workshopId)).thenReturn(6);

        assertThatThrownBy(() -> userWorkshopService.registerUserToWorkshop(student, workshopId))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("complet")
            .hasMessageContaining("6");

        verify(userWorkshopRepository, never()).save(any());
    }

    @Test
    @DisplayName("Devrait rejeter l'inscription si l'atelier a été supprimé")
    void registerUserToWorkshop_deletedWorkshop_throwsException() {
        workshop.setDeleted(true);
        when(workshopRepository.findById(workshopId)).thenReturn(Optional.of(workshop));

        assertThatThrownBy(() -> userWorkshopService.registerUserToWorkshop(student, workshopId))
            .isInstanceOf(ResourceNotFoundException.class);

        verify(userWorkshopRepository, never()).save(any());
    }

    @Test
    @DisplayName("L'apprenant titulaire peut annuler sa propre inscription")
    void unregisterUserFromWorkshop_owner_success() {
        UserWorkshop registration = new UserWorkshop(student, workshop);
        registration.setId(registrationId);

        when(userWorkshopRepository.findById(registrationId)).thenReturn(Optional.of(registration));

        userWorkshopService.unregisterUserFromWorkshop(registrationId, student);

        verify(userWorkshopRepository).delete(registration);
    }

    @Test
    @DisplayName("Un ADMIN peut annuler l'inscription d'un apprenant")
    void unregisterUserFromWorkshop_admin_success() {
        UserWorkshop registration = new UserWorkshop(student, workshop);
        registration.setId(registrationId);

        when(userWorkshopRepository.findById(registrationId)).thenReturn(Optional.of(registration));

        userWorkshopService.unregisterUserFromWorkshop(registrationId, admin);

        verify(userWorkshopRepository).delete(registration);
    }

    @Test
    @DisplayName("Un autre apprenant ne peut PAS annuler l'inscription d'un tiers (OWASP IDOR)")
    void unregisterUserFromWorkshop_otherStudent_throwsAccessDenied() {
        UserWorkshop registration = new UserWorkshop(student, workshop);
        registration.setId(registrationId);

        when(userWorkshopRepository.findById(registrationId)).thenReturn(Optional.of(registration));

        assertThatThrownBy(() -> userWorkshopService.unregisterUserFromWorkshop(registrationId, otherStudent))
            .isInstanceOf(AccessDeniedException.class)
            .hasMessageContaining("autorisé");

        verify(userWorkshopRepository, never()).delete(any());
    }

    @Test
    @DisplayName("L'apprenant peut se désinscrire directement par workshopId")
    void unregisterCurrentUserByWorkshop_success() {
        UserWorkshop registration = new UserWorkshop(student, workshop);
        when(userWorkshopRepository.findByUserIdAndWorkshopId(student.getId(), workshopId))
            .thenReturn(Optional.of(registration));

        userWorkshopService.unregisterCurrentUserByWorkshop(workshopId, student);

        verify(userWorkshopRepository).delete(registration);
    }

    @Test
    @DisplayName("Devrait lister les ateliers d'un apprenant avec les informations de session chargées")
    void getRegistrationsByUser_success() {
        UserWorkshop registration = new UserWorkshop(student, workshop);
        when(userWorkshopRepository.findByUserIdWithWorkshop(student.getId())).thenReturn(List.of(registration));

        List<UserWorkshop> list = userWorkshopService.getRegistrationsByUser(student.getId());

        assertThat(list).hasSize(1);
        assertThat(list.get(0).getWorkshop().getTitle()).isEqualTo("HTML & CSS Live");
    }

    @Test
    @DisplayName("Devrait générer un fichier CSV conforme HubSpot avec BOM UTF-8 et en-têtes corrects pour tous les ateliers")
    void generateHubspotCsv_allWorkshops_success() {
        student.setFirstName("Cédric");
        student.setLastName("Dev");
        UserWorkshop registration = new UserWorkshop(student, workshop);
        when(userWorkshopRepository.findAllWithUserAndWorkshop()).thenReturn(List.of(registration));

        byte[] csvBytes = userWorkshopService.generateHubspotCsv(null);
        String csv = new String(csvBytes, java.nio.charset.StandardCharsets.UTF_8);

        assertThat(csv).startsWith("\uFEFFEmail,First Name,Last Name,Lifecycle Stage,Atelier,Thématique,Date Atelier,Date Inscription");
        assertThat(csv).contains("student@codebangers.fr,Cédric,Dev,lead,HTML & CSS Live,HTML & CSS");
        verify(userWorkshopRepository).findAllWithUserAndWorkshop();
        verify(userWorkshopRepository, never()).findByWorkshopIdWithUserAndWorkshop(any());
    }

    @Test
    @DisplayName("Devrait générer un fichier CSV filtré par workshopId avec échappement des virgules")
    void generateHubspotCsv_filteredByWorkshopId_success() {
        workshop.setTitle("Workshop, avec virgule et \"guillemets\"");
        UserWorkshop registration = new UserWorkshop(student, workshop);
        when(userWorkshopRepository.findByWorkshopIdWithUserAndWorkshop(workshopId)).thenReturn(List.of(registration));

        byte[] csvBytes = userWorkshopService.generateHubspotCsv(workshopId);
        String csv = new String(csvBytes, java.nio.charset.StandardCharsets.UTF_8);

        assertThat(csv).contains("\"Workshop, avec virgule et \"\"guillemets\"\"\"");
        verify(userWorkshopRepository).findByWorkshopIdWithUserAndWorkshop(workshopId);
        verify(userWorkshopRepository, never()).findAllWithUserAndWorkshop();
    }
}
