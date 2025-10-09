package com.shawilTech.identityservice.dto;
import  lombok.Data;

@Data
public  class CompanyRequestDto {
    private  String name;
    private  String address;
    private  String email;
    private  String phone;
    private String registrationNumber;
    private Double latitude;
    private Double longitude;
}