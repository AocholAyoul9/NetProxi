package com.shawilTech.identityservice.repository;

import  com.shawilTech.identityservice.entity.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.*;

@Repository
public  interface EmployeeRepository  extends  JpaRepository<Employee, UUID>{
    Optional<Employee> findByName(String name);
    int countByCompanyAndActiveTrue(Company company);
    List<Employee> findByCompany(Company company);
}
