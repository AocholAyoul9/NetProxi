package com.shawilTech.identityservice.dto;

import lombok.Data;

@Data
public class ClientLoginRequestDto {
    private String email;
    private String password;
}
