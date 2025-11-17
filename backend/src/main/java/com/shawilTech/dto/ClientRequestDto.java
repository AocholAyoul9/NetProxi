package com.shawilTech.identityservice.dto;

import lombok.*;
import java.util.UUID;

@Builder
@Data
public class ClientRequestDto {
    private UUID id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String token;
}