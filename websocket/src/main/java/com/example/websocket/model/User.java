package com.example.websocket.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.example.websocket.model.user.Block;
import com.example.websocket.model.user.Follow;
import com.example.websocket.model.user.FriendInfo;
import com.example.websocket.model.user.ProfileVisit;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "usersocket")
@Data
@NoArgsConstructor
public class User {
    @Id
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String apiKey;
    private List<Post> posts = new ArrayList<>();
    private List<Notification> notifications = new ArrayList<>();
    private List<Conversation> conversations = new ArrayList<>();
    private List<Like> likes = new ArrayList<>();
    private List<Unlike> unlikes = new ArrayList<>(); // Nouvelle liste pour les unlikes
    private List<FriendInfo> friends = new ArrayList<>();
    private List<FriendInfo> friendRequests = new ArrayList<>();
    private List<Follow> following = new ArrayList<>();
    private List<Follow> followers = new ArrayList<>();
    private List<ProfileVisit> profileVisits = new ArrayList<>();
    private List<Block> blocks = new ArrayList<>();

    public User(String id, String email, String firstName, String lastName) {
        this.id = (id != null && !id.isEmpty()) ? id : UUID.randomUUID().toString();
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.apiKey = UUID.randomUUID().toString();
    }

    // Methods for managing likes
    public void addLike(Like like) {
        this.likes.add(like);
    }

    public void removeLike(Like like) {
        this.likes.removeIf(existingLike -> existingLike.getUserId().equals(like.getUserId())
                && existingLike.getEntityId().equals(like.getEntityId())
                && existingLike.getEntityType().equals(like.getEntityType()));
    }

    // Methods for managing unlikes
    public void addUnlike(Unlike unlike) {
        this.unlikes.add(unlike);
    }

    public void removeUnlike(Unlike unlike) {
        this.unlikes
                .removeIf(existingUnlike -> existingUnlike.getUserId().equals(unlike.getUserId())
                        && existingUnlike.getEntityId().equals(unlike.getEntityId())
                        && existingUnlike.getEntityType().equals(unlike.getEntityType()));
    }

    // Methods for managing posts
    public void addPost(Post post) {
        this.posts.add(post);
    }

    // Methods for managing notifications
    public void addNotification(Notification notification) {
        this.notifications.add(notification);
    }

    // Methods for managing conversations
    public void addConversation(Conversation conversation) {
        this.conversations.add(conversation);
    }

    // Methods for managing friends
    public void addFriend(FriendInfo friendInfo) {
        if (!this.friends.contains(friendInfo)) {
            this.friends.add(friendInfo);
        }
    }

    public void removeFriend(FriendInfo friendInfo) {
        this.friends.remove(friendInfo);
    }

    // Methods for managing friend requests
    public void addFriendRequest(FriendInfo friendInfo) {
        if (!this.friendRequests.contains(friendInfo)) {
            this.friendRequests.add(friendInfo);
        }
    }

    public void removeFriendRequest(FriendInfo friendInfo) {
        this.friendRequests.remove(friendInfo);
    }

    // Methods for managing following
    public void followUser(Follow follow) {
        if (!this.following.contains(follow)) {
            this.following.add(follow);
        }
    }

    public void unfollowUser(String userId) {
        this.following.removeIf(follow -> follow.getFolloweeId().equals(userId));
    }

    public boolean isFollowing(String followeeId) {
        return this.following.stream()
                .anyMatch(follow -> follow.getFolloweeId().equals(followeeId));
    }

    // Methods for managing followers
    public void addFollower(Follow follow) {
        if (!this.followers.contains(follow)) {
            this.followers.add(follow);
        }
    }

    public void removeFollower(String userId) {
        this.followers.removeIf(follow -> follow.getFollowerId().equals(userId));
    }

    // Method for managing profile visits
    public void addProfileVisit(ProfileVisit profileVisit) {
        this.profileVisits.add(profileVisit);
    }

    // Methods for managing blocks
    public void blockUser(Block block) {
        if (!this.blocks.contains(block)) {
            this.blocks.add(block);
        }
    }

    public void unblockUser(String blockedId) {
        this.blocks.removeIf(block -> block.getBlockedId().equals(blockedId));
    }

    public boolean isBlocked(String blockedId) {
        return this.blocks.stream().anyMatch(block -> block.getBlockedId().equals(blockedId));
    }
}
