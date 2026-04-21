package com.smartcampus.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String recipientId;
    private String message;
    private String type; // e.g., BOOKING_STATUS, TICKET_STATUS, NEW_COMMENT
    private String relatedId; // id of the booking or ticket
    private LocalDateTime createdAt;
    private boolean read;

    public Notification(String recipientId, String message, String type, String relatedId) {
        this.recipientId = recipientId;
        this.message = message;
        this.type = type;
        this.relatedId = relatedId;
        this.createdAt = LocalDateTime.now();
        this.read = false;
    }
}
