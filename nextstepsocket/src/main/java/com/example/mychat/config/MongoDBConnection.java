package com.example.mychat.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MongoDBConnection {
  private static final Logger logger = LoggerFactory.getLogger(MongoDBConnection.class);
  private MongoClient mongoClient;
  private MongoDatabase database;
  private MongoCollection<Document> collection;

  public MongoDBConnection(String connectionString, String dbName, String collectionName) {
    mongoClient = MongoClients.create(connectionString);
    database = mongoClient.getDatabase(dbName);
    collection = database.getCollection(collectionName);
    logger.info("Connected to MongoDB at {}", connectionString);
  }

  public void insertMessage(String sender, String message) {
    Document doc = new Document("sender", sender).append("message", message);
    collection.insertOne(doc);
    logger.info("Inserted message from {} into MongoDB", sender);
  }

  public void close() {
    mongoClient.close();
    logger.info("Closed MongoDB connection");
  }

  public static void main(String[] args) {
    ServerConfig config = new ServerConfig();
    String connectionString = config.getDatabaseConnectionString();
    String dbName = config.getDatabaseName();
    MongoDBConnection dbConnection = new MongoDBConnection(connectionString, dbName, "messages");

    // Example usage
    dbConnection.insertMessage("user1", "Hello, this is a test message!");
    dbConnection.close();
  }
}
