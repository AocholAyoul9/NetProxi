package com.shawilTech.netproxi.dto;
import  lombok.Data;
@Data
public class RegisterClientRequest {
    private String username;
    private  String address;
    private  String phone;
    private String email;
    private String password;
}