package com.shawilTech.netproxi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponseDto {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String token;
    private boolean active;
}
