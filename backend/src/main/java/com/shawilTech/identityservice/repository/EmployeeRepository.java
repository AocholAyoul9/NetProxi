package com.shawilTech.netproxi.repository;

import  com.shawilTech.netproxi.entity.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.*;

@Repository
public  interface EmployeeRepository  extends  JpaRepository<Employee, UUID>{
    Optional<Employee> findByIdAndCompany(UUID id, Company company);
    int countByCompanyAndActiveTrue(Company company);
    List<Employee> findByCompany(Company company);
    Optional<Employee> findByEmail(String email);

}
