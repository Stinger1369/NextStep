package com.example;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

public class MongoDBConnection {
    private MongoClient mongoClient;
    private MongoDatabase database;
    private MongoCollection<Document> collection;

    public MongoDBConnection(String dbName, String collectionName) {
        mongoClient = new MongoClient("localhost", 15000);
        database = mongoClient.getDatabase(dbName);
        collection = database.getCollection(collectionName);
    }

    public void insertMessage(String sender, String message) {
        Document doc = new Document("sender", sender)
                         .append("message", message);
        collection.insertOne(doc);
        System.out.println("Inserted message from " + sender + " into MongoDB");
    }

    public void close() {
        mongoClient.close();
    }
}
