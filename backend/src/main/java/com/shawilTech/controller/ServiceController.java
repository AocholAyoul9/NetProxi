package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.dto.ServiceRequestDto;
import com.shawilTech.identityservice.dto.ServiceResponseDto;
import com.shawilTech.identityservice.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @Operation(summary = "Create a new service")
    @PostMapping
    public ResponseEntity<ServiceResponseDto> createService(@RequestBody ServiceRequestDto request) {
        ServiceResponseDto response = companyService.createService(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get all company services")
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<ServiceResponseDto>> getCompanyServices(@PathVariable UUID companyId) {
        List<ServiceResponseDto> services = companyService.getCompanyServices(companyId);
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
            @PathVariable UUID serviceId,
            @RequestBody ServiceRequestDto request) {
        ServiceResponseDto updatedService = companyService.updateService(serviceId, request);
        return ResponseEntity.ok(updatedService);
    }

    @Operation(summary = "Delete a service")
    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> deactivateService(@PathVariable UUID serviceId) {
        companyService.deactivateService(serviceId);
        return ResponseEntity.noContent().build();
    }
}