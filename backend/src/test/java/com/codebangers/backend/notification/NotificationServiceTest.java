package com.codebangers.backend.notification;

import com.codebangers.backend.notification.dto.NotificationResponse;
import com.codebangers.backend.notification.model.Notification;
import com.codebangers.backend.notification.model.NotificationType;
import com.codebangers.backend.notification.repository.NotificationRepository;
import com.codebangers.backend.notification.service.NotificationService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class NotificationServiceTest {

    @Test
    void shouldNotifyAllAdminsWhenCalled() {
        NotificationRepository notificationRepository = mock(NotificationRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        NotificationService service = new NotificationService(notificationRepository, userRepository);

        User admin1 = new User("admin1", "Admin", "One", "admin1@codebangers.com", "pass", Role.ADMIN);
        User admin2 = new User("admin2", "Admin", "Two", "admin2@codebangers.com", "pass", Role.ADMIN);
        when(userRepository.findByRole(Role.ADMIN)).thenReturn(List.of(admin1, admin2));

        service.notifyAdmins("Nouvelle section", "Message test", UUID.randomUUID(), "CHAPTER");

        verify(notificationRepository, times(2)).save(any(Notification.class));
    }

    @Test
    void shouldMarkNotificationAsReadForOwner() {
        NotificationRepository notificationRepository = mock(NotificationRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        NotificationService service = new NotificationService(notificationRepository, userRepository);

        UUID userId = UUID.randomUUID();
        User user = new User("teacher", "Jane", "Doe", "teacher@codebangers.com", "pass", Role.TEACHER);
        user.setId(userId);

        UUID notificationId = UUID.randomUUID();
        Notification notification = new Notification(user, "Titre", "Message", NotificationType.COURSE_APPROVED, null, null);
        notification.setId(notificationId);

        when(notificationRepository.findById(notificationId)).thenReturn(Optional.of(notification));

        service.markAsRead(notificationId, userId);

        assertTrue(notification.isRead());
        verify(notificationRepository).save(notification);
    }
}
