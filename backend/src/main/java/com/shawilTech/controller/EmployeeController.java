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
}