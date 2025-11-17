package com.shawilTech.identityservice.dto;

import lombok.Data;

@Data
public class RegisterCompanyRequest {
    private String email;
    private String password;

    private int phone;
    private String companyName;

    private String address;

    private Double siteWeb;
    private Double description;
}
