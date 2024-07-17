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
public class UserUnlikeService {

    private static final Logger logger = LoggerFactory.getLogger(UserUnlikeService.class);
    private final UserRepository userRepository;
    private final LikeService likeService;
    private final UnlikeService unlikeService;
    private final UserNotificationService notificationService;

    public UserUnlikeService(UserRepository userRepository, LikeService likeService,
            UnlikeService unlikeService, UserNotificationService notificationService) {
        this.userRepository = userRepository;
        this.likeService = likeService;
        this.unlikeService = unlikeService;
        this.notificationService = notificationService;
    }

    public Mono<Unlike> unlikeEntity(String userId, String entityId, String entityType) {
        logger.info("User {} unliking entity {} of type {}", userId, entityId, entityType);
        if ("user".equals(entityType) && userId.equals(entityId)) {
            return Mono.error(new Exception("Users cannot unlike themselves."));
        }

        return userRepository.findById(userId).flatMap(user -> {
            return unlikeService.hasUnlikedEntity(userId, entityId, entityType)
                    .flatMap(hasUnliked -> {
                        if (hasUnliked) {
                            return Mono
                                    .error(new Exception("User has already unliked this entity."));
                        } else {
                            Unlike unlike = new Unlike(userId, entityId, entityType,
                                    user.getFirstName(), user.getLastName());
                            return likeService.unlikeEntity(userId, entityId, entityType) // Remove
                                                                                          // existing
                                                                                          // like if
                                                                                          // present
                                    .then(unlikeService.unlikeEntity(unlike))
                                    .flatMap(savedUnlike -> {
                                        user.removeLike(new Like(userId, entityId, entityType,
                                                user.getFirstName(), user.getLastName())); // Ensure
                                                                                           // like
                                                                                           // is
                                                                                           // removed
                                        user.addUnlike(savedUnlike); // Add the unlike to the user
                                        return userRepository.save(user).flatMap(updatedUser -> {
                                            return userRepository.findById(entityId)
                                                    .flatMap(targetUser -> {
                                                        String message = String.format(
                                                                "User %s %s unliked your profile.",
                                                                user.getFirstName(),
                                                                user.getLastName());
                                                        return notificationService
                                                                .sendNotification(entityId, message,
                                                                        entityId)
                                                                .thenReturn(savedUnlike);
                                                    });
                                        });
                                    });
                        }
                    });
        }).doOnError(error -> logger.error("Error unliking entity: {}", error.getMessage()));
    }
}
