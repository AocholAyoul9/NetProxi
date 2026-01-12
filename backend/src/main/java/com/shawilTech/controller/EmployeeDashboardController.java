package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/companies/employees")
@RequiredArgsConstructor
public class EmployeeDashboardController {

    private final EmployeeService employeeService;

    // === Dashboard Endpoints ===


    //0. empployee login
    @PostMapping("/login")
    public ResponseEntity<EmployeeResponseDto> employeeLogin(
            @RequestBody EmployeeLoginRequestDto loginRequestDto) {
        EmployeeResponseDto responseDto = employeeService.employeeLogin(loginRequestDto);
        return ResponseEntity.ok(responseDto);
    }
    // 1. Get employee profile for dashboard
    @GetMapping("/profile")
    public ResponseEntity<EmployeeProfileResponseDto> getEmployeeProfile(
            @RequestHeader("employeeId") UUID employeeId
    ) {
        EmployeeProfileResponseDto profile = employeeService.getEmployeeProfile(employeeId);
        return ResponseEntity.ok(profile);
    }

    // 2. Update employee profile
    @PatchMapping("/profile")
    public ResponseEntity<EmployeeProfileResponseDto> updateEmployeeProfile(
            @RequestHeader("employeeId") UUID employeeId,
            @RequestBody UpdateEmployeeProfileDto dto) {
        EmployeeProfileResponseDto updatedProfile = employeeService.updateEmployeeProfile(employeeId, dto);
        return ResponseEntity.ok(updatedProfile);
    }

    // 3. Get employee tasks (with filtering)
    @GetMapping("/tasks")
    public ResponseEntity<List<EmployeeTaskResponseDto>> getEmployeeTasks(
            @RequestHeader("employeeId") UUID employeeId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String priority) {
        List<EmployeeTaskResponseDto> tasks = employeeService.getEmployeeTasks(employeeId, status, date, priority);
        return ResponseEntity.ok(tasks);
    }

    // 4. Get today's tasks
    @GetMapping("/tasks/today")
    public ResponseEntity<List<EmployeeTaskResponseDto>> getTodayTasks(
            @RequestHeader("employeeId") UUID employeeId) {
        List<EmployeeTaskResponseDto> tasks = employeeService.getTodayTasks(employeeId);
        return ResponseEntity.ok(tasks);
    }

    // 5. Get upcoming tasks (next 7 days)
    @GetMapping("/tasks/upcoming")
    public ResponseEntity<List<EmployeeTaskResponseDto>> getUpcomingTasks(
            @RequestHeader("employeeId") UUID employeeId) {
        List<EmployeeTaskResponseDto> tasks = employeeService.getUpcomingTasks(employeeId);
        return ResponseEntity.ok(tasks);
    }

    // 6. Get completed tasks
    @GetMapping("/tasks/completed")
    public ResponseEntity<List<EmployeeTaskResponseDto>> getCompletedTasks(
            @RequestHeader("employeeId") UUID employeeId,
            @RequestParam(required = false, defaultValue = "30") int days) {
        List<EmployeeTaskResponseDto> tasks = employeeService.getCompletedTasks(employeeId, days);
        return ResponseEntity.ok(tasks);
    }

    // 7. Update task status
    @PatchMapping("/tasks/{taskId}/status")
    public ResponseEntity<EmployeeTaskResponseDto> updateTaskStatus(
            @RequestHeader("employeeId") UUID employeeId,
            @PathVariable UUID taskId,
            @RequestBody UpdateTaskStatusDto dto) {
        EmployeeTaskResponseDto updatedTask = employeeService.updateTaskStatus(employeeId, taskId, dto);
        return ResponseEntity.ok(updatedTask);
    }

    // 8. Get task details
    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<EmployeeTaskResponseDto> getTaskDetails(
            @RequestHeader("employeeId") UUID employeeId,
            @PathVariable UUID taskId) {
        EmployeeTaskResponseDto task = employeeService.getTaskDetails(employeeId, taskId);
        return ResponseEntity.ok(task);
    }

    // 9. Get notifications
    @GetMapping("/notifications")
    public ResponseEntity<List<EmployeeNotificationResponseDto>> getNotifications(
            @RequestHeader("employeeId") UUID employeeId,
            @RequestParam(required = false, defaultValue = "false") boolean unreadOnly) {
        List<EmployeeNotificationResponseDto> notifications = employeeService.getNotifications(employeeId, unreadOnly);
        return ResponseEntity.ok(notifications);
    }

    // 10. Mark notification as read
    @PatchMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(
            @RequestHeader("employeeId") UUID employeeId,
            @PathVariable UUID notificationId) {
        employeeService.markNotificationAsRead(employeeId, notificationId);
        return ResponseEntity.ok().build();
    }

    // 11. Mark all notifications as read
    @PostMapping("/notifications/mark-all-read")
    public ResponseEntity<Void> markAllNotificationsAsRead(
            @RequestHeader("employeeId") UUID employeeId) {
        employeeService.markAllNotificationsAsRead(employeeId);
        return ResponseEntity.ok().build();
    }

    // 12. Clear all notifications
    @DeleteMapping("/notifications")
    public ResponseEntity<Void> clearAllNotifications(
            @RequestHeader("employeeId") UUID employeeId) {
        employeeService.clearAllNotifications(employeeId);
        return ResponseEntity.ok().build();
    }

    // 13. Get employee statistics
    @GetMapping("/stats")
    public ResponseEntity<EmployeeStatsResponseDto> getEmployeeStats(
            @RequestHeader("employeeId") UUID employeeId,
            @RequestParam(required = false, defaultValue = "monthly") String period) {
        EmployeeStatsResponseDto stats = employeeService.getEmployeeStats(employeeId, period);
        return ResponseEntity.ok(stats);
    }

    // 14. Get employee schedule
    @GetMapping("/schedule")
    public ResponseEntity<List<EmployeeScheduleResponseDto>> getEmployeeSchedule(
            @RequestHeader("employeeId") UUID employeeId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<EmployeeScheduleResponseDto> schedule = employeeService.getEmployeeSchedule(employeeId, startDate, endDate);
        return ResponseEntity.ok(schedule);
    }

    // 15. Update availability status
    @PatchMapping("/availability")
    public ResponseEntity<Void> updateAvailability(
            @RequestHeader("employeeId") UUID employeeId,
            @RequestBody UpdateAvailabilityDto dto) {
        employeeService.updateAvailability(employeeId, dto);
        return ResponseEntity.ok().build();
    }
}