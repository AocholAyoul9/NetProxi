package com.shawilTech.identityservice.dto;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class BookingResponseDto {
    private UUID id;
    private UUID clientId;
    private String clientName;
    private UUID serviceId;
    private String serviceName;
    private UUID companyId;
    private String companyName;
    private UUID agentId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String address;
    private BigDecimal price;
    private String status;
}