package com.example.mychat.config;

import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;
import com.mongodb.reactivestreams.client.MongoCollection;
import com.mongodb.reactivestreams.client.MongoDatabase;
import com.mongodb.client.result.InsertOneResult;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;

public class MongoDBConnection {
  private static final Logger logger = LoggerFactory.getLogger(MongoDBConnection.class);
  private MongoClient mongoClient;
  private MongoDatabase database;
  private MongoCollection<Document> collection;

  public MongoDBConnection(String connectionString, String dbName, String collectionName) {
    mongoClient = MongoClients.create(connectionString);
    database = mongoClient.getDatabase(dbName);
    collection = database.getCollection(collectionName, Document.class);
    logger.info("Connected to MongoDB at {}", connectionString);
  }

  public void insertMessage(String sender, String message) {
    Document doc = new Document("sender", sender).append("message", message);
    collection.insertOne(doc).subscribe(new Subscriber<InsertOneResult>() {
      @Override
      public void onSubscribe(Subscription s) {
        s.request(Long.MAX_VALUE);
      }

      @Override
      public void onNext(InsertOneResult result) {
        logger.info("Inserted message from {} into MongoDB", sender);
      }

      @Override
      public void onError(Throwable t) {
        logger.error("Failed to insert message", t);
      }

      @Override
      public void onComplete() {
        // Méthode vide intentionnellement
      }
    });
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
