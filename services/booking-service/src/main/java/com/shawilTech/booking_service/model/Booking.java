package com.shawilTech.booking_service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private  UUID clientId;
    private  UUID agentId;

    private  String serviceType;
    private  LocalDate date;
    private  LocalTime startTime;
    private  LocalTime endTime;

    private  String address;
    private  String notes;

    @Enumerated(EnumType.STRING)

    private BookingStatus status = BookingStatus.PENDING;
    private  LocalDateTime createdAt = LocalDateTime.now();
}
