package com.shawilTech.booking_service.repository;

import com.shawilTech.booking_service.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public  interface BookingRepository extends  JpaRepository<Booking, Long>{

   List<Booking> findByClientId(UUID clientId);

}