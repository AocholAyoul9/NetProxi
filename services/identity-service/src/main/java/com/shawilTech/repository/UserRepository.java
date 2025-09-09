package com.shawilTech.identityservice.repository;

import  com.shawilTech.identityservice.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public  interface UserRepository  extends  JpaRepository<User, UUID>{
    Optional<User> findByUsername(String username);
}
