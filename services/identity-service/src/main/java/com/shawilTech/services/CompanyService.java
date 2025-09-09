package com.shawilTech.identityservice.service;

import com.shawilTech.identityservice.entity.Company;
import com.shawilTech.identityservice.entity.Subscription;
import com.shawilTech.identityservice.entity.SubscriptionPlan;
import com.shawilTech.identityservice.repository.CompanyRepository;
import com.shawilTech.identityservice.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public  class CompanyService {

    private final CompanyRepository companyRepository;
    private  final  SubscriptionRepository subscriptionRepository;

    @Transactional
    public Company registerCompany(Company company){

        //save the company first
        company.setActive(true)
        Company savedCompany = companyRepository.save(company);

        //create default free subscrition
        Subscription freeSubscription = Subscription.builder()
                .company(savedCompany)
                .plan(SubscriptionPlan.FREE)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusMonths(1))
                .active(true)
                .price(BigDecimal.valueOf(SubscriptionPlan.FREE.getMonthlyPrice()))
                .build();

        freeSubscription = subscriptionRepository.save(freeSubscription);

        //link active subscription to company

        savedCompany.setActiveSubscription(freeSubscription);
        savedCompany.getSubscriptions.add(freeSubscription);

        return companyRepository.save(savedCompany);
    }

    // Fetch a company by Id

    public  Company getCompany(UUID companyId){
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }

    @Transactional
    public company updateCompany(UUID companyId, Company updatedCompany){
        Company company = companyRepository.findById(companyId);
                          .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setName(updatedCompany.getName());
        company.setAddress(updatedCompany.getAddress());
        company.setEmail(updatedCompany.getEmail());
        company.setPhone(updatedCompany.getPhone());
        company.setRegistrationNumber(updatedCompany.getRegistrationNumber());

        return companyRepository.save(company);
    }
}