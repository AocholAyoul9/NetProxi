package com.shawilTech.identityservice.dto;
import  com.shawilTech.identityservice.entity.BookingStatus;

import  lombok.Data;
import  java.util.UUID;
import java.time.*;
import java.math.BigDecimal;

@Data
public class BookingRequestDto {
    private UUID companyId;
    private UUID clientId;
    private UUID agentId;
    private UUID serviceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String address;
    private BigDecimal price;
    private BookingStatus status;
}