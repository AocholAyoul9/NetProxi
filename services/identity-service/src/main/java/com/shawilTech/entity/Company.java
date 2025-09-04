package com.shawilTech.identityservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String address;

    private String email;

    private String phone;

    private  String registrationNumber;

    @Enumerated(EnumType.STRING)
    private  SubscriptionPlan subscriptionPlan; // FREE, BASIC, PREMIUM, ENTERPRISE

    private  LocalDateTime subscriptionStartDate;
    private LocalDateTime getSubscriptionEndDate;
    private  boolean active = true;

    private  Integer maxEmployees;
    private  Integer maxActiveBookings;

    @OneToMany(mappedBy = "company")
    private Set<User> employees;
}
