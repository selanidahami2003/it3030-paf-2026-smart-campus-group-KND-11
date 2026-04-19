package com.smartcampus.api.service;

import com.smartcampus.api.model.Notification;
import com.smartcampus.api.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification createNotification(String userId, String message) {
        Notification notification = new Notification(userId, message);
        return notificationRepository.save(notification);
    }

    public Notification markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
