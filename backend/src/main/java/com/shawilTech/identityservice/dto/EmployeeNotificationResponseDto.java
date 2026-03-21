package com.shawilTech.netproxi.dto;
import lombok.Data;
import  lombok.Builder;

import java.util.List;
import  java.util.UUID;
// EmployeeNotificationResponseDto.java
@Data
@Builder
public class EmployeeNotificationResponseDto {
    private UUID id;
    private UUID employeeId;
    private String title;
    private String message;
    private String type;
    private Boolean read;
    private Object data;
    private String createdAt;
    private String actionUrl;
}