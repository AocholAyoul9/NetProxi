package  com.shawilTech.identityservice.dto;

import lombok.Builder;

import  lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UserResponseDto {
    private UUID id;
    private  String username;
    private  String email;
    private  boolean active;
}