package com.shawilTech.identityservice.repository;

import  com.shawilTech.identityservice.entity.Company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    List<Company> findByActiveTrue();
}
