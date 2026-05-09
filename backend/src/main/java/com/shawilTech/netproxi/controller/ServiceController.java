package com.shawilTech.netproxi.controller;

import com.shawilTech.netproxi.dto.ServiceRequestDto;
import com.shawilTech.netproxi.dto.ServiceResponseDto;
import com.shawilTech.netproxi.entity.Company;
import com.shawilTech.netproxi.entity.User;
import com.shawilTech.netproxi.service.CompanyService;
import com.shawilTech.netproxi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@Tag(name = "Services", description = "APIs for managing company Services")

public class ServiceController {

    private final CompanyService companyService;
    private final UserRepository userRepository;

    @Operation(summary = "Create a new service")
    @PostMapping
    public ResponseEntity<ServiceResponseDto> createService(@RequestBody ServiceRequestDto request) {
        ServiceResponseDto response = companyService.createService(request);
        return ResponseEntity.ok(response);
    }

  @Operation(summary = "Get services for logged-in user's company")
@GetMapping("/company/me")
public ResponseEntity<List<ServiceResponseDto>> getMyCompanyServices() {
    // Get username from security context
    String username = SecurityContextHolder.getContext().getAuthentication().getName();

    User user = userRepository.findByUsername(username)
                  .orElseThrow(() -> new RuntimeException("User not found"));

    Company company = user.getCompany();

    List<ServiceResponseDto> services = companyService.getCompanyServices(company.getId());
    return ResponseEntity.ok(services);
}

    @Operation(summary = "Get a single service")
    @GetMapping("/{serviceId}")
    public ResponseEntity<ServiceResponseDto> getService(@PathVariable UUID serviceId) {
        ServiceResponseDto service = companyService.getService(serviceId);
        return ResponseEntity.ok(service);
    }

    @Operation(summary = "Update a service")
    @PutMapping("/{serviceId}")
    public ResponseEntity<ServiceResponseDto> updateService(
            @PathVariable("serviceId") UUID serviceId, // <-- specify name
            @RequestBody ServiceRequestDto request) {
        ServiceResponseDto updatedService = companyService.updateService(serviceId, request);
        return ResponseEntity.ok(updatedService);
    }

    @Operation(summary = "DeActivate a service")
    @DeleteMapping("deactivate/{serviceId}")
    public ResponseEntity<Void> deactivateService(@PathVariable("serviceId") UUID serviceId) {
        companyService.deactivateService(serviceId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete a service")
    @DeleteMapping("delete/{serviceId}")
    public ResponseEntity<Void> deleteService(@PathVariable("serviceId") UUID serviceId) {
        companyService.deactivateService(serviceId);

        return ResponseEntity.noContent().build();
    }

}