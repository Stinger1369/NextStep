package com.example.websocket.service.user;

import com.example.websocket.model.Like;
import com.example.websocket.model.Unlike;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.LikeService;
import com.example.websocket.service.UnlikeService;
import com.example.websocket.service.user.UserNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserLikeService {

    private static final Logger logger = LoggerFactory.getLogger(UserLikeService.class);
    private final UserRepository userRepository;
    private final LikeService likeService;
    private final UnlikeService unlikeService;
    private final UserNotificationService notificationService;

    public UserLikeService(UserRepository userRepository, LikeService likeService,
            UnlikeService unlikeService, UserNotificationService notificationService) {
        this.userRepository = userRepository;
        this.likeService = likeService;
        this.unlikeService = unlikeService;
        this.notificationService = notificationService;
    }

    public Mono<Like> likeEntity(String userId, String entityId, String entityType) {
        logger.info("User {} liking entity {} of type {}", userId, entityId, entityType);
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
                    return unlikeService.removeUnlike(userId, entityId, entityType) // Remove
                                                                                    // existing
                                                                                    // unlike if
                                                                                    // present
                            .then(likeService.likeEntity(like)).flatMap(savedLike -> {
                                user.removeUnlike(new Unlike(userId, entityId, entityType,
                                        user.getFirstName(), user.getLastName())); // Ensure unlike
                                                                                   // is removed
                                user.addLike(savedLike); // Add the like to the user
                                return userRepository.save(user).flatMap(updatedUser -> {
                                    return userRepository.findById(entityId).flatMap(targetUser -> {
                                        String message =
                                                String.format("User %s %s liked your profile.",
                                                        user.getFirstName(), user.getLastName());
                                        return notificationService
                                                .sendNotification(entityId, message, entityId)
                                                .thenReturn(savedLike);
                                    });
                                });
                            });
                }
            });
        }).doOnError(error -> logger.error("Error liking entity: {}", error.getMessage()));
    }
}
