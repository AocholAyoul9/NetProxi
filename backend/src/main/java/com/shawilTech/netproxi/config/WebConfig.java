package com.shawilTech.netproxi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Configuration
public class WebConfig {

    private static final List<String> ALLOWED_ORIGINS = List.of(
        "http://localhost:4200",
        "http://localhost",
        "http://127.0.0.1:4200",
        "http://127.0.0.1"
    );

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Shared CorsConfigurationSource used by both Spring MVC and the
     * Spring Security filter chain (referenced from SecurityConfig).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(ALLOWED_ORIGINS);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
