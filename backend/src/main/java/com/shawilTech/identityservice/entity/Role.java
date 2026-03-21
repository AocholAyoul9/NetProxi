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
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Role names: ROLE_SUPER_ADMIN, ROLE_COMPANY_ADMIN, ROLE_EMPLOYEE, ROLE_CLIENT
     */
    @Column(unique = true, nullable = false)
    private String name;
}
