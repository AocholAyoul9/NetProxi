package com.shawilTech.identityservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private  String message;

    public AuthResponse(String token, String username){
        this.token = token;
        this.username = username;
        this.message = "Authentication successfull";
    }

}