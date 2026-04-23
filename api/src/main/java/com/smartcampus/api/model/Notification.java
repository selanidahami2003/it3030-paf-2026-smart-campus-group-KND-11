package com.smartcampus.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

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

    public Notification() {}

    public Notification(String id, String recipientId, String message, String type, String relatedId, LocalDateTime createdAt, boolean read) {
        this.id = id;
        this.recipientId = recipientId;
        this.message = message;
        this.type = type;
        this.relatedId = relatedId;
        this.createdAt = createdAt;
        this.read = read;
    }

    public Notification(String recipientId, String message, String type, String relatedId) {
        this.recipientId = recipientId;
        this.message = message;
        this.type = type;
        this.relatedId = relatedId;
        this.createdAt = LocalDateTime.now();
        this.read = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getRelatedId() { return relatedId; }
    public void setRelatedId(String relatedId) { this.relatedId = relatedId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}
