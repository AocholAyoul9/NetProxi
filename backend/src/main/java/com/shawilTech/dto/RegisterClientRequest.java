package com.shawilTech.identityservice.dto;
import  lombok.Data;
@Data
public class RegisterClientRequest {
    private String username;
    private  String address;
    private  String phone;
    private String email;
    private String password;
}