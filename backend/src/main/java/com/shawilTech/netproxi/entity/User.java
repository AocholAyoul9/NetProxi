package com.shawilTech.netproxi.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
                @Index(name = "idx_user_email", columnList = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

        @Id
        @GeneratedValue
        @Column(nullable = false, updatable = false)
        private UUID id;

        @Column(nullable = false, unique = true)
        private String username;

        @Column(nullable = false, unique = true)
        private String email;

        @Column(nullable = false)
        private String password;

        private String phone;

        private String address;

        @Column(nullable = true)
        private Double latitude;

        @Column(nullable = true)
        private Double longitude;
        
        @Builder.Default
        private boolean enabled = true;

        @Builder.Default
        private boolean active = true;

        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
        @JsonIgnore
        private Set<Role> roles;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "company_id")
        private Company company;
}
