package com.smartcampus.api.dto;

import com.smartcampus.api.model.Ticket;
import java.time.LocalDateTime;

/**
 * Lightweight DTO for the ticket list endpoint.
 * Excludes large base64 attachment fields and nested User objects
 * to dramatically reduce payload size and avoid @DBRef round-trips.
 */
public class TicketSummaryDTO {

    public String id;
    public String category;
    public String description;
    public String priority;
    public String status;
    public String reporterName;
    public String creatorName;
    public String contactDetails;
    public boolean hasAttachments;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    // Attachment fields (included for the expanded detail view on the frontend)
    public String attachment1;
    public String attachment2;
    public String attachment3;

    public TicketSummaryDTO(Ticket t) {
        this.id = t.getId();
        this.category = t.getCategory() != null ? t.getCategory().name() : null;
        this.description = t.getDescription();
        this.priority = t.getPriority() != null ? t.getPriority().name() : null;
        this.status = t.getStatus() != null ? t.getStatus().name() : null;
        this.reporterName = t.getReporterName();
        this.creatorName = (t.getCreator() != null) ? t.getCreator().getName() : null;
        this.contactDetails = t.getContactDetails();
        this.hasAttachments = (t.getAttachment1() != null || t.getAttachment2() != null || t.getAttachment3() != null);
        this.createdAt = t.getCreatedAt();
        this.updatedAt = t.getUpdatedAt();
        // Include attachments for the collapsed ticket — frontend shows them on expand
        this.attachment1 = t.getAttachment1();
        this.attachment2 = t.getAttachment2();
        this.attachment3 = t.getAttachment3();
    }
}
