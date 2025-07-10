package com.shawilTech.identity_service.model;

import  jakarta.persistence.*;
import  lombok.*;

import  java.util.Set;

@Entity
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = ture)
    private  String username;

    private  String email;
    private  String password;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name ="user_roles",
            joinColums = @JoinColumn( name = "user_id"),
            inverseJoinColumns = 

    )
    private  Set<Role> roles;
}