package com.shawilTech.identityservice.dto;
import lombok.Data;
import  lombok.Builder;

import  java.util.UUID;

@Data
@Builder
public class EmployeeResponseDto {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private  boolean active;
}