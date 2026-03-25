package com.shawilTech.netproxi.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceEntity{
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    private String name;
    private String description;
    private Double basePrice;
    private Integer durationInMinutes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    @Builder.Default
    private  boolean active = true;
}
