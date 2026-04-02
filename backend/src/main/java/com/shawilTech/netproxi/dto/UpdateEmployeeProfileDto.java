package com.shawilTech.netproxi.dto;
import lombok.Data;
import  lombok.Builder;

import java.util.List;

// UpdateEmployeeProfileDto.java
@Data
@Builder
public class UpdateEmployeeProfileDto {
    private String name;
    private String phone;
    private String address;
    private String avatarUrl;
    private List<String> skills;
    private Boolean isAvailable;
}
