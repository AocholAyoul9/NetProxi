package com.shawilTech.identityservice.dto;
import lombok.Data;
import  lombok.Builder;

import java.util.List;
import  java.util.UUID;
// EmployeeStatsResponseDto.java
@Data
@Builder
public class EmployeeStatsResponseDto {
    private Integer totalTasks;
    private Integer completedTasks;
    private Integer inProgressTasks;
    private Integer pendingTasks;
    private Integer completionRate;
    private Double averageRating;
    private Double totalEarnings;
    private String period;
}