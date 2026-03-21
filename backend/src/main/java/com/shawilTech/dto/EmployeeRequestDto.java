package com.shawilTech.netproxi.dto;
import lombok.Data;

@Data
public  class EmployeeRequestDto {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
}