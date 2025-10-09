package com.shawilTech.identityservice.dto;
import lombok.Data;
import  lombok.Builder;

@Data
@Builder
public class EmployeeResponseDto {
    private String name;
    private String email;
    private String phone;
    private String address;
    private  boolean active;
}