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

    private String resolveUserId(UserPrincipal userPrincipal, String headerUserId) {
        if (userPrincipal != null) {
            return userPrincipal.getId();
        }
        return headerUserId != null ? headerUserId : "2";
    }

    private String resolveUserName(UserPrincipal userPrincipal) {
        if (userPrincipal != null) {
            return userPrincipal.getUsername();
        }
        return "Mock User";
    }

    @PostMapping
    public Booking createBooking(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestBody Booking booking) {
        booking.setUserId(resolveUserId(userPrincipal, headerUserId));
        booking.setUserName(resolveUserName(userPrincipal));
        return bookingService.createBooking(booking);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/my")
    public List<Booking> getMyBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        return bookingService.getBookingsByUser(resolveUserId(userPrincipal, headerUserId));
    }

    @PutMapping("/{id}/status")
    public Booking updateStatus(@PathVariable String id, @RequestParam Booking.BookingStatus status) {
        return bookingService.updateBookingStatus(id, status);
    }
}
