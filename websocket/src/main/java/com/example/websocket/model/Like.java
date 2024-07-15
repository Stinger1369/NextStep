package com.example.websocket.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.UUID;

@Document(collection = "likes")
public class Like {
    @Id
    private String id;
    private String userId;
    private String entityId; // ID of the entity being liked (User, Post, Comment, etc.)
    private String entityType; // Type of the entity (User, Post, Comment, etc.)
    private Date createdAt;
    private String firstName;
    private String lastName;

    public Like() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = new Date();
    }

    public Like(String userId, String entityId, String entityType, String firstName,
            String lastName) {
        this();
        this.userId = userId;
        this.entityId = entityId;
        this.entityType = entityType;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
