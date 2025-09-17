package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.dto.ServiceRequestDto;
import com.shawilTech.identityservice.dto.ServiceResponseDto;
import com.shawilTech.identityservice.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
<<<<<<< HEAD
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
<<<<<<< HEAD
@Tag(name = "Services", description = "APIs for managing company Services")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
public class ServiceController {

    private final CompanyService companyService;

<<<<<<< HEAD
    @Operation(summary = "Create a new service")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    @PostMapping
    public ResponseEntity<ServiceResponseDto> createService(@RequestBody ServiceRequestDto request) {
        ServiceResponseDto response = companyService.createService(request);
        return ResponseEntity.ok(response);
    }

<<<<<<< HEAD
    @Operation(summary = "Get all company services")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<ServiceResponseDto>> getCompanyServices(@PathVariable UUID companyId) {
        List<ServiceResponseDto> services = companyService.getCompanyServices(companyId);
        return ResponseEntity.ok(services);
    }

<<<<<<< HEAD
    @Operation(summary = "Get a single service")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    @GetMapping("/{serviceId}")
    public ResponseEntity<ServiceResponseDto> getService(@PathVariable UUID serviceId) {
        ServiceResponseDto service = companyService.getService(serviceId);
        return ResponseEntity.ok(service);
    }

<<<<<<< HEAD
    @Operation(summary = "Update a service")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    @PutMapping("/{serviceId}")
    public ResponseEntity<ServiceResponseDto> updateService(
            @PathVariable UUID serviceId,
            @RequestBody ServiceRequestDto request) {
        ServiceResponseDto updatedService = companyService.updateService(serviceId, request);
        return ResponseEntity.ok(updatedService);
    }

<<<<<<< HEAD
    @Operation(summary = "Delete a service")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> deactivateService(@PathVariable UUID serviceId) {
        companyService.deactivateService(serviceId);
        return ResponseEntity.noContent().build();
    }
}