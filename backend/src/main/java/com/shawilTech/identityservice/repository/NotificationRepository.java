package com.shawilTech.netproxi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.*;
import com.shawilTech.netproxi.entity.*;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByEmployeeId(UUID employeeId);

    List<Notification> findByEmployeeIdAndReadFalse(UUID employeeId);

    Optional<Notification> findByIdAndEmployeeId(UUID id, UUID employeeId);

    void deleteByEmployeeId(UUID employeeId);
}