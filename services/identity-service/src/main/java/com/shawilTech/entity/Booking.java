package com.shawilTech.identityservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.*;
import java.util.UUID;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    private UUID clientId;
    private UUID agentId;

    private String serviceType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String address;
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}

