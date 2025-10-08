package com.shawilTech.identityservice.service;

import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.entity.*;
import com.shawilTech.identityservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Transactional
    public EmployeeResponseDto createEmployee(EmployeeRequestDto dto, UUID companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Subscription subscription = subscriptionRepository.findByCompanyAndActiveTrue(company)
                .orElseThrow(() -> new RuntimeException("No active subscription found"));

        int currentEmployees = employeeRepository.countByCompanyAndActiveTrue(company);
    /*
    if (currentEmployees >= subscription.getPlan().getMaxEmployee()) {
        throw new RuntimeException("Employee limit reached for your subscription plan.");
    }
    */

        // Convert DTO → Entity
        Employee employee = Employee.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .company(company)
                .active(true)
                .build();

        Employee savedEmployee = employeeRepository.save(employee);

        // Convert Entity → Response DTO
        return toResponseDto(savedEmployee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponseDto> getEmployeesByCompany(UUID companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        return employeeRepository.findByCompany(company).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeResponseDto getEmployeeById(UUID companyId, UUID employeeId) {
        Company company  =  companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        Employee employee = employeeRepository.findByIdAndCompany(employeeId, company)
                .orElseThrow(() -> new RuntimeException("Employee not found for this company"));

        return toResponseDto(employee);
    }

    @Transactional
    public EmployeeResponseDto updateEmployee(UUID companyId, UUID employeeId, EmployeeRequestDto dto){
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Employee employee = employeeRepository.findByIdAndCompany(employeeId, company)
                .orElseThrow(() -> new RuntimeException("Employee not found for this company"));

        //update allowed fields

        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setAddress(dto.getAddress());

        Employee updatedEmployee = employeeRepository.save(employee);

        return toResponseDto(updatedEmployee);
    }

    @Transactional
    public void  deleteEmployee(UUID companyId, UUID employeeId){
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));


        Employee employee = employeeRepository.findByIdAndCompany(employeeId, company)
                .orElseThrow(() -> new RuntimeException("Employee not found for this company"));

        employeeRepository.delete(employee);

    }

    //Utility mapping method
    public EmployeeResponseDto toResponseDto(Employee emp) {
        return EmployeeResponseDto.builder()
                .id(emp.getId())
                .name(emp.getName())
                .email(emp.getEmail())
                .phone(emp.getPhone())
                .address(emp.getAddress())
                .active(emp.isActive())
                .build();
    }

}