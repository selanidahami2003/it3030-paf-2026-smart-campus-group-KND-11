package com.smartcampus.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;

    @DBRef
    private User creator;


    @DBRef
    private User assignee;

    public enum Category { HARDWARE, SOFTWARE, NETWORK, FACILITY }
    private Category category;

    private String description;
    private String contactDetails;
    private String reporterName; // display name from identity form

    public enum Priority { LOW, MEDIUM, HIGH, URGENT }
    private Priority priority;

    public enum Status { OPEN, IN_PROGRESS, RESOLVED, CLOSED }
    private Status status;

    private String attachment1;
    private String attachment2;
    private String attachment3;

    @Indexed
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
