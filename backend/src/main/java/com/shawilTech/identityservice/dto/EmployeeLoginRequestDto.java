package com.shawilTech.identityservice.dto;

import lombok.Data;

@Data
public class EmployeeLoginRequestDto {
    private String email;
    private String password;
}