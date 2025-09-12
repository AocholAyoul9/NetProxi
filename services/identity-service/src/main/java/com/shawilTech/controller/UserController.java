package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.dto.UserRequestDto;
import com.shawilTech.identityservice.dto.UserResponseDto;
import com.shawilTech.identityservice.entity.User;
import com.shawilTech.identityservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/companies/{companyId}/employees")
@RequiredArgsConstructor
public class UserController {

    private  final  UserService userService;

    @PostMapping
    public  UserResponseDto createEmployee(@PathVariable UUID companyId, @RequestBody UserRequestDto dto){
        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .build();
        User saved = userService.createEmployee(user, companyId);

        return  UserResponseDto.builder()
                .id(saved.getId())
                .username(saved.getUsername())
                .email(saved.getEmail())
                .active(saved.isActive())
                .build();

    }

    // get all employees
    @GetMapping
    public List<UserResponseDto> getEmployees(@PathVariable UUID companyId){
        return  userService.getEmployeesByCompany(companyId)
                .stream()
                .map(user-> UserResponseDto.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .active(user.isActive())
                                .build())
                .collect(Collectors.toList());
    }
}