
package com.shawilTech.identityservice.repository;

import  com.shawilTech.identityservice.entity.Payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {}