package com.shawilTech.netproxi.controller;

import com.shawilTech.netproxi.dto.*;
import com.shawilTech.netproxi.service.CompanyService;
import com.shawilTech.netproxi.service.EmployeeService;
import com.shawilTech.netproxi.service.GeocodingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.*;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Tag(name = "Companies", description = "APIs for managing companies")
public class CompanyController {

    private final CompanyService companyService;
    private final EmployeeService employeeService;
    private final GeocodingService geocodingService;


    /**
     * GET /api/companies/nearby?lat=48.85&lng=2.35&radiusKm=5
     */

    @GetMapping("/nearby")
    public List<CompanyResponseDto> getNearbyCompanies(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radiusKm
    ) {
        return companyService.findNearbyCompanies(lat, lng, radiusKm);
    }

    /**
     * POST /api/companies/geocode - Geocode an address
     */
    @PostMapping("/geocode")
    public GeocodingResponse geocodeAddress(@RequestBody GeocodingRequest request) {
        return geocodingService.geocodeAddress(request.getAddress());
    }

    //  Register a new company
    @Operation(summary = "Register a new  company")
    @PostMapping("/register")
    public CompanyResponseDto registerCompany(@RequestBody CompanyRequestDto dto) {
        return companyService.registerCompany(dto);
    }

    @Operation(summary = "Login company")
    @PostMapping("/login")
    public CompanyResponseDto loginCompany(@RequestBody CompanyLoginRequestDto dto) {
        return companyService.loginCompany(dto);
    }

    // Get company details by ID
    @Operation(summary = "Get company by id")
    @GetMapping("/{companyId}")
    public CompanyResponseDto getCompany(@PathVariable UUID companyId) {
        return companyService.getCompany(companyId);
    }


    // get all company
    @Operation(summary = "Get all companies")
    @GetMapping
    public List<CompanyResponseDto> getAllCompanies() {
        return companyService.getAllCompanies();
    }

    // Update company details
    @Operation(summary = "update a company")
    @PutMapping("/{companyId}")
    public CompanyResponseDto updateCompany(
            @PathVariable UUID companyId,
            @RequestBody CompanyRequestDto updatedCompany
    ) {
        return companyService.updateCompany(companyId, updatedCompany);
    }

    // ---------------- EMPLOYEE ENDPOINTS ----------------

    @Operation(summary = "Get company employees")
    @GetMapping("/{companyId}/employees")
    public List<EmployeeResponseDto> getCompanyEmployees(@PathVariable UUID companyId) {
        return employeeService.getEmployeesByCompanyId(companyId);
    }

    @Operation(summary = "Add company employee")
    @PostMapping("/{companyId}/employees")
    public EmployeeResponseDto addCompanyEmployee(
            @PathVariable UUID companyId,
            @RequestBody EmployeeRequestDto dto
    ) {
        System.out.println("Creating employee for company: " + companyId);
        System.out.println("Employee data: " + dto);
        return employeeService.createEmployeeByCompanyId(companyId, dto);
    }

    @Operation(summary = "Delete company employee")
    @DeleteMapping("/{companyId}/employees/{employeeId}")
    public void deleteCompanyEmployee(
            @PathVariable UUID companyId,
            @PathVariable UUID employeeId
    ) {
        employeeService.deleteEmployeeByCompanyId(companyId, employeeId);
    }
}