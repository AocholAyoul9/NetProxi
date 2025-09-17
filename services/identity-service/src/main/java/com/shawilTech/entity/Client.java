
package com.shawilTech.identityservice.entity;
import jakarta.persistence.*;
import lombok.Data;
<<<<<<< HEAD
import lombok.Builder;
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;
import  java.util.Set;

@Entity
@Table(name = "clients")
@Data
<<<<<<< HEAD
@Builder
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String email;
    private String phone;
    private String address;

    @OneToMany(mappedBy = "client")
    private Set<Booking> bookings;
}
