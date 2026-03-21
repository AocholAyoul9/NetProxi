package com.shawilTech.identityservice.repository;

import com.shawilTech.identityservice.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, UUID> {
    List<ServiceEntity> findByCompanyId(UUID companyId);

    // Add the boolean parameter for active status
    List<ServiceEntity> findByCompanyIdAndActive(UUID companyId, boolean active);

    boolean existsByNameAndCompanyId(String name, UUID companyId);

    // Add this method for counting active services (more efficient than getting the list)
    long countByCompanyIdAndActive(UUID companyId, boolean active);
}