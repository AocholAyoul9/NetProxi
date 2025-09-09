package com.shawilTech.identityservice.repository;

import com.shawilTech.identityservice.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface ServiceRepository extends JpaRepository<Service, UUID> {}