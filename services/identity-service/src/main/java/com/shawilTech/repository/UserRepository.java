package com.shawilTech.identityservice.repository;

import  com.shawilTech.identityservice.entity.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.*;

@Repository
public  interface UserRepository  extends  JpaRepository<User, UUID>{
    Optional<User> findByUsername(String username);
    int countByCompanyAndActiveTrue(Company company);
    List<User> findByCompany(Company company);
}
