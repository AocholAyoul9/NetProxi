package com.shawilTech.netproxi.dto;

import lombok.Data;

@Data
public  class ServiceRequestDto {
    private String name;
    private  String description;
    private Double basePrice;
    private Integer durationInMinutes;
}