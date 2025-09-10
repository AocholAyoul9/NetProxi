package com.shawilTech.identityservice.service;

import com.shawilTech.identityservice.entity.*;
import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.repository.*;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
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
