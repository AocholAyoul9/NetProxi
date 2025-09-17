package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.entity.Subscription;
import com.shawilTech.identityservice.entity.SubscriptionPlan;
import com.shawilTech.identityservice.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
<<<<<<< HEAD
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
=======

>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
<<<<<<< HEAD
@Tag(name = "Subscriptions", description = "APIs for managing companies subscription to the system")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    // Subscribe a company to a new plan
<<<<<<< HEAD
    @Operation(summary = "Subscribe a company to a new plan")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    @PostMapping("/companies/{companyId}")
    public Subscription subscribeCompany(
            @PathVariable UUID companyId,
            @RequestParam SubscriptionPlan plan) {
        return subscriptionService.subscribeCompany(companyId, plan);
    }

    // Cancel a subscription
<<<<<<< HEAD
    @Operation(summary = "Cancel a subscription")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    @PutMapping("/{subscriptionId}/cancel")
    public void cancelSubscription(@PathVariable UUID subscriptionId) {
        subscriptionService.cancelSubscription(subscriptionId);
    }

    // Renew a subscription
<<<<<<< HEAD
    @Operation(summary = "Renew a subscription")
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
    @PutMapping("/{subscriptionId}/renew")
    public Subscription renewSubscription(@PathVariable UUID subscriptionId) {
        return subscriptionService.renewSubscription(subscriptionId);
    }
}
