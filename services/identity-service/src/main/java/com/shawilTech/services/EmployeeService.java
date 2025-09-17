package  com.shawilTech.identityservice.service;

import  com.shawilTech.identityservice.dto.*;
import  com.shawilTech.identityservice.entity.*;
import  com.shawilTech.identityservice.repository.*;
import  lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import  org.springframework.transaction.annotation.Transactional;

import  java.util.List;
import  java.util.UUID;

@Service
@RequiredArgsConstructor
public  class EmployeeService{

    private  final EmployeeRepository employeeRepository;
    private  final  CompanyRepository companyRepository;
    private  final SubscriptionRepository subscriptionRepository;

    @Transactional
    public  Employee createEmployee(Employee employee, UUID companyId){

        Company company = companyRepository.findById(companyId)
                .orElseThrow(()->new RuntimeException("Company not found"));

        Subscription subscription = subscriptionRepository.findByCompanyAndActiveTrue(company)
                .orElseThrow(()-> new RuntimeException("No active subscription found"));

        int currentEmployeess = employeeRepository.countByCompanyAndActiveTrue(company);
       /* if(currentEmployeess >= subscription.getPlan().getMaxEmployee()){
            throw  new RuntimeException("Employee limit reached for your subscription plan .");
        }*/

        employee.setCompany(company);
        employee.setActive(true);

        return employeeRepository.save(employee);
    }

    public  List<Employee> getEmployeesByCompany(UUID companyId){
        Company  company = companyRepository.findById(companyId)
                .orElseThrow(()-> new RuntimeException("Company not found"));

        return  employeeRepository.findByCompany(company);
    }
}