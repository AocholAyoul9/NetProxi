package com.shawilTech.identityservice.dto;

import lombok.Data;
import lombok.Builder;
import java.util.UUID;

@Data
@Builder
public  class ServiceResponseDto {
    private UUID id;
    private String name;
    private String description;
    private Double basePrice;
    private Integer durationInMinutes;
    private  UUID companyId;
    private String companyName;
    private boolean active;
}