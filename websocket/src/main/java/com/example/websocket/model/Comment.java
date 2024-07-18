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
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String postId;
    private String userId;
    private String firstName;
    private String lastName;
    private String content;
    private Date createdAt;
    private Date updatedAt;
    private List<Like> likes = new ArrayList<>();
    private List<Unlike> unlikes = new ArrayList<>(); // Nouvelle liste pour les unlikes

    public Comment(String userId, String postId, String firstName, String lastName,
            String content) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.postId = postId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public void addLike(Like like) {
        this.likes.add(like);
        this.updatedAt = new Date();
    }

    public void removeLike(Like like) {
        this.likes.removeIf(existingLike -> existingLike.getUserId().equals(like.getUserId())
                && existingLike.getEntityId().equals(like.getEntityId())
                && existingLike.getEntityType().equals(like.getEntityType()));
        this.updatedAt = new Date();
    }

    public void addUnlike(Unlike unlike) {
        this.unlikes.add(unlike);
        this.updatedAt = new Date();
    }

    public void removeUnlike(Unlike unlike) {
        this.unlikes
                .removeIf(existingUnlike -> existingUnlike.getUserId().equals(unlike.getUserId())
                        && existingUnlike.getEntityId().equals(unlike.getEntityId())
                        && existingUnlike.getEntityType().equals(unlike.getEntityType()));
        this.updatedAt = new Date();
    }

    public boolean hasLiked(String userId) {
        return this.likes.stream().anyMatch(like -> like.getUserId().equals(userId));
    }

    public boolean hasUnliked(String userId) {
        return this.unlikes.stream().anyMatch(unlike -> unlike.getUserId().equals(userId));
    }
}
