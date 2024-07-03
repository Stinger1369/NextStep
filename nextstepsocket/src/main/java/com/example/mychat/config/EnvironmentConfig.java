package com.example.mychat.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;

@Configuration
public class EnvironmentConfig {

    @Value("${MONGO_URI_SPRING}")
    private String mongoUriSpring;

    @Value("${SPRING_SERVER_PORT}")
    private String springServerPort;

    @PostConstruct
    public void printEnv() {
        System.out.println("MONGO_URI_SPRING: " + mongoUriSpring);
        System.out.println("SPRING_SERVER_PORT: " + springServerPort);
    }
}
