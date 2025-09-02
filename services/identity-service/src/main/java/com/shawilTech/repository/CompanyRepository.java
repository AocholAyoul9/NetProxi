package com.shawilTech.identityservice.repository;

import  com.shawilTech.identityservice.entity.Company;

import org.springframework.data.jpa.repository.JpaRepository;


public interface CompanyRepository extends JpaRepository<Company, Long> {}
