package com.shawilTech.identityservice.service;


import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.entity.*;
import com.shawilTech.identityservice.repository.*;
import com.shawilTech.identityservice.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor

public  class AuthService{

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtProvider;

    public  AuthResponse register(RegisterRequest request){

        Role role = roleRepository.findByName("Role_" + request.getRole().toUpperCase())
                .orElseThrow(()-> new RuntimeException("Role not found"));

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));


        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton(role))
                .company(company)
                .build();


        userRepository.save(user);

        String token = jwtProvider.generateToken(user.getUsername());
        return  new AuthResponse(token, user.getUsername());
    }


    public  AuthResponse login(LoginRequest request){

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(()-> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtProvider.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername());

    }
}