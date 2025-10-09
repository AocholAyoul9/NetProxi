package com.shawilTech.identityservice.dto;

import lombok.Data;
import java.util.UUID;

@Data

public  class ServiceRequestDto {
    private String name;
    private  String description;
    private Double basePrice;
    private Integer durationInMinutes;
    private UUID companyId;
}