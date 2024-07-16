package com.example.websocket.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
public class Notification {
    @Id
    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private String message;
    private String content;
    private Date createdAt;
    private Date updatedAt;
    private String type;

    public Notification(String userId, String firstName, String lastName, String message,
            String content) {
        this.id = UUID.randomUUID().toString();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.message = message;
        this.content = content;
        this.type = "follow"; // Default type for follow notifications
    }

    public Notification(String userId, String firstName, String lastName, String message,
            String content, String type) {
        this.id = UUID.randomUUID().toString();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.message = message;
        this.content = content;
        this.type = type;
    }
}
