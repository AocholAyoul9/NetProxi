package com.shawilTech.identityservice.service;

import com.shawilTech.identityservice.entity.*;
import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.shawilTech.identityservice.service.GeocodingService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final SubscriptionRepository subscriptionRepository;
    private  final ServiceRepository serviceRepository;
    private final GeocodingService geocodingService; // <-- Add this


    /**
     * Find companies near a point (lat, lng) within radius in km
     */

    public List<CompanyResponseDto> findNearbyCompanies(double lat, double lng, double radiusKm) {
        List<Company> activeCompanies = companyRepository.findByActiveTrue();

        return activeCompanies.stream()
                .filter(c -> c.getLatitude() != null && c.getLongitude() != null)
                .filter(c -> distance(lat, lng, c.getLatitude(), c.getLongitude()) <= radiusKm)
                .map(c -> CompanyResponseDto.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .email(c.getEmail())
                        .phone(c.getPhone())
                        .address(c.getAddress())
                        .active(c.isActive())
                        .logoUrl(c.getLogoUrl())
                        .website(c.getWebsite())
                        .description(c.getDescription())
                        .latitude(c.getLatitude())
                        .longitude(c.getLongitude())
                        .distance(distance(lat, lng, c.getLatitude(), c.getLongitude()))
                        .openingHours(c.getOpeningHours())

                        .build())
                .toList();

    }

    private double distance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_KM = 6371;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }



    private CompanyResponseDto mapToDto(Company company) {
        return CompanyResponseDto.builder()
                .id(company.getId())
                .name(company.getName())
                .address(company.getAddress())
                .latitude(company.getLatitude())
                .longitude(company.getLongitude())
                .active(company.isActive())
                .build();
    }
    /**
     * Register a new company with FREE plan by default
     */
    @Transactional
    public CompanyResponseDto registerCompany(CompanyRequestDto dto) {
        // Build company from DTO
        Company company = Company.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .logoUrl(dto.getLogoUrl())
                .website(dto.getWebsite())
                .description(dto.getDescription())
                .pricing(dto.getPricing())
                .openingHours(dto.getOpeningHours())
                .active(true)
                .build();

        Company savedCompany = companyRepository.save(company);

        // Create default FREE subscription
        Subscription freeSubscription = Subscription.builder()
                .company(savedCompany)
                .plan(SubscriptionPlan.FREE)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusMonths(1))
                .active(true)
                .price(BigDecimal.valueOf(SubscriptionPlan.FREE.getMonthlyPrice()))
                .build();

        freeSubscription = subscriptionRepository.save(freeSubscription);

        // Link active subscription to company
        savedCompany.setActiveSubscription(freeSubscription);
        companyRepository.save(savedCompany);

        return CompanyResponseDto.builder()
                .id(savedCompany.getId())
                .name(savedCompany.getName())
                .address(savedCompany.getAddress())
                .email(savedCompany.getEmail())
                .phone(savedCompany.getPhone())
                .active(savedCompany.isActive())
                .activePlan(freeSubscription.getPlan() != null ? freeSubscription.getPlan().name() : null)
                .latitude(savedCompany.getLatitude())
                .longitude(savedCompany.getLongitude())
                .logoUrl(savedCompany.getLogoUrl())
                .website(savedCompany.getWebsite())
                .description(savedCompany.getDescription())
                .pricing(savedCompany.getPricing())
                .build();
    }

    /**
     * Fetch company by ID
     */
    public CompanyResponseDto getCompany(UUID companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        return CompanyResponseDto.builder()
                .id(company.getId())
                .name(company.getName())
                .address(company.getAddress())
                .email(company.getEmail())
                .phone(company.getPhone())
                .logoUrl(company.getLogoUrl())
                .website(company.getWebsite())
                .description(company.getDescription())
                .active(company.isActive())
                .activePlan(company.getActiveSubscription() != null
                        ? company.getActiveSubscription().getPlan().name()
                        : null)
                .build();
    }

    /**
     * Fetch all company
     */
    public List<CompanyResponseDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(company -> CompanyResponseDto.builder()
                        .id(company.getId())
                        .name(company.getName())
                        .address(company.getAddress())
                        .email(company.getEmail())
                        .phone(company.getPhone())
                        .logoUrl(company.getLogoUrl())
                        .website(company.getWebsite())
                        .description(company.getDescription())
                        .pricing(company.getPricing())
                        .active(company.isActive())
                        .activePlan(company.getActiveSubscription() != null
                                ? company.getActiveSubscription().getPlan().name()
                                : null)
                        .build())
                .toList();
    }


    /**
     * Update company details
     */
    @Transactional
    public CompanyResponseDto updateCompany(UUID companyId, CompanyRequestDto updatedCompany) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        company.setName(updatedCompany.getName());
        company.setAddress(updatedCompany.getAddress());
        company.setEmail(updatedCompany.getEmail());
        company.setPhone(updatedCompany.getPhone());

        Company saved = companyRepository.save(company);

        return CompanyResponseDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .address(saved.getAddress())
                .email(saved.getEmail())
                .phone(saved.getPhone())
                .active(saved.isActive())
                .activePlan(saved.getActiveSubscription() != null
                        ? saved.getActiveSubscription().getPlan().name()
                        : null)
                .build();
    }

    /**
     * create new cleaning service for  a company
     */

    @Transactional
    public ServiceResponseDto createService(ServiceRequestDto dto) {
        // Validate company exists
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if service with same name already exists for this company
        if (serviceRepository.existsByNameAndCompanyId(dto.getName(), dto.getCompanyId())) {
            throw new RuntimeException("Service with this name already exists for this company");
        }

        // Check subscription plan limitations
        checkServiceCreationLimits(company);

        // Create service
        ServiceEntity service = ServiceEntity.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .basePrice(dto.getBasePrice())
                .durationInMinutes(dto.getDurationInMinutes())
                .company(company)
                .active(true)
                .build();

        ServiceEntity savedService = serviceRepository.save(service);

        return mapToServiceResponseDto(savedService);
    }

    /**
     * Get all services for a company
     */
    public List<ServiceResponseDto> getCompanyServices(UUID companyId) {
        // Validate company exists
        if (!companyRepository.existsById(companyId)) {
            throw new RuntimeException("Company not found");
        }

        return serviceRepository.findByCompanyIdAndActive(companyId, true)
                .stream()
                .map(this::mapToServiceResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific service by ID
     */
    public ServiceResponseDto getService(UUID serviceId) {
        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        return mapToServiceResponseDto(service);
    }

    /**
     * Update a service
     */
    @Transactional
    public ServiceResponseDto updateService(UUID serviceId, ServiceRequestDto dto) {
        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Check if name is being changed and if it conflicts with existing service
        if (!service.getName().equals(dto.getName()) &&
                serviceRepository.existsByNameAndCompanyId(dto.getName(), service.getCompany().getId())) {
            throw new RuntimeException("Service with this name already exists for this company");
        }

        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setBasePrice(dto.getBasePrice());
        service.setDurationInMinutes(dto.getDurationInMinutes());

        ServiceEntity updatedService = serviceRepository.save(service);

        return mapToServiceResponseDto(updatedService);
    }

    /**
     * Deactivate a service (soft delete)
     */
    @Transactional
    public void deactivateService(UUID serviceId) {
        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setActive(false);
        serviceRepository.save(service);
    }

    /**
     * Check subscription plan limitations for service creation
     */
    private void checkServiceCreationLimits(Company company) {
        Subscription activeSubscription = company.getActiveSubscription();
        if (activeSubscription == null) {
            throw new RuntimeException("Company has no active subscription");
        }

        long activeServiceCount = serviceRepository.countByCompanyIdAndActive(company.getId(), true);

        switch (activeSubscription.getPlan()) {
            case FREE:
                if (activeServiceCount >= 3) {
                    throw new RuntimeException("FREE plan allows maximum 3 services. Upgrade to create more.");
                }
                break;
            case BASIC:
                if (activeServiceCount >= 10) {
                    throw new RuntimeException("BASIC plan allows maximum 10 services. Upgrade to create more.");
                }
                break;
            case PREMIUM:
                // Premium has no service limit
                break;
        }
    }

    /**
     * Map ServiceEntity to ServiceResponseDto
     */
    private ServiceResponseDto mapToServiceResponseDto(ServiceEntity service) {
        return ServiceResponseDto.builder()
                .id(service.getId())
                .name(service.getName())
                .description(service.getDescription())
                .basePrice(service.getBasePrice())
                .durationInMinutes(service.getDurationInMinutes())
                .companyId(service.getCompany().getId())
                .companyName(service.getCompany().getName())
                .active(service.isActive())
                .build();
    }
}
