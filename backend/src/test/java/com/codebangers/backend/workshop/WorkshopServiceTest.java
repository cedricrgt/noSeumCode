package com.codebangers.backend.workshop;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.workshop.model.Workshop;
import com.codebangers.backend.workshop.repository.WorkshopRepository;
import com.codebangers.backend.workshop.service.WorkshopService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkshopServiceTest {

    @Mock
    private WorkshopRepository workshopRepository;

    @InjectMocks
    private WorkshopService workshopService;

    private User teacher;
    private UUID workshopId;

    @BeforeEach
    void setUp() {
        teacher = new User();
        teacher.setId(UUID.randomUUID());
        teacher.setEmail("teacher@codebangers.fr");
        teacher.setRole(Role.TEACHER);

        workshopId = UUID.randomUUID();
    }

    @Test
    @DisplayName("Devrait créer un atelier avec succès et appliquer la jauge par défaut de 6 élèves")
    void createWorkshop_success() {
        LocalDateTime start = LocalDateTime.now().plusDays(2);
        LocalDateTime end = start.plusHours(2);

        when(workshopRepository.save(any(Workshop.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Workshop created = workshopService.createWorkshop(
            "JavaScript Live",
            "JavaScript",
            "Atelier découverte interactif",
            6,
            start,
            end,
            teacher
        );

        assertThat(created).isNotNull();
        assertThat(created.getTitle()).isEqualTo("JavaScript Live");
        assertThat(created.getTheme()).isEqualTo("JavaScript");
        assertThat(created.getMaxParticipants()).isEqualTo(6);
        assertThat(created.getCreatedBy()).isEqualTo(teacher);
        verify(workshopRepository).save(any(Workshop.class));
    }

    @Test
    @DisplayName("Devrait refuser la création si la date de fin précède la date de début")
    void createWorkshop_invalidDates_throwsIllegalArgumentException() {
        LocalDateTime start = LocalDateTime.now().plusDays(2);
        LocalDateTime end = start.minusHours(1);

        assertThatThrownBy(() -> workshopService.createWorkshop(
            "Invalid Dates",
            "Theme",
            "Desc",
            6,
            start,
            end,
            teacher
        )).isInstanceOf(IllegalArgumentException.class)
          .hasMessageContaining("End date must be after start date");

        verify(workshopRepository, never()).save(any());
    }

    @Test
    @DisplayName("Devrait mettre à jour un atelier avec succès")
    void updateWorkshop_success() {
        Workshop existing = new Workshop(
            "Titre initial",
            "Description initiale",
            LocalDateTime.now().plusDays(1),
            LocalDateTime.now().plusDays(1).plusHours(2)
        );
        existing.setId(workshopId);

        when(workshopRepository.findById(workshopId)).thenReturn(Optional.of(existing));
        when(workshopRepository.save(any(Workshop.class))).thenAnswer(inv -> inv.getArgument(0));

        LocalDateTime newStart = LocalDateTime.now().plusDays(3);
        LocalDateTime newEnd = newStart.plusHours(2);

        Workshop updated = workshopService.updateWorkshop(
            workshopId,
            "Titre modifié",
            "Nouveau Thème",
            "Nouvelle Description",
            6,
            newStart,
            newEnd
        );

        assertThat(updated.getTitle()).isEqualTo("Titre modifié");
        assertThat(updated.getTheme()).isEqualTo("Nouveau Thème");
        assertThat(updated.getMaxParticipants()).isEqualTo(6);
        verify(workshopRepository).save(existing);
    }

    @Test
    @DisplayName("Devrait marquer l'atelier comme soft deleted")
    void softDeleteWorkshop_success() {
        Workshop existing = new Workshop();
        existing.setId(workshopId);
        when(workshopRepository.findById(workshopId)).thenReturn(Optional.of(existing));

        workshopService.softDeleteWorkshop(workshopId);

        assertThat(existing.isDeleted()).isTrue();
        assertThat(existing.getDeletedAt()).isNotNull();
        verify(workshopRepository).save(existing);
    }

    @Test
    @DisplayName("Devrait lever une exception si l'atelier à supprimer est introuvable")
    void softDeleteWorkshop_notFound_throwsException() {
        when(workshopRepository.findById(workshopId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workshopService.softDeleteWorkshop(workshopId))
            .isInstanceOf(ResourceNotFoundException.class);
    }
}
