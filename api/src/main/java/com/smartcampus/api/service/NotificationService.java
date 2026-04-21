package com.smartcampus.api.service;

import com.smartcampus.api.model.Notification;
import com.smartcampus.api.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public void createNotification(String recipientId, String message, String type, String relatedId) {
        Notification notification = new Notification(recipientId, message, type, relatedId);
        notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }
}
