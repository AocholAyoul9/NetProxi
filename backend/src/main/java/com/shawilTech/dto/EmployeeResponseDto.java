package com.shawilTech.netproxi.dto;
import lombok.Data;
import  lombok.Builder;

import java.util.List;
import  java.util.UUID;

@Data
@Builder
public class EmployeeResponseDto {
    private UUID id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private  boolean active;
    private String avatarUrl;
    private String token;
    private String role;
}