package com.shawilTech.identityservice.repository;

import com.shawilTech.identityservice.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, UUID> {}