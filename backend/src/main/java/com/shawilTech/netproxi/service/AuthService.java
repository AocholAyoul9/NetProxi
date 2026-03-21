package com.shawilTech.netproxi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shawilTech.netproxi.dto.AuthResponse;
import com.shawilTech.netproxi.dto.LoginRequest;
import com.shawilTech.netproxi.dto.RegisterClientRequest;
import com.shawilTech.netproxi.dto.RegisterCompanyRequest;
import com.shawilTech.netproxi.entity.Company;
import com.shawilTech.netproxi.entity.Role;
import com.shawilTech.netproxi.entity.User;
import com.shawilTech.netproxi.repository.CompanyRepository;
import com.shawilTech.netproxi.repository.RoleRepository;
import com.shawilTech.netproxi.repository.UserRepository;
import com.shawilTech.netproxi.security.JwtTokenProvider;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtProvider;

    /**
     * Authenticate a user with username/email and password.
     * Returns an AuthResponse containing access token and user info.
     */
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtProvider.generateToken(user.getUsername());

        List<String> roles = user.getRoles() == null ? Collections.emptyList()
                : user.getRoles().stream().map(Role::getName).collect(Collectors.toList());

        String primaryRole = roles.isEmpty() ? null : roles.get(0);

        return AuthResponse.builder()
                .token(token)
                .accessToken(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(primaryRole)
                .roles(roles)
                .companyId(user.getCompany() != null ? user.getCompany().getId() : null)
                .message("Login successful!")
                .build();
    }

    /**
     * Register a new client user with ROLE_CLIENT.
     */
    @Transactional
    public AuthResponse registerClient(RegisterClientRequest request) {
        Role clientRole = roleRepository.findByName("ROLE_CLIENT")
                .orElseThrow(() -> new RuntimeException("Role ROLE_CLIENT not found"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .enabled(true)
                .roles(Collections.singleton(clientRole))
                .build();

        userRepository.save(user);

        String token = jwtProvider.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .accessToken(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role("CLIENT")
                .roles(List.of("ROLE_CLIENT"))
                .message("Client registered successfully")
                .build();
    }

    /**
     * Register a new company tenant with a ROLE_COMPANY_ADMIN user.
     * Creates the company (tenant) and the admin user in a single transaction.
     */
    @Transactional
    public AuthResponse registerCompany(RegisterCompanyRequest request) {
        Role companyAdminRole = roleRepository.findByName("ROLE_COMPANY")
                .orElseThrow(() -> new RuntimeException("Role ROLE_COMPANY not found"));

        // Create the tenant company
        Company company = Company.builder()
                .name(request.getCompanyName())
                .address(request.getAddress())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .website(request.getWebsite())
                .description(request.getDescription())
                .active(true)
                .build();

        Company savedCompany = companyRepository.save(company);

        // Create the admin user linked to the company
        User admin = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .company(savedCompany)
                .roles(Collections.singleton(companyAdminRole))
                .build();

        userRepository.save(admin);

        String token = jwtProvider.generateToken(admin.getUsername());

        return AuthResponse.builder()
                .token(token)
                .accessToken(token)
                .username(admin.getUsername())
                .email(admin.getEmail())
                .role("COMPANY")
                .roles(List.of(companyAdminRole.getName()))
                .companyId(savedCompany.getId())
                .message("Company registered successfully")
                .build();
    }
}
