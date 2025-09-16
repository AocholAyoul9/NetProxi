package com.shawilTech.identityservice.repository;

import com.shawilTech.identityservice.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByClientId(UUID clientId);
    List<Booking> findByCompanyId(UUID companyId);
    List<Booking> findByServiceId(UUID serviceId);
    boolean existsByClientIdAndStartTimeBetween(UUID clientId, LocalDateTime start, LocalDateTime end);
    boolean existsByClientIdAndStartTimeLessThanAndEndTimeGreaterThan(
            UUID clientId,
            LocalDateTime endTime,
            LocalDateTime startTime
    );
    List<Booking> findByClientIdAndCompanyId(UUID clientId, UUID companyId);
}