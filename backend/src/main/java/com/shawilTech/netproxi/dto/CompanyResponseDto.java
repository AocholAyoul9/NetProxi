package com.shawilTech.netproxi.dto;


import lombok.*;

import java.math.BigDecimal;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyResponseDto {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private boolean active;
  
      // Subscription info
    private String activePlan;
    private BigDecimal monthlyPrice;
    private boolean subscriptionActive;
    // Branding
    private String logoUrl;
    private String website;
    private String description;
    private  String token;

    // Location
    private Double latitude;
    private Double longitude;
    private Double distance;

    // Quality indicators
    private Double rating;
    private Integer reviewsCount;

    // Services
    private List<ServiceResponseDto> services;
    private String pricing;
    private String openingHours;
}



