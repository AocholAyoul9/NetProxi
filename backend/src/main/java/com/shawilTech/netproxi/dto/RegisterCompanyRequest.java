package com.shawilTech.netproxi.dto;

import lombok.Data;

@Data
public class RegisterCompanyRequest {
    private String username;
    private String email;
    private String password;
    private String phone;
    private String companyName;
    private String address;
    private Double latitude;
    private Double longitude;
    private String website;
    private String description;
}
