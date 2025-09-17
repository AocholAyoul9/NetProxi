package com.shawilTech.identityservice.service;

<<<<<<< HEAD
import com.shawilTech.identityservice.dto.BookingRequestDto;
import com.shawilTech.identityservice.dto.BookingResponseDto;
import com.shawilTech.identityservice.entity.*;
import com.shawilTech.identityservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
=======
import com.shawilTech.identityservice.entity.*;
import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.repository.*;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
<<<<<<< HEAD
    private final ClientRepository clientRepository;
    private final ServiceRepository serviceRepository;
    private final CompanyRepository companyRepository;

    /**
     * Create a new booking for a client
     */
    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto request) {
        // Validate client exists
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + request.getClientId()));

        // Validate service exists
        ServiceEntity service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + request.getServiceId()));

        // Validate company exists
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + request.getCompanyId()));

        // Validate that the service belongs to the specified company
        if (!service.getCompany().getId().equals(request.getCompanyId())) {
            throw new RuntimeException("Service does not belong to the specified company");
        }

        // Check for booking time conflicts
        LocalDateTime endTime = request.getStartTime().plusMinutes(service.getDurationInMinutes());


        boolean hasConflict = bookingRepository.existsByClientIdAndStartTimeLessThanAndEndTimeGreaterThan(
                request.getClientId(),
                endTime,
                request.getStartTime()
        );


       /* if (hasConflict) {
            throw new RuntimeException("Client has a conflicting booking at the requested time");
        }*/

        // Check if service is active
        if (!service.isActive()) {
            throw new RuntimeException("Service is not active and cannot be booked");
        }

        // Check if company is active
        if (!company.isActive()) {
            throw new RuntimeException("Company is not active and cannot accept bookings");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setClient(client);
        booking.setService(service);
        booking.setCompany(company);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(endTime);
        booking.setAddress(request.getAddress());
        booking.setPrice(request.getPrice() != null ? request.getPrice() : BigDecimal.valueOf(service.getBasePrice()));
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        return mapToBookingResponseDto(savedBooking);
    }

    /**
     * Get all bookings for a client
     */
    public List<BookingResponseDto> getClientBookings(UUID clientId) {
        if (!clientRepository.existsById(clientId)) {
            throw new RuntimeException("Client not found with ID: " + clientId);
        }

        return bookingRepository.findByClientId(clientId)
                .stream()
                .map(this::mapToBookingResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all bookings for a company
     */
    public List<BookingResponseDto> getCompanyBookings(UUID companyId) {
        if (!companyRepository.existsById(companyId)) {
            throw new RuntimeException("Company not found with ID: " + companyId);
        }

        return bookingRepository.findByCompanyId(companyId)
                .stream()
                .map(this::mapToBookingResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get client's bookings for a specific company
     */
    public List<BookingResponseDto> getClientBookingsForCompany(UUID clientId, UUID companyId) {
        if (!clientRepository.existsById(clientId)) {
            throw new RuntimeException("Client not found with ID: " + clientId);
        }
        if (!companyRepository.existsById(companyId)) {
            throw new RuntimeException("Company not found with ID: " + companyId);
        }

        return bookingRepository.findByClientIdAndCompanyId(clientId, companyId)
                .stream()
                .map(this::mapToBookingResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get booking by ID
     */
    public BookingResponseDto getBooking(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        return mapToBookingResponseDto(booking);
    }

    /**
     * Update booking status
     */
    @Transactional
    public BookingResponseDto updateBookingStatus(UUID bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        booking.setStatus(status);
        Booking updatedBooking = bookingRepository.save(booking);

        return mapToBookingResponseDto(updatedBooking);
    }

    /**
     * Cancel a booking
     */
    @Transactional
    public BookingResponseDto cancelBooking(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        // Check if booking can be cancelled (only pending or confirmed bookings can be cancelled)
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking cancelledBooking = bookingRepository.save(booking);

        return mapToBookingResponseDto(cancelledBooking);
    }

    /**
     * Map Booking entity to BookingResponseDto
     */
    private BookingResponseDto mapToBookingResponseDto(Booking booking) {
        return BookingResponseDto.builder()
                .id(booking.getId())
                .clientId(booking.getClient().getId())
                .clientName(booking.getClient().getName())
                .serviceId(booking.getService().getId())
                .serviceName(booking.getService().getName())
                .companyId(booking.getCompany().getId())
                .companyName(booking.getCompany().getName())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .address(booking.getAddress())
                .price(booking.getPrice())
                .status(booking.getStatus().name())
                .build();
    }
}
=======
    private  final  CompanyRepository companyRepository;
    private final  SubscriptionRepository subscriptionRepository;
    private  final  ClientRepository clientRepository;
    private  final  ServiceRepository serviceRepository;

    public Booking createBooking(BookingRequest request, UUID companyId) {

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Subscription subscription = subscriptionRepository.findByCompanyAndActiveTrue(company)
                .orElseThrow(() -> new RuntimeException("No active subscription found"));

        long activeBookings = bookingRepository.countByCompanyAndStatus(company, BookingStatus.ACTIVE);
        if (activeBookings >= subscription.getPlan().getMaxActiveBookings()) {
            throw new RuntimeException("Booking limit reached for your subscription plan");
        }

        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        ServiceEntity service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        Booking booking = new Booking();
        booking.setCompany(company);
        booking.setClient(client);
        booking.setAgentId(request.getAgentId());
        booking.setService(service);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setAddress(request.getAddress());
        booking.setPrice(request.getPrice());
        booking.setStatus(BookingStatus.ACTIVE);

        return bookingRepository.save(booking);
    }


    public Optional<Booking> getBookingById(UUID id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateBooking(UUID id, Booking booking) {
        return bookingRepository.findById(id).map(existing -> {
            booking.setId(existing.getId());
            return bookingRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    ///updating booking status
    public Booking updateStatus(UUID bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
    public void deleteBooking(UUID id) {
        bookingRepository.deleteById(id);
    }
}
>>>>>>> e1569dad99b65bbab55031cbcec49d91d2dcfd09
