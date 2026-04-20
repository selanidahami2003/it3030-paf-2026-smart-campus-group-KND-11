package com.smartcampus.api.controller;

import com.smartcampus.api.model.Booking;
import com.smartcampus.api.service.BookingService;
import com.smartcampus.api.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public Booking createBooking(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody Booking booking) {
        booking.setUserId(userPrincipal.getId());
        booking.setUserName(userPrincipal.getUsername());
        return bookingService.createBooking(booking);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/my")
    public List<Booking> getMyBookings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return bookingService.getBookingsByUser(userPrincipal.getId());
    }

    @PutMapping("/{id}/status")
    public Booking updateStatus(@PathVariable String id, @RequestParam Booking.BookingStatus status) {
        return bookingService.updateBookingStatus(id, status);
    }
}
