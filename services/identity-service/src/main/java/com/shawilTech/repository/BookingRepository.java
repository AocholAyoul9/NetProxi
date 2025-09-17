package com.shawilTech.identityservice.repository;

<<<<<<< HEAD
import com.shawilTech.identityservice.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
=======
import com.shawilTech.identityservice.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
<<<<<<< HEAD
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
=======
    long countByCompanyAndStatus(Company company, BookingStatus status);
}
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
