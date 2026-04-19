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

    public Notification createNotification(String userId, String message, String type) {
        if (userId == null || userId.trim().isEmpty()) {
            // Safe handling if user is not found or not provided
            System.err.println("Warning: Attempted to create notification without a valid user ID. Message: " + message);
            return null;
        }
        Notification notification = new Notification(userId, message, type);
        return notificationRepository.save(notification);
    }

    // --- Booking Notifications ---
    
    public void sendBookingApprovedNotification(String userId, String bookingTitle) {
        String message = "Your booking request for '" + bookingTitle + "' has been approved.";
        createNotification(userId, message, "BOOKING");
    }

    public void sendBookingRejectedNotification(String userId, String bookingTitle) {
        String message = "Your booking request for '" + bookingTitle + "' has been rejected.";
        createNotification(userId, message, "BOOKING");
    }

    // --- Ticket Notifications ---

    public void sendTicketAssignedNotification(String userId, String ticketId) {
        String message = "You have been assigned to maintenance ticket #" + ticketId + ".";
        createNotification(userId, message, "TICKET");
    }

    public void sendTicketStatusChangeNotification(String userId, String ticketId, String status) {
        String message = "The status of ticket #" + ticketId + " has been updated to: " + status + ".";
        createNotification(userId, message, "TICKET");
    }

    public void sendTicketCommentNotification(String userId, String ticketId) {
        String message = "A new comment has been added to ticket #" + ticketId + ".";
        createNotification(userId, message, "COMMENT");
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
