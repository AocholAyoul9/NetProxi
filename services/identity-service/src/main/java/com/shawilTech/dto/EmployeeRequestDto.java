package com.shawilTech.identityservice.dto;
import lombok.Data;

@Data
public  class EmployeeRequestDto {
    private String name;
    private String email;
    private String phone;
    private String address;
}