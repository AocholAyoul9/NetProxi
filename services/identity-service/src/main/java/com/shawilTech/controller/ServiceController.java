package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.dto.ServiceRequestDto;
import com.shawilTech.identityservice.dto.ServiceResponseDto;
import com.shawilTech.identityservice.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<ServiceResponseDto> createService(@RequestBody ServiceRequestDto request) {
        ServiceResponseDto response = companyService.createService(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<ServiceResponseDto>> getCompanyServices(@PathVariable UUID companyId) {
        List<ServiceResponseDto> services = companyService.getCompanyServices(companyId);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<ServiceResponseDto> getService(@PathVariable UUID serviceId) {
        ServiceResponseDto service = companyService.getService(serviceId);
        return ResponseEntity.ok(service);
    }

    @PutMapping("/{serviceId}")
    public ResponseEntity<ServiceResponseDto> updateService(
            @PathVariable UUID serviceId,
            @RequestBody ServiceRequestDto request) {
        ServiceResponseDto updatedService = companyService.updateService(serviceId, request);
        return ResponseEntity.ok(updatedService);
    }

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> deactivateService(@PathVariable UUID serviceId) {
        companyService.deactivateService(serviceId);
        return ResponseEntity.noContent().build();
    }
}