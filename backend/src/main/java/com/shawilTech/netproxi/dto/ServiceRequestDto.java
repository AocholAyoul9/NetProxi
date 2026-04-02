package com.shawilTech.netproxi.dto;

import lombok.Data;
import java.util.UUID;

@Data
public  class ServiceRequestDto {
    private UUID companyId;
    private String name;
    private  String description;
    private Double basePrice;
    private Integer durationInMinutes;
}