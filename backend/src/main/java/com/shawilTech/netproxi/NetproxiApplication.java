package com.shawilTech.netproxi;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.shawilTech.netproxi.entity.Role;
import com.shawilTech.netproxi.repository.RoleRepository;

@SpringBootApplication(scanBasePackages = "com.shawilTech")
public class NetproxiApplication {

	public static void main(String[] args) {
		SpringApplication.run(NetproxiApplication.class, args);
	}

	  @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {

            List<String> roles = List.of(
                    "ROLE_SUPER_ADMIN",
                    "ROLE_COMPANY_ADMIN",
                    "ROLE_EMPLOYEE",
                    "ROLE_CLIENT"
            );

            for (String roleName : roles) {
                roleRepository.findByName(roleName)
                        .orElseGet(() -> {
                            Role role = Role.builder()
                                    .name(roleName)
                                    .build();
                            return roleRepository.save(role);
                        });
            }

            System.out.println("✅ Roles initialized successfully");
        };
    }

}
