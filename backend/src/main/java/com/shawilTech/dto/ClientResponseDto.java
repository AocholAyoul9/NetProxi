package com.shawilTech.identityservice.dto;

import lombok.Data;

import lombok.Data;
import lombok.Builder;
import java.util.UUID;

@Data
@Builder
public class ClientResponseDto {
    private  UUID id;
    private String name;
    private String email;
    private  String password;
    private String token;
    private String phone;
    private String address;
}