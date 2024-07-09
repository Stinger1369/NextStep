package com.example.mychat;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class Main {

    private static final Logger logger = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        // Load environment variables from .env file
        Dotenv dotenv = Dotenv.load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        ApplicationContext context = SpringApplication.run(Main.class, args);

        // Start Netty server
        try {
            NettyServer nettyServer = new NettyServer(8080, context);
            new Thread(() -> {
                try {
                    nettyServer.start();
                } catch (InterruptedException e) {
                    logger.error("Error starting Netty server", e);
                }
            }).start();
        } catch (Exception e) {
            logger.error("Failed to start Netty server", e);
        }
    }
}
