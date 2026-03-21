package com.shawilTech.identityservice.dto;
import lombok.Data;
import  lombok.Builder;

import java.util.List;
import  java.util.UUID;
// UpdateTaskStatusDto.java
@Data
@Builder
public class UpdateTaskStatusDto {
    private String status;
    private String startTime;
    private String endTime;
    private String notes;
}