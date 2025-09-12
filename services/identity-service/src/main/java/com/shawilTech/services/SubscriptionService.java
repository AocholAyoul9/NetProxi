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
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final CompanyRepository companyRepository;

    /**
     * Subscribe a company to a given plan
     */
    @Transactional
    public Subscription subscribeCompany(UUID companyId, SubscriptionPlan plan) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Deactivate old subscription if exists
        subscriptionRepository.findByCompanyAndActiveTrue(company)
                .ifPresent(oldSub -> {
                    oldSub.setActive(false);
                    subscriptionRepository.save(oldSub);
                });

        // Create new subscription
        Subscription subscription = Subscription.builder()
                .company(company)
                .plan(plan)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusMonths(1))
                .active(true)
                .price(BigDecimal.valueOf(plan.getMonthlyPrice()))
                .build();

        Subscription saved = subscriptionRepository.save(subscription);

        // Update company's active subscription
        company.setActiveSubscription(saved);
        companyRepository.save(company);

        return saved;
    }

    /**
     * Cancel subscription (end immediately)
     */
    @Transactional
    public void cancelSubscription(UUID subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        subscription.setActive(false);
        subscription.setEndDate(LocalDateTime.now());
        subscriptionRepository.save(subscription);

        Company company = subscription.getCompany();
        company.setActiveSubscription(null);
        companyRepository.save(company);
    }

    /**
     * Renew subscription (extend endDate by 1 month)
     */
    @Transactional
    public Subscription renewSubscription(UUID subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        if (!subscription.isActive()) {
            throw new RuntimeException("Cannot renew an inactive subscription");
        }

        subscription.setEndDate(subscription.getEndDate().plusMonths(1));
        return subscriptionRepository.save(subscription);
    }
}
