package com.shawilTech.netproxi;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.shawilTech.netproxi.entity.Role;
import com.shawilTech.netproxi.repository.RoleRepository;

@SpringBootApplication(scanBasePackages = "com.shawilTech")
public class NetproxiApplication {

	public static void main(String[] args) {
		SpringApplication.run(NetproxiApplication.class, args);
	}

	@Bean
	public CommandLineRunner initRoles(RoleRepository repo) {
		return args -> initRolesData(repo);
	}

	@Transactional
	public void initRolesData(RoleRepository repo) {
		List<String> roles = List.of(
			"ROLE_SUPER_ADMIN",
			"ROLE_COMPANY",
			"ROLE_EMPLOYEE",
			"ROLE_CLIENT"
		);

		for (String r : roles) {
			repo.findByName(r).orElseGet(() ->
				repo.save(Role.builder().name(r).build())
			);
		}
	}

}
