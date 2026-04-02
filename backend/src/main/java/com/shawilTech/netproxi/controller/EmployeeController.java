package com.shawilTech.netproxi.controller;

import com.shawilTech.netproxi.dto.*;
import com.shawilTech.netproxi.service.EmployeeService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Tag(name = "Employees", description = "APIs for managing Employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    //  Create employee
    @Operation(summary = "Register Employee")
    @PostMapping
    public EmployeeResponseDto createEmployee(@RequestBody EmployeeRequestDto dto) {
        return employeeService.createEmployee(dto);
    }

    // Get all employees (from logged-in user's company)
    @Operation(summary = "Get all employees of current company")
    @GetMapping
    public List<EmployeeResponseDto> getEmployees() {
        return employeeService.getEmployees();
    }

    //  Get single employee
    @Operation(summary = "Get employee by ID")
    @GetMapping("/{employeeId}")
    public EmployeeResponseDto getEmployeeById(@PathVariable UUID employeeId) {
        return employeeService.getEmployeeById(employeeId);
    }

    // Update employee
    @Operation(summary = "Update employee")
    @PutMapping("/{employeeId}")
    public EmployeeResponseDto updateEmployee(
            @PathVariable UUID employeeId,
            @RequestBody EmployeeRequestDto dto
    ) {
        return employeeService.updateEmployee(employeeId, dto);
    }

    //  Delete employee
    @Operation(summary = "Delete employee")
    @DeleteMapping("/{employeeId}")
    public void deleteEmployee(@PathVariable UUID employeeId) {
        employeeService.deleteEmployee(employeeId);
    }
}