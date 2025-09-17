package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.dto.EmployeeRequestDto;
import com.shawilTech.identityservice.dto.EmployeeResponseDto;
import com.shawilTech.identityservice.entity.Employee;
import com.shawilTech.identityservice.service.EmployeeService;
import lombok.RequiredArgsConstructor;
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
    public  Employee createEmployee(@PathVariable UUID companyId, @RequestBody Employee dto){

        Employee employee = Employee.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .build();
        Employee savedEmployee = employeeService.createEmployee(employee, companyId);

        return  Employee.builder()
                .name(savedEmployee.getName())
                .email(savedEmployee.getEmail())
                .phone(savedEmployee.getPhone())
                .address(savedEmployee.getAddress())
                .active(savedEmployee.isActive())
                .build();

    }

    // get all employees
    @GetMapping
    public List<Employee> getEmployees(@PathVariable UUID companyId){
        return  employeeService.getEmployeesByCompany(companyId)
                .stream()
                .map(user-> Employee.builder()
                                .name(user.getName())
                                .email(user.getEmail())
                                .phone(user.getPhone())
                                .active(user.isActive())
                                .build())
                .collect(Collectors.toList());
    }
}