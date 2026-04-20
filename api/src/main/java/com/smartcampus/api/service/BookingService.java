package com.smartcampus.api.service;

import com.smartcampus.api.model.Booking;
import com.smartcampus.api.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Booking> getBookingsByUser(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Booking updateBookingStatus(String bookingId, Booking.BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(status);
        Booking saved = bookingRepository.save(booking);

        // Trigger Notification
        String message = "Your booking for " + booking.getResourceName() + " has been " + status.toString().toLowerCase() + ".";
        notificationService.createNotification(
            booking.getUserId(),
            message,
            "BOOKING_STATUS",
            booking.getId()
        );

        return saved;
    }
}
