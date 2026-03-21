package com.shawilTech.netproxi.dto;
import lombok.Data;
import  lombok.Builder;

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