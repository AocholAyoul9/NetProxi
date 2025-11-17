package com.shawilTech.identityservice.dto;

import lombok.Data;

@Data
public class CompanyLoginRequestDto {
    private String email;
    private String password;
}
