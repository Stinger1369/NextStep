package com.example.websocket.service;

import com.example.websocket.model.Like;
import com.example.websocket.model.User;
import com.example.websocket.service.user.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserCreationService userCreationService;
    private final UserFetchService userFetchService;
    private final UserFriendService userFriendService;
    private final UserLikeService userLikeService;
    private final UserUnlikeService userUnlikeService;
    private final UserFollowService userFollowService;
    private final UserProfileVisitService userProfileVisitService;

    public UserService(UserCreationService userCreationService, UserFetchService userFetchService,
            UserFriendService userFriendService, UserLikeService userLikeService,
            UserUnlikeService userUnlikeService, UserFollowService userFollowService,
            UserProfileVisitService userProfileVisitService) {
        this.userCreationService = userCreationService;
        this.userFetchService = userFetchService;
        this.userFriendService = userFriendService;
        this.userLikeService = userLikeService;
        this.userUnlikeService = userUnlikeService;
        this.userFollowService = userFollowService;
        this.userProfileVisitService = userProfileVisitService;
    }

    public Mono<User> createUser(User user) {
        return userCreationService.createUser(user);
    }

    public Mono<User> getUserByApiKey(String apiKey) {
        return userFetchService.getUserByApiKey(apiKey);
    }

    public Mono<User> getUserById(String id) {
        return userFetchService.getUserById(id);
    }

    public Mono<User> getUserByEmail(String email) {
        return userFetchService.getUserByEmail(email);
    }

    public Mono<User> createUserIfNotExists(String email, String firstName, String lastName) {
        return userCreationService.createUserIfNotExists(email, firstName, lastName);
    }

    public Flux<User> getAllUsers() {
        return userFetchService.getAllUsers();
    }

    public Mono<Void> sendFriendRequest(String userId, String friendId) {
        return userFriendService.sendFriendRequest(userId, friendId);
    }

    public Mono<Void> acceptFriendRequest(String userId, String friendId) {
        return userFriendService.acceptFriendRequest(userId, friendId);
    }

    public Mono<Void> declineFriendRequest(String userId, String friendId) {
        return userFriendService.declineFriendRequest(userId, friendId);
    }

    public Mono<Void> removeFriend(String userId, String friendId) {
        return userFriendService.removeFriend(userId, friendId);
    }

    public Mono<Like> likeEntity(String userId, String entityId, String entityType) {
        return userLikeService.likeEntity(userId, entityId, entityType);
    }

    public Mono<Void> unlikeEntity(String userId, String entityId, String entityType) {
        return userUnlikeService.unlikeEntity(userId, entityId, entityType);
    }

    public Mono<Void> followUser(String userId, String followId, String firstName,
            String lastName) {
        return userFollowService.followUser(userId, followId, firstName, lastName);
    }

    public Mono<Void> unfollowUser(String userId, String followId) {
        return userFollowService.unfollowUser(userId, followId);
    }

    public Mono<Void> visitProfile(String visitorId, String visitedId) {
        return userProfileVisitService.visitProfile(visitorId, visitedId);
    }

    public Mono<Void> deleteUser(String id) {
        logger.info("Deleting user with ID: {}", id);
        return userFetchService.deleteUser(id)
                .doOnSuccess(unused -> logger.info("User deleted with ID: {}", id))
                .doOnError(error -> logger.error("Error deleting user: {}", error.getMessage()));
    }
}
