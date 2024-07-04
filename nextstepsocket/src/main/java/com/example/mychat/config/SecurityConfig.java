package com.example.mychat.config;

import com.example.mychat.filter.ApiKeyFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.server.WebFilter;

@Configuration
public class SecurityConfig {

    public SecurityConfig() {
        // Constructor without apiKeyFilter parameter
    }

    @Bean
    public WebFilter apiKeyWebFilter(ApiKeyFilter apiKeyFilter) {
        return apiKeyFilter;
    }
}
