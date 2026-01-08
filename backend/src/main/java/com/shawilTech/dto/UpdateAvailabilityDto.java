package com.shawilTech.identityservice.dto;
import lombok.Data;
import  lombok.Builder;

import java.util.List;
import  java.util.UUID;
// UpdateAvailabilityDto.java
@Data
@Builder
public class UpdateAvailabilityDto {
    private Boolean isAvailable;
}