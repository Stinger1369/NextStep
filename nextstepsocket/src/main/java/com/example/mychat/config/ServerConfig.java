package com.example.mychat.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.logging.Logger;

public class ServerConfig {
  private static final Logger logger = Logger.getLogger(ServerConfig.class.getName());
  private Properties properties = new Properties();

  public ServerConfig() {
    loadProperties();
  }

  private void loadProperties() {
    try (InputStream input = getClass().getClassLoader().getResourceAsStream("application.properties")) {
      if (input == null) {
        logger.severe("Sorry, unable to find application.properties");
        return;
      }
      properties.load(input);
    } catch (IOException ex) {
      logger.severe("Error loading properties file: " + ex.getMessage());
    }
  }

  public String getProperty(String key) {
    return properties.getProperty(key);
  }

  public int getIntProperty(String key, int defaultValue) {
    String value = properties.getProperty(key);
    try {
      return Integer.parseInt(value);
    } catch (NumberFormatException e) {
      logger.warning("Invalid number format for key: " + key + ", using default: " + defaultValue);
      return defaultValue;
    }
  }

  public String getDatabaseConnectionString() {
    return getProperty("spring.data.mongodb.uri");
  }

  public String getDatabaseName() {
    return "serverSocketDB"; // Assurez-vous que ce nom de base de données est correct
  }

  public int getServerPort() {
    return getIntProperty("server.port", 8080);
  }
}
