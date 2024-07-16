package com.example.websocket.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@Document(collection = "conversations")
public class Conversation {
    @Id
    private String id;
    private String senderId;
    private String senderFirstName;
    private String senderLastName;
    private String receiverId;
    private String receiverFirstName;
    private String receiverLastName;
    private String name;
    private List<Message> messages = new ArrayList<>();
    private List<Like> likes = new ArrayList<>();
    private Date createdAt;
    private Date updatedAt;

    public Conversation(String senderId, String senderFirstName, String senderLastName,
            String receiverId, String receiverFirstName, String receiverLastName, String name) {
        this.id = UUID.randomUUID().toString();
        this.senderId = senderId;
        this.senderFirstName = senderFirstName;
        this.senderLastName = senderLastName;
        this.receiverId = receiverId;
        this.receiverFirstName = receiverFirstName;
        this.receiverLastName = receiverLastName;
        this.name = name;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public void addMessage(String senderId, String senderFirstName, String senderLastName,
            String content) {
        this.messages.add(new Message(senderId, senderFirstName, senderLastName, content));
        this.updatedAt = new Date();
    }

    public void addLike(Like like) {
        this.likes.add(like);
    }

    public void removeLike(String userId) {
        this.likes.removeIf(like -> like.getUserId().equals(userId));
    }

    @Data
    @NoArgsConstructor
    public static class Message {
        private String id;
        private String senderId;
        private String senderFirstName;
        private String senderLastName;
        private String content;
        private Date timestamp;
        private List<Like> likes = new ArrayList<>();

        public Message(String senderId, String senderFirstName, String senderLastName,
                String content) {
            this.id = UUID.randomUUID().toString();
            this.senderId = senderId;
            this.senderFirstName = senderFirstName;
            this.senderLastName = senderLastName;
            this.content = content;
            this.timestamp = new Date();
        }

        public void addLike(Like like) {
            this.likes.add(like);
        }

        public void removeLike(String userId) {
            this.likes.removeIf(like -> like.getUserId().equals(userId));
        }
    }
}
