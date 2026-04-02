package com.shawilTech.netproxi.dto;
import lombok.Data;
import  lombok.Builder;

@Data
@Builder
public class UpdateAvailabilityDto {
    private Boolean available;
}