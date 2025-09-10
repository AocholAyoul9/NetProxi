package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.dto.CompanyRequestDto;
import com.shawilTech.identityservice.dto.CompanyResponseDto;
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

    //  Register a new company
    @PostMapping
    public CompanyResponseDto registerCompany(@RequestBody CompanyRequestDto dto) {
        return companyService.registerCompany(dto);
    }

    // Get company details by ID
    @GetMapping("/{companyId}")
    public CompanyResponseDto getCompany(@PathVariable UUID companyId) {
        return companyService.getCompany(companyId);
    }

    // Update company details
    @PutMapping("/{companyId}")
    public CompanyResponseDto updateCompany(
            @PathVariable UUID companyId,
            @RequestBody Company updatedCompany
    ) {
        return companyService.updateCompany(companyId, updatedCompany);
    }
}
