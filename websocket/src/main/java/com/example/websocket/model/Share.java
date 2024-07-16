package com.example.websocket.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.UUID;

@Document(collection = "shares")
@Data
@NoArgsConstructor
public class Share {
    @Id
    private String id;
    private String userId;
    private String postId;
    private String userEmail;
    private Date sharedAt;

    public Share(String userId, String postId, String userEmail) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.postId = postId;
        this.userEmail = userEmail;
        this.sharedAt = new Date();
    }
}
