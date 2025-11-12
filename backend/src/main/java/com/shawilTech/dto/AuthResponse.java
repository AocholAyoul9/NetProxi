package com.shawilTech.identityservice.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String address;
    private String phone;
    private String role;
    private String message;
}
