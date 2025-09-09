package com.shawilTech.identityservice.repository;

import com.shawilTech.identityservice.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    Optional<Subscription> findByCompanyAndActiveTrue(Company company);
}