package com.example.mychat.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class EnvironmentConfig {

    private static final Logger logger = LoggerFactory.getLogger(EnvironmentConfig.class);

    @Value("${MONGO_URI_SPRING}")
    private String mongoUriSpring;

    @Value("${SPRING_SERVER_PORT}")
    private String springServerPort;

    @PostConstruct
    public void printEnv() {
        logger.info("MONGO_URI_SPRING: {}", mongoUriSpring);
        logger.info("SPRING_SERVER_PORT: {}", springServerPort);
    }
}
