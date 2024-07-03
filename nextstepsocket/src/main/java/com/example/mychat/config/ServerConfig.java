package com.example.mychat.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;

@Configuration
public class ServerConfig {

  @Value("${spring.data.mongodb.uri}")
  private String databaseConnectionString;

  @Value("${spring.server.port:8080}")
  private int serverPort;

  @PostConstruct
  public void printConfig() {
    System.out.println("Database Connection String: " + databaseConnectionString);
    System.out.println("Server Port: " + serverPort);
  }

  public String getDatabaseConnectionString() {
    return databaseConnectionString;
  }

  public int getServerPort() {
    return serverPort;
  }

  public String getDatabaseName() {
    return "serverSocketDB"; // Assurez-vous que ce nom de base de données est correct
  }
}
