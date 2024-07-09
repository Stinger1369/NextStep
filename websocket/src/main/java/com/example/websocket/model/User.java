package com.example.websocket.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "usersocket")
public class User {
    @Id
    private ObjectId id;
    private String username;
    private String email;
    private String password;
    private String apiKey;
    private List<Post> posts = new ArrayList<>();
    private List<Notification> notifications = new ArrayList<>();
    private List<Conversation> conversations = new ArrayList<>();

    public User() {}

    public User(String username, String email, String password, String apiKey) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.apiKey = apiKey;
    }

    // Getters and setters

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public List<Conversation> getConversations() {
        return conversations;
    }

    public void setConversations(List<Conversation> conversations) {
        this.conversations = conversations;
    }

    public void addPost(Post post) {
        this.posts.add(post);
    }

    public void addNotification(Notification notification) {
        this.notifications.add(notification);
    }

    public void addConversation(Conversation conversation) {
        this.conversations.add(conversation);
    }
}
