package  com.shawilTech.identityservice.service;

import  com.shawilTech.identityservice.entity.*;
import  com.shawilTech.identityservice.repository.*;
import  lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import  org.springframework.transaction.annotation.Transactional;

import  java.util.List;
import  java.util.UUID;

@Service
@RequiredArgsConstructor
public  class UserService{

    private  final UserRepository userRepository;
    private  final  CompanyRepository companyRepository;
    private  final SubscriptionRepository subscriptionRepository;

    @Transactional
    public  User createEmployee(User user, UUID companyId){
        Company company = companyRepository.findById(companyId)
                .orElseThrow(()->new RuntimeException("Company not found"));
        Subscription subscription = subscriptionRepository.findByCompanyAndActiveTrue(company)
                .orElseThrow(()-> new RuntimeException("No active subscription found"));
        int currentEmployeess = userRepository.countByCompanyAndActiveTrue(company);
       /* if(currentEmployeess >= subscription.getPlan().getMaxEmployee()){
            throw  new RuntimeException("Employee limit reached for your subscription plan .");
        }*/

        user.setCompany(company);
        user.setActive(true);

        return userRepository.save(user);
    }

    public  List<User> getEmployeesByCompany(UUID companyId){
        Company  company = companyRepository.findById(companyId)
                .orElseThrow(()-> new RuntimeException("Company not found"));

        return  userRepository.findByCompany(company);
    }
}