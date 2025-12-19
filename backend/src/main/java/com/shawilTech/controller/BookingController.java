package com.shawilTech.identityservice.controller;

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
@RequestMapping("/api/companies/{companyId}/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "APIs for managing company bookings")
public class BookingController {

    private final BookingService bookingService;

    // ------------------- CREATE -------------------
    @Operation(summary = "Create a new booking for a company")
    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(
            @PathVariable UUID companyId,
            @RequestBody BookingRequestDto request) {

        request.setCompanyId(companyId); // enforce companyId from URL
        BookingResponseDto response = bookingService.createBooking(request);
        return ResponseEntity.ok(response);
    }

    // ------------------- GET BOOKINGS -------------------
    @Operation(summary = "Get all bookings for a company")
    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getCompanyBookings(@PathVariable UUID companyId) {
        List<BookingResponseDto> bookings = bookingService.getCompanyBookings(companyId);
        return ResponseEntity.ok(bookings);
    }

    // ------------------- CANCEL BOOKING -------------------
    @Operation(summary = "Cancel a booking")
    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponseDto> cancelBooking(
            @PathVariable UUID companyId,
            @PathVariable UUID bookingId) {

        // Optional: Validate booking belongs to the company
        BookingResponseDto cancelledBooking = bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(cancelledBooking);
    }

    // ------------------- UPDATE BOOKING STATUS -------------------
    @Operation(summary = "Update booking status")
    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponseDto> updateBookingStatus(
            @PathVariable UUID companyId,
            @PathVariable UUID bookingId,
            @RequestParam BookingStatus status) {

        BookingResponseDto updatedBooking = bookingService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok(updatedBooking);
    }

    // ------------------- ASSIGN EMPLOYEE -------------------
    @PatchMapping("/{bookingId}/assign")
    public ResponseEntity<BookingResponseDto> assignBooking(
            @PathVariable UUID companyId,
            @PathVariable UUID bookingId,
            @RequestParam UUID employeeId) {

        return ResponseEntity.ok(
                bookingService.assignBookingToEmployee(companyId, bookingId, employeeId));
    }

    // ------------------- GET BOOKING BY ID -------------------
    @Operation(summary = "Get a booking by ID")
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDto> getBooking(
            @PathVariable UUID companyId,
            @PathVariable UUID bookingId) {

        BookingResponseDto booking = bookingService.getBooking(bookingId);
        return ResponseEntity.ok(booking);
    }
}
