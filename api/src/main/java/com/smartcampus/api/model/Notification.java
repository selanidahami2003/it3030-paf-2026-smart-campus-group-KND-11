package com.smartcampus.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    private String id;
    private String userId;
    private String message;
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification(String userId, String message) {
        this.userId = userId;
        this.message = message;
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }
}
