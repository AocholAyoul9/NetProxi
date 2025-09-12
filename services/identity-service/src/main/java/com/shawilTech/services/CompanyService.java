package com.shawilTech.identityservice.service;

import com.shawilTech.identityservice.entity.*;
import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.repository.CompanyRepository;
import com.shawilTech.identityservice.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final SubscriptionRepository subscriptionRepository;

    /**
     * Register a new company with FREE plan by default
     */
    @Transactional
    public CompanyResponseDto registerCompany(CompanyRequestDto dto) {
        // Build company from DTO
        Company company = Company.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .registrationNumber(dto.getRegistrationNumber())
                .active(true)
                .build();

        Company savedCompany = companyRepository.save(company);

        // Create default FREE subscription
        Subscription freeSubscription = Subscription.builder()
                .company(savedCompany)
                .plan(SubscriptionPlan.FREE)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusMonths(1))
                .active(true)
                .price(BigDecimal.valueOf(SubscriptionPlan.FREE.getMonthlyPrice()))
                .build();

        freeSubscription = subscriptionRepository.save(freeSubscription);

        // Link active subscription to company
        savedCompany.setActiveSubscription(freeSubscription);
        companyRepository.save(savedCompany);

        return CompanyResponseDto.builder()
                .id(savedCompany.getId())
                .name(savedCompany.getName())
                .email(savedCompany.getEmail())
                .phone(savedCompany.getPhone())
                .active(savedCompany.isActive())
                .activePlan(freeSubscription.getPlan())
                .build();
    }

    /**
     * Fetch company by ID
     */
    public CompanyResponseDto getCompany(UUID companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        return CompanyResponseDto.builder()
                .id(company.getId())
                .name(company.getName())
                .email(company.getEmail())
                .phone(company.getPhone())
                .active(company.isActive())
                .activePlan(company.getActiveSubscription() != null
                        ? company.getActiveSubscription().getPlan()
                        : null)
                .build();
    }

    /**
     * Fetch all company
     */
    public List<CompanyResponseDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(company -> CompanyResponseDto.builder()
                        .id(company.getId())
                        .name(company.getName())
                        .email(company.getEmail())
                        .phone(company.getPhone())
                        .active(company.isActive())
                        .activePlan(company.getActiveSubscription() != null
                                ? company.getActiveSubscription().getPlan()
                                : null)
                        .build())
                .toList();
    }


    /**
     * Update company details
     */
    @Transactional
    public CompanyResponseDto updateCompany(UUID companyId, CompanyRequestDto updatedCompany) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        company.setName(updatedCompany.getName());
        company.setAddress(updatedCompany.getAddress());
        company.setEmail(updatedCompany.getEmail());
        company.setPhone(updatedCompany.getPhone());
        company.setRegistrationNumber(updatedCompany.getRegistrationNumber());

        Company saved = companyRepository.save(company);

        return CompanyResponseDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .phone(saved.getPhone())
                .active(saved.isActive())
                .activePlan(saved.getActiveSubscription() != null
                        ? saved.getActiveSubscription().getPlan()
                        : null)
                .build();
    }
}
