package com.shawilTech.identityservice.repository;

import com.shawilTech.identityservice.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
 public  interface ClientRepository extends  JpaRepository<Client, UUID>{
<<<<<<< HEAD
 boolean existsByEmail(String email);
=======
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
}