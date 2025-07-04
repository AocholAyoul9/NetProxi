package com.shawilTech.booking_service.repository;

import com.shawilTech.booking_service.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
   List<Booking> findByClientId(UUID clientId);
   List<Booking> findByAgentId(UUID agentId);
}
