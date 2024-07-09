package com.example.mychat.config;

import com.example.mychat.filter.ApiKeyFilter;
import com.example.mychat.service.ApiKeyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.WebFilter;

import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        logger.info("Configuring SecurityWebFilterChain");
        return http.cors(cors -> {
            logger.info("Enabling CORS");
        }).csrf(csrf -> {
            logger.info("Disabling CSRF");
            csrf.disable();
        }).authorizeExchange(exchange -> {
            logger.info("Configuring authorization exchange");
            exchange.pathMatchers("/api-keys").permitAll().anyExchange().authenticated();
        }).build();
    }

    @Bean
    public WebFilter apiKeyWebFilter(ApiKeyService apiKeyService) {
        logger.info("Creating ApiKeyFilter bean");
        return new ApiKeyFilter(apiKeyService);
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        logger.info("Configuring CORS");
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
