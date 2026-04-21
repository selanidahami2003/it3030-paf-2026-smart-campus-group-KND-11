package com.smartcampus.api.controller;

import com.smartcampus.api.model.Notification;
import com.smartcampus.api.service.NotificationService;
import com.smartcampus.api.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    private String resolveUserId(UserPrincipal userPrincipal, String headerUserId) {
        if (userPrincipal != null) {
            return userPrincipal.getId();
        }
        return headerUserId != null ? headerUserId : "2";
    }

    @GetMapping
    public List<Notification> getMyNotifications(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        return notificationService.getUserNotifications(resolveUserId(userPrincipal, headerUserId));
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        return Map.of("count", notificationService.getUnreadCount(resolveUserId(userPrincipal, headerUserId)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        notificationService.markAllAsRead(resolveUserId(userPrincipal, headerUserId));
        return ResponseEntity.ok().build();
    }
}
