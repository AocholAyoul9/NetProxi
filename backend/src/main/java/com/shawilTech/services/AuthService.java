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
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtProvider;

    public AuthResponse registerCompany(RegisterCompanyRequest request) {
        Role role = roleRepository.findByName("ROLE_COMPANY")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Company company = Company.builder()
                .name(request.getCompanyName())
                .address(request.getAddress())
                .active(true)
                .build();
        companyRepository.save(company);

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton(role))
                .company(company)
                .build();
        userRepository.save(user);

        String token = jwtProvider.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role("COMPANY")
                .message("Company registered successfully")
                .build();
    }

    public AuthResponse registerClient(RegisterClientRequest request) {
        Role role = roleRepository.findByName("ROLE_CLIENT")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = User.builder()
                .username(request.getUsername())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton(role))
                .build();
        userRepository.save(user);

        String token = jwtProvider.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .address(user.getAddress())
                .phone(user.getPhone())
                .role("CLIENT")
                .message("Client registered successfully")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtProvider.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRoles().stream().findFirst().map(Role::getName).orElse("UNKNOWN"))
                .message("Login successful!")
                .build();
    }
}
