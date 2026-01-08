package com.shawilTech.identityservice.dto;
import lombok.Data;
import  lombok.Builder;

import java.util.List;
import  java.util.UUID;
// EmployeeScheduleResponseDto.java
@Data
@Builder
public class EmployeeScheduleResponseDto {
    private UUID id;
    private String date;
    private String startTime;
    private String endTime;
    private String status;
    private String serviceName;
    private String clientName;
    private String address;
}
