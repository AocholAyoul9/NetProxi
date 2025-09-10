package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.entity.*;
import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;

import lombok.RequiredArgsConstructor;
import java.util.List;
import  java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
@Data
@RequiredArgsConstructor
@Tag(name = "Booking", description = "APIs for managing bookings")
public class BookingController {

    private final BookingService bookingService;

    @Operation(summary = "Create a new booking")
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest booking,UUID companyId) {
        return ResponseEntity.ok(bookingService.createBooking(booking, companyId));
    }

    @Operation(summary = "Get a booking by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable UUID id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get all bookings")
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @Operation(summary = "Update an existing booking")
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable UUID id, @RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.updateBooking(id, booking));
    }

    @Operation(summary = "Update booking Status")
    @PutMapping("/status/{id}")
    public ResponseEntity<Booking> updateStatus(@PathVariable UUID id, @RequestBody BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateStatus(id, status));
    }

    @Operation(summary = "Delete a booking by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable UUID id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
