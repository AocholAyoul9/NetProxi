package com.shawilTech.identityservice.dto;
import lombok.Data;
import  lombok.Builder;

import java.util.List;
import  java.util.UUID;
// EmployeeTaskResponseDto.java
@Data
@Builder
public class EmployeeTaskResponseDto {
    private UUID id;
    private String serviceName;
    private UUID serviceId;
    private String clientName;
    private String clientPhone;
    private String clientEmail;
    private UUID companyId;
    private String companyName;
    private UUID employeeId;
    private String employeeName;
    private String startTime;
    private String endTime;
    private String actualStartTime;
    private String actualEndTime;
    private Integer duration;
    private String address;
    private String status;
    private String description;
    private String notes;
    private String priority;
    private Integer rating;
    private String review;
    private Double price;
    private String paymentStatus;
    private String createdAt;
    private String updatedAt;
}