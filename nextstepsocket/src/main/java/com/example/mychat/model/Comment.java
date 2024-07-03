package com.example.mychat.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "comments")
public class Comment {
    @Id
    private ObjectId id;
    private String content;
    private String authorId;
    private ObjectId postId;
    private Date createdAt;
    private Date updatedAt;

    public Comment() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public ObjectId getPostId() {
        return postId;
    }

    public void setPostId(ObjectId postId) {
        this.postId = postId;
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
