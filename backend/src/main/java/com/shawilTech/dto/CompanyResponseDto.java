package com.shawilTech.identityservice.dto;

import com.shawilTech.identityservice.entity.SubscriptionPlan;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CompanyResponseDto {
    private UUID id;
    private String name;
    private String address;
    private String email;
    private String phone;
    private Double latitude;
    private Double longitude;
    private boolean active;
    private SubscriptionPlan activePlan;
}