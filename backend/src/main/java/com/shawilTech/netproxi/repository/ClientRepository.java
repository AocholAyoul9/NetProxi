package com.shawilTech.netproxi.repository;

import com.shawilTech.netproxi.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
 public  interface ClientRepository extends  JpaRepository<Client, UUID>{
 boolean existsByEmail(String email);
 Optional<Client> findByEmail(String email);
}