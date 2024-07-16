package com.example.websocket.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.UUID;

@Document(collection = "likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Like {
    @Id
    private String id;
    private String userId;
    private String entityId; // ID of the entity being liked (User, Post, Comment, etc.)
    private String entityType; // Type of the entity (User, Post, Comment, etc.)
    private Date createdAt;
    private String firstName;
    private String lastName;

    public Like(String userId, String entityId, String entityType, String firstName,
            String lastName) {
        this.id = UUID.randomUUID().toString();
        this.createdAt = new Date();
        this.userId = userId;
        this.entityId = entityId;
        this.entityType = entityType;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
