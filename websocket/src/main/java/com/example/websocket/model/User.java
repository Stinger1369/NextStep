package com.example.websocket.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "usersocket")
public class User {
    @Id
    private ObjectId id;
    private String emailOrPhone;
    private String firstName;
    private String lastName;
    private String apiKey; // Ajout de l'apiKey
    private List<Post> posts = new ArrayList<>();
    private List<Notification> notifications = new ArrayList<>();
    private List<Conversation> conversations = new ArrayList<>();

    public User() {}

    public User(String emailOrPhone, String firstName, String lastName) {
        this.emailOrPhone = emailOrPhone;
        this.firstName = firstName;
        this.lastName = lastName;
        this.apiKey = UUID.randomUUID().toString(); // Générer l'apiKey lors de la création
    }

    // Getters and setters

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getemailOrPhone() {
        return emailOrPhone;
    }

    public void setemailOrPhone(String emailOrPhone) {
        this.emailOrPhone = emailOrPhone;
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
