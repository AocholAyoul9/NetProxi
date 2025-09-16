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
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "APIs for managing bookings")
public class BookingController {

    private final BookingService bookingService;

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