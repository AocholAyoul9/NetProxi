package com.shawilTech.netproxi.dto;

import lombok.Data;

@Data
public class EmployeeLoginRequestDto {
    private String email;
    private String password;
}