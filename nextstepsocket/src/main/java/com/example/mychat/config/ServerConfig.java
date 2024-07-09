package com.example.mychat.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class ServerConfig {

  @Value("${spring.data.mongodb.uri}")
  private String databaseConnectionString;

  private static final Logger logger = LoggerFactory.getLogger(ServerConfig.class);

  @Value("${server.port}")
  private int serverPort;

  @PostConstruct
  public void printConfig() {
    logger.info("Database Connection String: {}", databaseConnectionString);
    logger.info("Server Port: {}", serverPort);
  }

  public String getDatabaseConnectionString() {
    return databaseConnectionString;
  }

  public int getServerPort() {
    return serverPort;
  }

  public String getDatabaseName() {
    return "serverSocketDB";
  }
}
