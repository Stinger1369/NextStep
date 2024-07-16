package com.example.websocket.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Document(collection = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    private String id;
    private String conversationId;
    private String senderId;
    private String senderFirstName;
    private String senderLastName;
    private String content;
    private Date timestamp;
    private List<Like> likes = new ArrayList<>();

    public Message(String conversationId, String senderId, String senderFirstName,
            String senderLastName, String content) {
        this.id = UUID.randomUUID().toString();
        this.timestamp = new Date();
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.senderFirstName = senderFirstName;
        this.senderLastName = senderLastName;
        this.content = content;
        this.likes = new ArrayList<>();
    }

    public void addLike(Like like) {
        this.likes.add(like);
    }

    public void removeLike(String userId) {
        this.likes.removeIf(like -> like.getUserId().equals(userId));
    }
}
