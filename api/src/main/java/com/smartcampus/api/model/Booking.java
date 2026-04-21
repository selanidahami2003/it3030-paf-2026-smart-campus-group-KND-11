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
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String userId;
    private String userName;
    private String resourceName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    public enum BookingStatus { PENDING, APPROVED, REJECTED }
    private BookingStatus status = BookingStatus.PENDING;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
