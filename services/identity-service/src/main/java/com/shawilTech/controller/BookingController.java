package com.shawilTech.identityservice.controller;

<<<<<<< HEAD
import com.shawilTech.identityservice.dto.BookingRequestDto;
import com.shawilTech.identityservice.dto.BookingResponseDto;
import com.shawilTech.identityservice.entity.BookingStatus;
import com.shawilTech.identityservice.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "APIs for managing bookings")
=======
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
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
public class BookingController {

    private final BookingService bookingService;

<<<<<<< HEAD
    @Operation(summary = "Create booking")
    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@RequestBody BookingRequestDto request) {
        BookingResponseDto response = bookingService.createBooking(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get all client bookings")
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<BookingResponseDto>> getClientBookings(@PathVariable UUID clientId) {
        List<BookingResponseDto> bookings = bookingService.getClientBookings(clientId);
        return ResponseEntity.ok(bookings);
    }


    @Operation(summary = "Get all companies bookings")
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<BookingResponseDto>> getCompanyBookings(@PathVariable UUID companyId) {
        List<BookingResponseDto> bookings = bookingService.getCompanyBookings(companyId);
        return ResponseEntity.ok(bookings);
    }

    @Operation(summary = "Get client booking from specific company")
    @GetMapping("/client/{clientId}/company/{companyId}")
    public ResponseEntity<List<BookingResponseDto>> getClientBookingsForCompany(
            @PathVariable UUID clientId,
            @PathVariable UUID companyId) {
        List<BookingResponseDto> bookings = bookingService.getClientBookingsForCompany(clientId, companyId);
        return ResponseEntity.ok(bookings);
    }

    @Operation(summary = "Get booking by ID")
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDto> getBooking(@PathVariable UUID bookingId) {
        BookingResponseDto booking = bookingService.getBooking(bookingId);
        return ResponseEntity.ok(booking);
    }

    @Operation(summary = "update a booking")
    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponseDto> updateBookingStatus(
            @PathVariable UUID bookingId,
            @RequestParam BookingStatus status) {
        BookingResponseDto updatedBooking = bookingService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok(updatedBooking);
    }

    @Operation(summary = "Cannecl a booking")
    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponseDto> cancelBooking(@PathVariable UUID bookingId) {
        BookingResponseDto cancelledBooking = bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(cancelledBooking);
    }
}
=======
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
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
