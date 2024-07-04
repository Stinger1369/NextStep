package com.example.mychat.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Document(collection = "posts")
public class Post {
    @Id
    private ObjectId id;
    private String userId;
    private String title;
    private String content;
    private Date createdAt;
    private Date updatedAt;
    private List<Comment> comments = new ArrayList<>();

    public Post() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public Post(String userId, String title, String content) {
        this();
        this.userId = userId;
        this.title = title;
        this.content = content;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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
    }

    public void updateComment(Comment updatedComment) {
        this.comments = this.comments.stream()
                .map(comment -> comment.getId().equals(updatedComment.getId()) ? updatedComment : comment)
                .collect(Collectors.toList());
    }

    public void removeComment(Comment comment) {
        this.comments.removeIf(c -> c.getId().equals(comment.getId()));
    }
}
