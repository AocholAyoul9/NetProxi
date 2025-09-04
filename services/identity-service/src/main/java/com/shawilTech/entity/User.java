package com.shawilTech.identityservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;
import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder.Default
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // ← Change to UUID
    private UUID id;

    @Column(unique = true)
    private String username;

    @Column(unique = true)
    private String email;

    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    private  boolean active = true;
}
