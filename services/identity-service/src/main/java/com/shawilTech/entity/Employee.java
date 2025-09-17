package com.shawilTech.identityservice.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.GenericGenerator;


@Entity
@Table(name = "Employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String email;
    private String phone;
    private String address;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @Builder.Default
    private boolean active = true;
}