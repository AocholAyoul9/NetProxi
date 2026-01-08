package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.dto.EmployeeRequestDto;
import com.shawilTech.identityservice.dto.EmployeeResponseDto;
import com.shawilTech.identityservice.entity.Employee;
import com.shawilTech.identityservice.service.EmployeeService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/companies/{companyId}/employees")
@RequiredArgsConstructor
@Tag(name = "Employees", description = "APIs for managing Employees")
public class EmployeeController {

    private  final  EmployeeService employeeService;

    @Operation(summary = "Register Employee")
    @PostMapping
    public  EmployeeResponseDto createEmployee(@PathVariable UUID companyId, @RequestBody EmployeeRequestDto dto){

        return  employeeService.createEmployee(dto, companyId);

    }
    // get all employees
    @Operation(summary = "get all  Employee from spicific company")
    @GetMapping
    public List<EmployeeResponseDto> getEmployees(@PathVariable UUID companyId){
        return  employeeService.getEmployeesByCompany(companyId);
    }

    //get single employee
    @Operation(summary = "get   Employee By Id")
    @GetMapping("/{employeeId}")
    public EmployeeResponseDto getEmployeesById(@PathVariable UUID companyId, @PathVariable UUID employeeId){
        return employeeService.getEmployeeById(companyId, employeeId);
    }

    @PutMapping("/{employeeId}")
    public EmployeeResponseDto updateEmployee(
            @PathVariable UUID companyId,
            @PathVariable UUID employeeId,
            @RequestBody EmployeeRequestDto dto
    ){
        return employeeService.updateEmployee(companyId,employeeId, dto);
    }

    @DeleteMapping("/{employeeId}")
    public void  deleteEmployee(
            @PathVariable UUID companyId,
            @PathVariable UUID employeeId)
    {
        employeeService.deleteEmployee(companyId, employeeId);
    }

    /* 
     // === Dashboard Endpoints ===

    // 1. Get employee profile for dashboard
    @GetMapping("/profile")
    public ResponseEntity<EmployeeProfileResponseDto> getEmployeeProfile() {
        UUID employeeId = getCurrentEmployeeId();
        EmployeeProfileResponseDto profile = employeeDashboardService.getEmployeeProfile(employeeId);
        return ResponseEntity.ok(profile);
    }

    // 2. Update employee profile
    @PatchMapping("/profile")
    public ResponseEntity<EmployeeProfileResponseDto> updateEmployeeProfile(
            @RequestBody UpdateEmployeeProfileDto dto) {
        UUID employeeId = getCurrentEmployeeId();
        EmployeeProfileResponseDto updatedProfile = employeeDashboardService.updateEmployeeProfile(employeeId, dto);
        return ResponseEntity.ok(updatedProfile);
    }

    // 3. Get employee tasks (with filtering)
    @GetMapping("/tasks")
    public ResponseEntity<List<EmployeeTaskResponseDto>> getEmployeeTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String priority) {
        UUID employeeId = getCurrentEmployeeId();
        List<EmployeeTaskResponseDto> tasks = employeeDashboardService.getEmployeeTasks(employeeId, status, date, priority);
        return ResponseEntity.ok(tasks);
    }

    // 4. Get today's tasks
    @GetMapping("/tasks/today")
    public ResponseEntity<List<EmployeeTaskResponseDto>> getTodayTasks() {
        UUID employeeId = getCurrentEmployeeId();
        List<EmployeeTaskResponseDto> tasks = employeeDashboardService.getTodayTasks(employeeId);
        return ResponseEntity.ok(tasks);
    }

    // 5. Get upcoming tasks (next 7 days)
    @GetMapping("/tasks/upcoming")
    public ResponseEntity<List<EmployeeTaskResponseDto>> getUpcomingTasks() {
        UUID employeeId = getCurrentEmployeeId();
        List<EmployeeTaskResponseDto> tasks = employeeDashboardService.getUpcomingTasks(employeeId);
        return ResponseEntity.ok(tasks);
    }

    // 6. Get completed tasks
    @GetMapping("/tasks/completed")
    public ResponseEntity<List<EmployeeTaskResponseDto>> getCompletedTasks(
            @RequestParam(required = false, defaultValue = "30") int days) {
        UUID employeeId = getCurrentEmployeeId();
        List<EmployeeTaskResponseDto> tasks = employeeDashboardService.getCompletedTasks(employeeId, days);
        return ResponseEntity.ok(tasks);
    }

    // 7. Update task status
    @PatchMapping("/tasks/{taskId}/status")
    public ResponseEntity<EmployeeTaskResponseDto> updateTaskStatus(
            @PathVariable UUID taskId,
            @RequestBody UpdateTaskStatusDto dto) {
        UUID employeeId = getCurrentEmployeeId();
        EmployeeTaskResponseDto updatedTask = employeeDashboardService.updateTaskStatus(employeeId, taskId, dto);
        return ResponseEntity.ok(updatedTask);
    }

    // 8. Get task details
    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<EmployeeTaskResponseDto> getTaskDetails(@PathVariable UUID taskId) {
        UUID employeeId = getCurrentEmployeeId();
        EmployeeTaskResponseDto task = employeeDashboardService.getTaskDetails(employeeId, taskId);
        return ResponseEntity.ok(task);
    }

    // 9. Get notifications
    @GetMapping("/notifications")
    public ResponseEntity<List<EmployeeNotificationResponseDto>> getNotifications(
            @RequestParam(required = false, defaultValue = "false") boolean unreadOnly) {
        UUID employeeId = getCurrentEmployeeId();
        List<EmployeeNotificationResponseDto> notifications = employeeDashboardService.getNotifications(employeeId, unreadOnly);
        return ResponseEntity.ok(notifications);
    }

    // 10. Mark notification as read
    @PatchMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable UUID notificationId) {
        UUID employeeId = getCurrentEmployeeId();
        employeeDashboardService.markNotificationAsRead(employeeId, notificationId);
        return ResponseEntity.ok().build();
    }

    // 11. Mark all notifications as read
    @PostMapping("/notifications/mark-all-read")
    public ResponseEntity<Void> markAllNotificationsAsRead() {
        UUID employeeId = getCurrentEmployeeId();
        employeeDashboardService.markAllNotificationsAsRead(employeeId);
        return ResponseEntity.ok().build();
    }

    // 12. Clear all notifications
    @DeleteMapping("/notifications")
    public ResponseEntity<Void> clearAllNotifications() {
        UUID employeeId = getCurrentEmployeeId();
        employeeDashboardService.clearAllNotifications(employeeId);
        return ResponseEntity.ok().build();
    }

    // 13. Get employee statistics
    @GetMapping("/stats")
    public ResponseEntity<EmployeeStatsResponseDto> getEmployeeStats(
            @RequestParam(required = false, defaultValue = "monthly") String period) {
        UUID employeeId = getCurrentEmployeeId();
        EmployeeStatsResponseDto stats = employeeDashboardService.getEmployeeStats(employeeId, period);
        return ResponseEntity.ok(stats);
    }

    // 14. Get employee schedule
    @GetMapping("/schedule")
    public ResponseEntity<List<EmployeeScheduleResponseDto>> getEmployeeSchedule(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        UUID employeeId = getCurrentEmployeeId();
        List<EmployeeScheduleResponseDto> schedule = employeeDashboardService.getEmployeeSchedule(employeeId, startDate, endDate);
        return ResponseEntity.ok(schedule);
    }

    // 15. Update availability status
    @PatchMapping("/availability")
    public ResponseEntity<Void> updateAvailability(@RequestBody UpdateAvailabilityDto dto) {
        UUID employeeId = getCurrentEmployeeId();
        employeeDashboardService.updateAvailability(employeeId, dto);
        return ResponseEntity.ok().build();
    }

    // Helper method to get current employee ID from security context
    private UUID getCurrentEmployeeId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Assuming employee ID is stored in authentication principal
        return UUID.fromString(authentication.getName());
    }*/
}