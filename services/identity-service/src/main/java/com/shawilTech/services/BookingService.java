package com.shawilTech.identityservice.service;

import com.shawilTech.identityservice.entity.Booking;
import com.shawilTech.identityservice.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateBooking(Long id, Booking booking) {
        return bookingRepository.findById(id).map(existing -> {
            booking.setId(existing.getId());
            return bookingRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
