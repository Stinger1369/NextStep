package com.example.websocket.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Document(collection = "posts")
@Data
@NoArgsConstructor
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
    private List<Like> likes = new ArrayList<>();
    private List<Unlike> unlikes = new ArrayList<>(); // Nouvelle liste pour les unlikes
    private List<Share> shares = new ArrayList<>();
    private List<String> images = new ArrayList<>(); // Nouvelle liste pour les URLs d'images
    private int repostCount = 0;
    private List<String> reposters = new ArrayList<>();

    public Post(String userId, String userFirstName, String userLastName, String title,
            String content) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.title = title;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
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
    }

    public void addShare(Share share) {
        this.shares.add(share);
        this.updatedAt = new Date();
    }

    public void addImage(String imageUrl) {
        this.images.add(imageUrl);
        this.updatedAt = new Date();
    }

    public void incrementRepostCount() {
        this.repostCount++;
    }

    public void addReposter(String userId) {
        this.reposters.add(userId);
    }

    public boolean hasLiked(String userId) {
        return this.likes.stream().anyMatch(like -> like.getUserId().equals(userId));
    }
}
