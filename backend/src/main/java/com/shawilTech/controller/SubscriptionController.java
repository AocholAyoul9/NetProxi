package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.entity.Subscription;
import com.shawilTech.identityservice.entity.SubscriptionPlan;
import com.shawilTech.identityservice.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscriptions", description = "APIs for managing companies subscription to the system")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    // Subscribe a company to a new plan
    @Operation(summary = "Subscribe a company to a new plan")
    @PostMapping("/companies/{companyId}")
    public Subscription subscribeCompany(
            @PathVariable UUID companyId,
            @RequestParam SubscriptionPlan plan) {
        return subscriptionService.subscribeCompany(companyId, plan);
    }

    // Cancel a subscription
    @Operation(summary = "Cancel a subscription")
    @PutMapping("/{subscriptionId}/cancel")
    public void cancelSubscription(@PathVariable UUID subscriptionId) {
        subscriptionService.cancelSubscription(subscriptionId);
    }

    // Renew a subscription
    @Operation(summary = "Renew a subscription")
    @PutMapping("/{subscriptionId}/renew")
    public Subscription renewSubscription(@PathVariable UUID subscriptionId) {
        return subscriptionService.renewSubscription(subscriptionId);
    }
}
