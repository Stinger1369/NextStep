package com.example.websocket.service;

import com.example.websocket.model.Like;
import com.example.websocket.model.User;
import com.example.websocket.model.Notification;
import com.example.websocket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private static final String USER_FETCHED = "User fetched: {}";

    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final LikeService likeService;

    public UserService(UserRepository userRepository, NotificationService notificationService,
            LikeService likeService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.likeService = likeService;
    }

    public Mono<User> createUser(User user) {
        if (user.getApiKey() == null || user.getApiKey().isEmpty()) {
            user.setApiKey(UUID.randomUUID().toString());
        }

        logger.info("Creating user: {}", user);
        return userRepository.save(user)
                .doOnSuccess(savedUser -> logger.info("User created: {}", savedUser))
                .doOnError(error -> logger.error("Error creating user: {}", error.getMessage()));
    }

    public Mono<User> getUserByApiKey(String apiKey) {
        logger.info("Fetching user by API key: {}", apiKey);
        return userRepository.findByApiKey(apiKey).doOnSuccess(user -> {
            if (user != null) {
                logger.info(USER_FETCHED, user);
            } else {
                logger.warn("No user found with API key: {}", apiKey);
            }
        }).doOnError(
                error -> logger.error("Error fetching user by API key: {}", error.getMessage()));
    }

    public Mono<User> getUserById(String id) {
        logger.info("Fetching user by ID: {}", id);
        return userRepository.findById(id).doOnSuccess(user -> {
            if (user != null) {
                logger.info(USER_FETCHED, user);
            } else {
                logger.warn("No user found with ID: {}", id);
            }
        }).doOnError(error -> logger.error("Error fetching user by ID: {}", error.getMessage()));
    }

    public Mono<User> getUserByEmail(String email) {
        logger.info("Fetching user by email: {}", email);
        return userRepository.findByEmail(email).flux().next().doOnSuccess(user -> {
            if (user != null) {
                logger.info(USER_FETCHED, user);
            } else {
                logger.warn("No user found with email: {}", email);
            }
        }).doOnError(error -> {
            if (error instanceof IncorrectResultSizeDataAccessException) {
                logger.error("Multiple users found with email: {}", email);
            } else {
                logger.error("Error fetching user by email: {}", error.getMessage());
            }
        });
    }

    public Mono<User> createUserIfNotExists(String email, String firstName, String lastName) {
        return getUserByEmail(email).switchIfEmpty(Mono.defer(() -> {
            User newUser = new User(null, email, firstName, lastName);
            return createUser(newUser);
        }));
    }

    public Flux<User> getAllUsers() {
        logger.info("Fetching all users");
        return userRepository.findAll().doOnComplete(() -> logger.info("All users fetched"))
                .doOnError(error -> logger.error("Error fetching users: {}", error.getMessage()));
    }

    public Mono<User> updateUser(String id, User user) {
        logger.info("Updating user: {}", user);
        return userRepository.findById(id).flatMap(existingUser -> {
            existingUser.setEmail(user.getEmail());
            existingUser.setFirstName(user.getFirstName());
            existingUser.setLastName(user.getLastName());
            existingUser.setPosts(user.getPosts());
            existingUser.setNotifications(user.getNotifications());
            existingUser.setConversations(user.getConversations());
            existingUser.setLikes(user.getLikes());
            if (user.getApiKey() == null || user.getApiKey().isEmpty()) {
                existingUser.setApiKey(UUID.randomUUID().toString());
            } else {
                existingUser.setApiKey(user.getApiKey());
            }
            return userRepository.save(existingUser);
        }).doOnSuccess(updatedUser -> logger.info("User updated: {}", updatedUser))
                .doOnError(error -> logger.error("Error updating user: {}", error.getMessage()));
    }

    public Mono<Like> likeEntity(String userId, String entityId, String entityType) {
        if ("user".equals(entityType) && userId.equals(entityId)) {
            return Mono.error(new Exception("Users cannot like themselves."));
        }

        return userRepository.findById(userId).flatMap(user -> {
            return likeService.hasLikedEntity(userId, entityId, entityType).flatMap(hasLiked -> {
                if (hasLiked) {
                    return Mono.error(new Exception("User has already liked this entity."));
                } else {
                    Like like = new Like(userId, entityId, entityType, user.getFirstName(),
                            user.getLastName());
                    return likeService.likeEntity(like).flatMap(savedLike -> {
                        return userRepository.findById(userId).flatMap(likeUser -> {
                            likeUser.addLike(savedLike);
                            return userRepository.save(likeUser);
                        }).flatMap(updatedUser -> {
                            String message = String.format("User %s liked entity %s of type %s.",
                                    user.getFirstName(), entityId, entityType);
                            return sendNotification(entityId, message, entityId)
                                    .thenReturn(savedLike);
                        });
                    });
                }
            });
        });
    }

    public Mono<Void> unlikeEntity(String userId, String entityId, String entityType) {
        return userRepository.findById(userId).flatMap(user -> {
            Like like =
                    new Like(userId, entityId, entityType, user.getFirstName(), user.getLastName());
            return likeService.unlikeEntity(userId, entityId, entityType)
                    .flatMap(unused -> userRepository.findById(userId).flatMap(likeUser -> {
                        likeUser.removeLike(like);
                        return userRepository.save(likeUser);
                    }).flatMap(updatedUser -> {
                        String message = String.format("User %s unliked entity %s of type %s.",
                                user.getFirstName(), entityId, entityType);
                        return sendNotification(entityId, message, entityId).then();
                    }));
        });
    }

    private Mono<Void> sendNotification(String userId, String message, String entityId) {
        return userRepository.findById(entityId).flatMap(likedUser -> {
            Notification notification = new Notification(likedUser.getId(),
                    likedUser.getFirstName(), likedUser.getLastName(), message, entityId);
            return notificationService.createNotification(notification)
                    .flatMap(savedNotification -> {
                        likedUser.addNotification(savedNotification);
                        return userRepository.save(likedUser)
                                .doOnSuccess(saved -> logger.info("Notification sent: {}", saved));
                    });
        }).then();
    }

    public Mono<Void> deleteUser(String id) {
        logger.info("Deleting user with ID: {}", id);
        return userRepository.deleteById(id).doOnSuccess(unused -> logger.info("User deleted"))
                .doOnError(error -> logger.error("Error deleting user: {}", error.getMessage()));
    }
}
