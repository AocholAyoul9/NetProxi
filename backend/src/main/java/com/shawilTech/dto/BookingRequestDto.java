package com.shawilTech.netproxi.dto;

import com.shawilTech.netproxi.entity.BookingStatus;

import lombok.Data;
import java.util.UUID;
import java.time.*;
import java.math.BigDecimal;

@Data
public class BookingRequestDto {
    private UUID companyId;
    private UUID clientId;
    private UUID employeeId; 
    private UUID serviceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String address;
    private BigDecimal price;
    private BookingStatus status;
}