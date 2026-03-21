package com.shawilTech.netproxi.repository;

import  com.shawilTech.netproxi.entity.Company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    List<Company> findByActiveTrue();
    Optional<Company> findByEmail(String email);

}
