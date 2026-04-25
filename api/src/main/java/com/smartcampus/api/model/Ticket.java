package com.smartcampus.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;

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

    public Ticket() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }
    public User getAssignee() { return assignee; }
    public void setAssignee(User assignee) { this.assignee = assignee; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }
    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getAttachment1() { return attachment1; }
    public void setAttachment1(String attachment1) { this.attachment1 = attachment1; }
    public String getAttachment2() { return attachment2; }
    public void setAttachment2(String attachment2) { this.attachment2 = attachment2; }
    public String getAttachment3() { return attachment3; }
    public void setAttachment3(String attachment3) { this.attachment3 = attachment3; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
