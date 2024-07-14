package com.example.websocket.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;
    private String userFirstName;
    private String userLastName;
    private String title;
    private String content;
    private Date createdAt;
    private Date updatedAt;
    private List<Comment> comments = new ArrayList<>();
    private List<String> likes = new ArrayList<>();
    private List<String> shares = new ArrayList<>();
    private int repostCount = 0;
    private List<String> reposters = new ArrayList<>();

    public Post() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public Post(String userId, String userFirstName, String userLastName, String title,
            String content) {
        this();
        this.userId = userId;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.title = title;
        this.content = content;
    }

    // Getters et setters

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

    public String getUserFirstName() {
        return userFirstName;
    }

    public void setUserFirstName(String userFirstName) {
        this.userFirstName = userFirstName;
    }

    public String getUserLastName() {
        return userLastName;
    }

    public void setUserLastName(String userLastName) {
        this.userLastName = userLastName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
        this.updatedAt = new Date();
    }

    public List<String> getLikes() {
        return likes;
    }

    public void setLikes(List<String> likes) {
        this.likes = likes;
    }

    public void addLike(String userId) {
        this.likes.add(userId);
    }

    public void removeLike(String userId) {
        this.likes.remove(userId);
    }

    public List<String> getShares() {
        return shares;
    }

    public void setShares(List<String> shares) {
        this.shares = shares;
    }

    public void addShare(String email) {
        this.shares.add(email);
    }

    public int getRepostCount() {
        return repostCount;
    }

    public void incrementRepostCount() {
        this.repostCount++;
    }

    public List<String> getReposters() {
        return reposters;
    }

    public void setReposters(List<String> reposters) {
        this.reposters = reposters;
    }

    public void addReposter(String userId) {
        this.reposters.add(userId);
    }

    public boolean hasLiked(String userId) {
        return this.likes.contains(userId);
    }
}
