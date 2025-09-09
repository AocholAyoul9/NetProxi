package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.entity.Company;
import com.shawilTech.identityservice.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    // Register a new company
    @PostMapping
    public Company registerCompany(@RequestBody Company company) {
        return companyService.registerCompany(company);
    }

    // Get company details by ID
    @GetMapping("/{companyId}")
    public Company getCompany(@PathVariable UUID companyId) {
        return companyService.getCompany(companyId);
    }

    // Update company details
    @PutMapping("/{companyId}")
    public Company updateCompany(@PathVariable UUID companyId, @RequestBody Company updatedCompany) {
        return companyService.updateCompany(companyId, updatedCompany);
    }
}
