package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.dto.CompanyRequestDto;
import com.shawilTech.identityservice.dto.CompanyResponseDto;
import com.shawilTech.identityservice.entity.Company;
import com.shawilTech.identityservice.service.CompanyService;
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

    //  Register a new company
<<<<<<< HEAD
    @Operation(summary = "Register a new  company")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    @PostMapping
    public CompanyResponseDto registerCompany(@RequestBody CompanyRequestDto dto) {
        return companyService.registerCompany(dto);
    }

    // Get company details by ID
<<<<<<< HEAD
    @Operation(summary = "Get company by id")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    @GetMapping("/{companyId}")
    public CompanyResponseDto getCompany(@PathVariable UUID companyId) {
        return companyService.getCompany(companyId);
    }


    // get all company
<<<<<<< HEAD
=======

>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    @Operation(summary = "Get all companies")
    @GetMapping
    public List<CompanyResponseDto> getAllCompanies() {
        return companyService.getAllCompanies();
    }

    // Update company details
<<<<<<< HEAD
    @Operation(summary = "update a company")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    @PutMapping("/{companyId}")
    public CompanyResponseDto updateCompany(
            @PathVariable UUID companyId,
            @RequestBody CompanyRequestDto updatedCompany
    ) {
        return companyService.updateCompany(companyId, updatedCompany);
    }
}
