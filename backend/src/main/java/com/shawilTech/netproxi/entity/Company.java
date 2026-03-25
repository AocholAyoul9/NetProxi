package com.shawilTech.netproxi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    private String name;

    @Column(name = "address")
    private String address;
    private String email;
    private String password;
    private String phone;

    @Builder.Default
    private boolean active = true;

    private Integer maxEmployees;
    private Integer maxActiveBookings;

    private Double latitude;
    private Double longitude;

    private String logoUrl;
    private String website;

    @Column(length = 2000)
    private String description;

    private String token;

    private String pricing;
    private String openingHours;

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    private List<ServiceEntity> services;

    @OneToMany(mappedBy = "company")
    private Set<User> employees;

    @OneToMany(mappedBy = "company")
    @JsonManagedReference
    private Set<Subscription> subscriptions;

    @OneToOne
    @JoinColumn(name = "active_subscription_id")
    private Subscription activeSubscription;
}
