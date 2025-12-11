package com.shawilTech.identityservice.controller;


import com.shawilTech.identityservice.entity.BookingStatus;
import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.service.*;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final BookingService bookingService;

    @PostMapping("/register")
    public ResponseEntity<ClientResponseDto> registerClient(@RequestBody ClientRequestDto clientRequest) {
        ClientResponseDto response = clientService.registerClient(clientRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ClientResponseDto> loginClient(@RequestBody ClientLoginRequestDto clientRequest) {
        ClientResponseDto response = clientService.loginClient(clientRequest);
        return ResponseEntity.ok(response);
    }


    // getClienPtProfile
    @GetMapping("/profile")
    public ResponseEntity<ClientResponseDto> getClientProfile(
            @RequestHeader("clientId") UUID clientId 
    ) {
        ClientResponseDto response = clientService.getClientProfile(clientId);
        return ResponseEntity.ok(response);
    }

     // ------------------------------------------------------------------------
    // Load client reservations
    // ------------------------------------------------------------------------
    @GetMapping("/reservations")
    public ResponseEntity<List<BookingResponseDto>> getClientReservations(
            @RequestHeader("clientId") UUID clientId // OR decode from JWT
    ) {
        return ResponseEntity.ok(bookingService.getClientBookings(clientId));
    }

    // ------------------------------------------------------------------------
    // Update reservation status
    // ------------------------------------------------------------------------
    @PutMapping("/reservations/{reservationId}/status")
    public ResponseEntity<BookingResponseDto> updateStatus(
            @PathVariable UUID reservationId,
            @RequestBody UpdateStatusDto dto
    ) {
        BookingStatus status = BookingStatus.valueOf(dto.getStatus().toUpperCase());
        return ResponseEntity.ok(bookingService.updateBookingStatus(reservationId, status));
    }

    // ------------------------------------------------------------------------
    // Add reservation review
    // ------------------------------------------------------------------------
    @PostMapping("/reservations/{reservationId}/review")
    public ResponseEntity<String> addReview(
            @PathVariable UUID reservationId,
            @RequestBody ReviewRequestDto reviewDto
    ) {
        bookingService.addReviewToBooking(reservationId, reviewDto);
        return ResponseEntity.ok("Review added successfully");
    }

}