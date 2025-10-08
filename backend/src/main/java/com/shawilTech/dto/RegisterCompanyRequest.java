package com.shawilTech.identityservice.dto;

import  lombok.Data;
@Data
public class RegisterCompanyRequest {
    private String companyName;
    private String address;
    private String username;
    private String email;
    private String password;

    private Double latitude;   
    private Double longitude;
}
