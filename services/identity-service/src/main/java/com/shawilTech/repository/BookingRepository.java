package com.shawilTech.identityservice.repository;

import com.shawilTech.identityservice.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    long countByCompanyAndStatus(Company company, BookingStatus status);
}
