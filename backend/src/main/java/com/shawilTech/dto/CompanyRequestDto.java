package com.shawilTech.identityservice.dto;
import  lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public  class CompanyRequestDto {
    private  String name;
    private  String address;
    private  String email;
    private  String password;
    private  String phone;

    private Double latitude;
    private Double longitude;

    private String logoUrl;
    private String website;

    private String description;

    private String token;

    private String pricing;
    private String openingHours;
}