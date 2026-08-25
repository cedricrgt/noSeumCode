package com.codebangers.backend.notification.service;

import com.codebangers.backend.notification.dto.NotificationResponse;
import com.codebangers.backend.notification.model.Notification;
import com.codebangers.backend.notification.model.NotificationType;
import com.codebangers.backend.notification.repository.NotificationRepository;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public void notifyAdmins(String title, String message, UUID referenceId, String referenceType) {
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        if (admins.isEmpty()) {
            userRepository.findByEmail("admin@codebangers.fr").ifPresent(admins::add);
            userRepository.findByUserName("admin").ifPresent(a -> {
                if (!admins.contains(a)) admins.add(a);
            });
        }
        for (User admin : admins) {
            Notification notification = new Notification(
                    admin,
                    title,
                    message,
                    NotificationType.COURSE_SUBMISSION,
                    referenceId,
                    referenceType
            );
            notificationRepository.save(notification);
        }
    }

    public void notifyUser(User recipient, String title, String message, NotificationType type, UUID referenceId, String referenceType) {
        if (recipient == null) return;
        Notification notification = new Notification(
                recipient,
                title,
                message,
                type,
                referenceId,
                referenceType
        );
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public void markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification non trouvée"));

        if (!notification.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Action non autorisée");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getType(),
                n.getReferenceId(),
                n.getReferenceType(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
