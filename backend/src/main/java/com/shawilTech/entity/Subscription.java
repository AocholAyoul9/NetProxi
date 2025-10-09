package com.shawilTech.identityservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    @JsonBackReference
    private Company company;

    @Enumerated(EnumType.STRING)
    private SubscriptionPlan plan;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private boolean active;

    private BigDecimal price; // actual charged price for this cycle
}
