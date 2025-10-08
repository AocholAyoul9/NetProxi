package com.shawilTech.identityservice.entity;
import jakarta.persistence.*;
import lombok.*;


import lombok.Getter;
import java.math.BigDecimal;

@Getter
public  enum SubscriptionPlan {
    FREE(0, 1, 10), // free, 1 employee , 10 bookings
    BASIC(49.99, 5, 10), // $49,99/month, 5 employees, 100 booking
    PREMIUM(99.9, 20, 500),
    ENTERPRISE(249.99, 100, Integer.MAX_VALUE);

    private  final double monthlyPrice;
    private  final int maxEmployee;
    private  final int maxActiveBookings;

    SubscriptionPlan(double monthlyPrice, int maxEmployee, int maxActiveBookings) {
        this.monthlyPrice = monthlyPrice;
        this.maxEmployee = maxEmployee;
        this.maxActiveBookings = maxActiveBookings;
    }
}