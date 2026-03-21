package com.shawilTech.netproxi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.shawilTech.netproxi.dto.AuthResponse;
import com.shawilTech.netproxi.dto.LoginRequest;
import com.shawilTech.netproxi.dto.RegisterClientRequest;
import com.shawilTech.netproxi.dto.RegisterCompanyRequest;
import com.shawilTech.netproxi.entity.RefreshToken;
import com.shawilTech.netproxi.entity.User;
import com.shawilTech.netproxi.repository.UserRepository;
import com.shawilTech.netproxi.security.JwtTokenProvider;
import com.shawilTech.netproxi.service.AuthService;
import com.shawilTech.netproxi.service.RefreshTokenService;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for login, registration, token refresh and logout")
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    /**
     * POST /api/auth/login
     * Validate credentials and return accessToken + refreshToken.
     */
    @Operation(summary = "Login with username/email and password")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);

        // Create a persistent refresh token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(authResponse.getUsername());

        AuthResponse fullResponse = AuthResponse.builder()
                .token(authResponse.getToken())
                .accessToken(authResponse.getAccessToken())
                .refreshToken(refreshToken.getToken())
                .username(authResponse.getUsername())
                .email(authResponse.getEmail())
                .role(authResponse.getRole())
                .roles(authResponse.getRoles())
                .companyId(authResponse.getCompanyId())
                .message(authResponse.getMessage())
                .build();

        return ResponseEntity.ok(fullResponse);
    }

    /**
     * POST /api/auth/register/client
     * Register a new client user.
     */
    @Operation(summary = "Register a new client")
    @PostMapping("/register/client")
    public ResponseEntity<AuthResponse> registerClient(@RequestBody RegisterClientRequest request) {
        AuthResponse response = authService.registerClient(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/register/company
     * Register a new company (creates tenant + admin user).
     */
    @Operation(summary = "Register a new company (creates tenant + admin user)")
    @PostMapping("/register/company")
    public ResponseEntity<AuthResponse> registerCompany(@RequestBody RegisterCompanyRequest request) {
        AuthResponse response = authService.registerCompany(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/refresh
     * Generate a new access token using a valid refresh token.
     */
    @Operation(summary = "Refresh the access token using a refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody Map<String, String> body) {
        String requestToken = body.get("refreshToken");

        RefreshToken refreshToken = refreshTokenService.findByToken(requestToken);
        refreshTokenService.verifyExpiration(refreshToken);

        User user = refreshToken.getUser();
        String newAccessToken = jwtTokenProvider.generateToken(user.getUsername());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(newAccessToken)
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .username(user.getUsername())
                .email(user.getEmail())
                .message("Token refreshed successfully")
                .build());
    }

    /**
     * POST /api/auth/logout
     * Invalidate the refresh token for the current user.
     */
    @Operation(summary = "Logout and invalidate refresh token")
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestBody Map<String, String> body) {
        String username = body.get("username");

        userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .ifPresent(refreshTokenService::deleteByUser);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    /**
     * Example of a role-protected endpoint: only COMPANY_ADMIN can access.
     * GET /api/auth/admin/dashboard
     */
    @Operation(summary = "Company admin dashboard (RBAC example)")
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('COMPANY_ADMIN')")
    public ResponseEntity<Map<String, String>> adminDashboard() {
        return ResponseEntity.ok(Map.of("message", "Welcome, Company Admin!"));
    }

    /**
     * Example of a role-protected endpoint: only SUPER_ADMIN can access.
     * GET /api/auth/super-admin/dashboard
     */
    @Operation(summary = "Super admin dashboard (RBAC example)")
    @GetMapping("/super-admin/dashboard")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> superAdminDashboard() {
        return ResponseEntity.ok(Map.of("message", "Welcome, Super Admin!"));
    }
}
