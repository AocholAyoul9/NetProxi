package com.shawilTech.identityservice.dto;

import lombok.Data;

@Data
public class ClientRequestDto {
    private String name;
    private String email;
    private String phone;
    private String address;
}