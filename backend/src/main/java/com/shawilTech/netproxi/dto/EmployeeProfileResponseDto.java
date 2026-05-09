package com.shawilTech.netproxi.dto;
import lombok.Data;
import  lombok.Builder;

import java.util.List;
import  java.util.UUID;

@Data
@Builder
public class EmployeeProfileResponseDto {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String role;
    private String avatarUrl;
    private UUID companyId;
    private String companyName;
    private List<String> skills;
    private Integer totalTasks;
    private Integer completedTasks;
    private Integer pendingTasks;
    private Double averageRating;
    private Boolean isAvailable;
    private String joinDate;
}