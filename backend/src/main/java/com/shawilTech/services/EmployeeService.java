package com.shawilTech.identityservice.service;
import com.shawilTech.identityservice.security.JwtTokenProvider;
import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.entity.*;
import com.shawilTech.identityservice.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final BookingRepository bookingRepository;
    private final NotificationRepository notificationRepository;
    private final JwtTokenProvider jwtProvider;

    // ---------------- BASIC CRUD ----------------

    @Transactional
    public EmployeeResponseDto createEmployee(EmployeeRequestDto dto, UUID companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Subscription subscription = subscriptionRepository.findByCompanyAndActiveTrue(company)
                .orElseThrow(() -> new RuntimeException("No active subscription found"));

        Employee employee = Employee.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .company(company)
                .active(true)
                .build();

        return toResponseDto(employeeRepository.save(employee));
    }

    
    public EmployeeResponseDto employeeLogin(EmployeeLoginRequestDto dto) {
        Employee employee = employeeRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!employee.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }


         String token = jwtProvider.generateToken(dto.getEmail());
        employee.setToken(token);

        employeeRepository.save(employee);

        return toResponseDto(employee);
    }

    
    @Transactional(readOnly = true)
    public List<EmployeeResponseDto> getEmployeesByCompany(UUID companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        return employeeRepository.findByCompany(company)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeResponseDto getEmployeeById(UUID companyId, UUID employeeId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Employee employee = employeeRepository.findByIdAndCompany(employeeId, company)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return toResponseDto(employee);
    }

    @Transactional
    public EmployeeResponseDto updateEmployee(UUID companyId, UUID employeeId, EmployeeRequestDto dto) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Employee employee = employeeRepository.findByIdAndCompany(employeeId, company)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setAddress(dto.getAddress());

        return toResponseDto(employeeRepository.save(employee));
    }

    @Transactional
    public void deleteEmployee(UUID companyId, UUID employeeId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Employee employee = employeeRepository.findByIdAndCompany(employeeId, company)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employeeRepository.delete(employee);
    }

    // ---------------- PROFILE ----------------

    @Transactional(readOnly = true)
    public EmployeeProfileResponseDto getEmployeeProfile(UUID employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<Booking> tasks = bookingRepository.findByEmployeeId(employeeId);

        long completed = tasks.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();

        long pending = tasks.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING || b.getStatus() == BookingStatus.CONFIRMED)
                .count();

        double avgRating = tasks.stream()
                .filter(b -> b.getRating() != null)
                .mapToInt(Booking::getRating)
                .average()
                .orElse(0);

        return EmployeeProfileResponseDto.builder()
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .companyId(employee.getCompany().getId())
                .companyName(employee.getCompany().getName())
                .totalTasks(tasks.size())
                .completedTasks((int) completed)
                .pendingTasks((int) pending)
                .averageRating(avgRating)
                .isAvailable(employee.isAvailable())
                .joinDate(employee.getCreatedAt().toLocalDate().toString())
                .build();
    }

    @Transactional
    public EmployeeProfileResponseDto updateEmployeeProfile(UUID employeeId, UpdateEmployeeProfileDto dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (dto.getName() != null) employee.setName(dto.getName());
        if (dto.getPhone() != null) employee.setPhone(dto.getPhone());
        if (dto.getAvatarUrl() != null) employee.setAvatarUrl(dto.getAvatarUrl());
        if (dto.getSkills() != null) employee.setSkills(dto.getSkills());
        if (dto.getIsAvailable() != null) employee.setAvailable(dto.getIsAvailable());

        employeeRepository.save(employee);
        return getEmployeeProfile(employeeId);
    }

    // ---------------- TASKS ----------------

    @Transactional(readOnly = true)
    public EmployeeTaskResponseDto getTaskDetails(UUID employeeId, UUID taskId) {
        Booking booking = bookingRepository.findByIdAndEmployeeId(taskId, employeeId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return convertToTaskDto(booking);
    }

    @Transactional(readOnly = true)
    public List<EmployeeTaskResponseDto> getEmployeeTasks(UUID employeeId, String status, String date, String priority) {
        return bookingRepository.findByEmployeeId(employeeId).stream()
                .filter(b -> status == null || b.getStatus().name().equals(status))
                .filter(b -> date == null || isSameDate(b.getStartTime(), date))
                .filter(b -> priority == null || priority.equals(b.getPriority()))
                .map(this::convertToTaskDto)
                .sorted(Comparator.comparing(EmployeeTaskResponseDto::getStartTime))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeTaskResponseDto> getTodayTasks(UUID employeeId) {
        LocalDate today = LocalDate.now();
        return bookingRepository.findByEmployeeIdAndDate(employeeId, today).stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED && b.getStatus() != BookingStatus.COMPLETED)
                .map(this::convertToTaskDto)
                .sorted(Comparator.comparing(EmployeeTaskResponseDto::getStartTime))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeTaskResponseDto> getUpcomingTasks(UUID employeeId) {
        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);

        return bookingRepository.findByEmployeeIdAndDateRange(employeeId, today, nextWeek).stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED && b.getStatus() != BookingStatus.COMPLETED)
                .map(this::convertToTaskDto)
                .sorted(Comparator.comparing(EmployeeTaskResponseDto::getStartTime))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeTaskResponseDto> getCompletedTasks(UUID employeeId, int days) {
        LocalDate since = LocalDate.now().minusDays(days);

        return bookingRepository.findCompletedTasksByEmployeeSince(employeeId, since).stream()
                .map(this::convertToTaskDto)
                .sorted(Comparator.comparing(EmployeeTaskResponseDto::getEndTime).reversed())
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeTaskResponseDto updateTaskStatus(UUID employeeId, UUID taskId, UpdateTaskStatusDto dto) {
        Booking booking = bookingRepository.findByIdAndEmployeeId(taskId, employeeId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        booking.setStatus(BookingStatus.valueOf(dto.getStatus()));


        if (dto.getStartTime() != null)
            booking.setActualStartTime(LocalDateTime.parse(dto.getStartTime()));

        if (dto.getEndTime() != null)
            booking.setActualEndTime(LocalDateTime.parse(dto.getEndTime()));

        if (dto.getNotes() != null)
            booking.setEmployeeNotes(dto.getNotes());

        Booking updated = bookingRepository.save(booking);
        createStatusChangeNotification(employeeId, updated);
        return convertToTaskDto(updated);
    }


    // 13. Get employee statistics
    @Transactional(readOnly = true)
    public EmployeeStatsResponseDto getEmployeeStats(UUID employeeId, String period) {
        LocalDate startDate = getStartDateForPeriod(period);

        List<Booking> periodTasks = bookingRepository.findByEmployeeIdAndDateAfter(employeeId, startDate);

        long completed = periodTasks.stream().filter(b -> "COMPLETED".equals(b.getStatus())).count();
        long inProgress = periodTasks.stream().filter(b -> "IN_PROGRESS".equals(b.getStatus())).count();
        long pending = periodTasks.stream().filter(b -> "PENDING".equals(b.getStatus())).count();

        double avgRating = periodTasks.stream()
                .filter(b -> b.getRating() != null)
                .mapToInt(Booking::getRating)
                .average()
                .orElse(0.0);

        double totalEarnings = periodTasks.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()) && b.getService() != null)
                .mapToDouble(b -> b.getService().getBasePrice())
                .sum();

        return EmployeeStatsResponseDto.builder()
                .totalTasks(periodTasks.size())
                .completedTasks((int) completed)
                .inProgressTasks((int) inProgress)
                .pendingTasks((int) pending)
                .completionRate(periodTasks.isEmpty() ? 0 : (int) ((completed * 100) / periodTasks.size()))
                .averageRating(avgRating)
                .totalEarnings(totalEarnings)
                .period(period)
                .build();
    }


    // 14. Get employee schedule
    @Transactional(readOnly = true)
    public List<EmployeeScheduleResponseDto> getEmployeeSchedule(UUID employeeId, String startDateStr, String endDateStr) {
        LocalDate startDate = startDateStr != null ? LocalDate.parse(startDateStr) : LocalDate.now();
        LocalDate endDate = endDateStr != null ? LocalDate.parse(endDateStr) : startDate.plusDays(30);

        List<Booking> bookings = bookingRepository.findByEmployeeIdAndDateRange(employeeId, startDate, endDate);

        return bookings.stream()
                .map(this::convertToScheduleDto)
                .collect(Collectors.toList());
    }

    // 15. Update availability
    @Transactional
    public void updateAvailability(UUID employeeId, UpdateAvailabilityDto dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        employee.setAvailable(dto.getIsAvailable());
        employeeRepository.save(employee);
    }
    // ---------------- NOTIFICATIONS ----------------

    @Transactional(readOnly = true)
    public List<EmployeeNotificationResponseDto> getNotifications(UUID employeeId, boolean unreadOnly) {
        return notificationRepository.findByEmployeeId(employeeId).stream()
                .filter(n -> !unreadOnly || !n.isRead())
                .map(this::convertToNotificationDto)
                .sorted(Comparator.comparing(EmployeeNotificationResponseDto::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    @Transactional
    public void markNotificationAsRead(UUID employeeId, UUID notificationId) {
        Notification notification = notificationRepository
                .findByIdAndEmployeeId(notificationId, employeeId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllNotificationsAsRead(UUID employeeId) {
        List<Notification> notifications = notificationRepository.findByEmployeeIdAndReadFalse(employeeId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void clearAllNotifications(UUID employeeId) {
        notificationRepository.deleteByEmployeeId(employeeId);
    }

    // ---------------- HELPERS ----------------
    private LocalDate getStartDateForPeriod(String period) {
        return switch (period.toLowerCase()) {
            case "weekly" -> LocalDate.now().minusWeeks(1);
            case "monthly" -> LocalDate.now().minusMonths(1);
            case "yearly" -> LocalDate.now().minusYears(1);
            default -> LocalDate.now().minusMonths(1); // default monthly
        };
    }
    private EmployeeResponseDto toResponseDto(Employee emp) {
        return EmployeeResponseDto.builder()
                .id(emp.getId())
                .name(emp.getName())
                .email(emp.getEmail())
                .phone(emp.getPhone())
                .address(emp.getAddress())
                .active(emp.isActive())
                .build();
    }
    private EmployeeScheduleResponseDto convertToScheduleDto(Booking booking) {
        return EmployeeScheduleResponseDto.builder()
                .id(booking.getId())
                .date(booking.getStartTime().toLocalDate().toString())
                .startTime(booking.getStartTime().toLocalTime().toString())
                .endTime(booking.getEndTime().toLocalTime().toString())
                .serviceName(booking.getService() != null ? booking.getService().getName() : "Unknown")
                .clientName(booking.getClient() != null ? booking.getClient().getName() : "Unknown")
                .address(booking.getAddress())
                .build();
    }
    private EmployeeTaskResponseDto convertToTaskDto(Booking booking) {
        return EmployeeTaskResponseDto.builder()
                .id(booking.getId())
                .serviceName(booking.getService() != null ? booking.getService().getName() : "Unknown")
                .price(booking.getService() != null ? booking.getService().getBasePrice() : 0.0)
                .status(booking.getStatus().name())
                .startTime(booking.getStartTime().toString())
                .endTime(booking.getEndTime() != null ? booking.getEndTime().toString() : null)
                .build();
    }

    private EmployeeNotificationResponseDto convertToNotificationDto(Notification n) {
        return EmployeeNotificationResponseDto.builder()
                .id(n.getId())
                .employeeId(n.getEmployee().getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .read(n.isRead())
                .createdAt(n.getCreatedAt().toString())
                .actionUrl(n.getActionUrl())
                .build();
    }

    private boolean isSameDate(LocalDateTime dateTime, String dateStr) {
        return dateTime.toLocalDate().equals(LocalDate.parse(dateStr));
    }

    private void createStatusChangeNotification(UUID employeeId, Booking booking) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Notification notification = Notification.builder()
                .employee(employee)
                .title("Task status updated")
                .message("Task status changed to " + booking.getStatus())
                .type("TASK_UPDATED")
                .isRead(false)
                .metadata("{\"taskId\":\"" + booking.getId() + "\"}")
                .actionUrl("/employee/tasks/" + booking.getId())
                .build();

        notificationRepository.save(notification);
    }
}
