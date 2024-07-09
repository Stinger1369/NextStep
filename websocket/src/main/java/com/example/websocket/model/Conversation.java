package com.example.websocket.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "conversations")
public class Conversation {
    @Id
    private ObjectId id;
    private String senderId;
    private String receiverId;
    private List<Message> messages = new ArrayList<>();
    private Date createdAt;
    private Date updatedAt;

    public Conversation() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public Conversation(String senderId, String receiverId) {
        this();
        this.senderId = senderId;
        this.receiverId = receiverId;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void addMessage(String senderId, String receiverId, String content) {
        this.messages.add(new Message(senderId, receiverId, content));
    }

    public static class Message {
        private String senderId;
        private String receiverId;
        private String content;
        private Date createdAt;
        private Date updatedAt;

        public Message() {
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }

        public Message(String senderId, String receiverId, String content) {
            this();
            this.senderId = senderId;
            this.receiverId = receiverId;
            this.content = content;
        }

        public String getSenderId() {
            return senderId;
        }

        public void setSenderId(String senderId) {
            this.senderId = senderId;
        }

        public String getReceiverId() {
            return receiverId;
        }

        public void setReceiverId(String receiverId) {
            this.receiverId = receiverId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }

        public Date getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(Date updatedAt) {
            this.updatedAt = updatedAt;
        }
    }
}
