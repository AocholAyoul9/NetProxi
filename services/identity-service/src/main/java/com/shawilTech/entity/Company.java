package com.shawilTech.identityservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String address;
    private String email;
    private String phone;
    private String registrationNumber;

    private boolean active = true;

    private Integer maxEmployees;
    private Integer maxActiveBookings;

    @OneToMany(mappedBy = "company")
    private Set<User> employees;

    @OneToMany(mappedBy = "company")
    private Set<Subscription> subscriptions; // history of subscriptions

    @OneToOne
    @JoinColumn(name = "active_subscription_id")
    private Subscription activeSubscription; // current subscription
}
