package com.shawilTech.identityservice.entity;



import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
<<<<<<< HEAD
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
=======

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // ← Change to UUID
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    private UUID id;

    @Column(unique = true, nullable = false)
    private String name; // ROLE_ADMIN, ROLE_CLIENT,
}
