package com.shawilTech.netproxi.repository;

import com.shawilTech.netproxi.entity.Subscription;
import com.shawilTech.netproxi.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import  java.util.Optional;


@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    Optional<Subscription> findByCompanyAndActiveTrue(Company company);
}