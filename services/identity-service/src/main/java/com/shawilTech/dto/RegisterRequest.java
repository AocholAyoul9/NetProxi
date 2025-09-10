package com.shawilTech.identityservice.dto;

import lombok.Data;
import  java.util.UUID;

@Data
public  class RegisterRequest {
    private String username;
    private  String email;
    private String password;
    private String role;
    private UUID companyId;
}
