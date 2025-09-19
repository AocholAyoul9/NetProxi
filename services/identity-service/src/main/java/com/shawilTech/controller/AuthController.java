package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new company and its first admin user.
     */
    @PostMapping("/register-company")
    public AuthResponse registerCompany(@RequestBody RegisterCompanyRequest request) {
        return authService.registerCompany(request);
    }

    /**
     * Register a new client user.
     */
    @PostMapping("/register-client")
    public AuthResponse registerClient(@RequestBody RegisterClientRequest request) {
        return authService.registerClient(request);
    }

    /**
     * Authenticate and issue JWT token.
     */
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
