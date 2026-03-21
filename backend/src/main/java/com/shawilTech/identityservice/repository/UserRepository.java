package com.shawilTech.identityservice.repository;

import com.shawilTech.identityservice.entity.Company;
import com.shawilTech.identityservice.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    int countByCompanyAndEnabledTrue(Company company);
}
