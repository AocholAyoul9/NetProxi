package com.shawilTech.identityservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;


@Entity
@Table(name = "employees")
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
    private String password;
    private String phone;
    private String address;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @Builder.Default
    private boolean active = true;


    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "role")
    private String role = "EMPLOYEE"; // Default role
    
    @ElementCollection
    @CollectionTable(name = "employee_skills", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();
    
    @Column(name = "is_available")
    private boolean isAvailable = true;
    
    @Column(name = "rating")
    private Double rating;
    
    @Column(name = "total_tasks_completed")
    private Integer totalTasksCompleted = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}