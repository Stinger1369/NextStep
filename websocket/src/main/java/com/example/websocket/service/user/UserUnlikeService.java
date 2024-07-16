package com.example.websocket.service.user;

import com.example.websocket.model.Like;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.LikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserUnlikeService {

    private static final Logger logger = LoggerFactory.getLogger(UserUnlikeService.class);
    private final UserRepository userRepository;
    private final LikeService likeService;
    private final UserNotificationService notificationService;

    public UserUnlikeService(UserRepository userRepository, LikeService likeService,
            UserNotificationService notificationService) {
        this.userRepository = userRepository;
        this.likeService = likeService;
        this.notificationService = notificationService;
    }

    public Mono<Void> unlikeEntity(String userId, String entityId, String entityType) {
        logger.info("User {} unliking entity {} of type {}", userId, entityId, entityType);
        return userRepository.findById(userId).flatMap(user -> {
            Like like =
                    new Like(userId, entityId, entityType, user.getFirstName(), user.getLastName());
            return likeService.unlikeEntity(userId, entityId, entityType)
                    .flatMap(unused -> userRepository.findById(userId).flatMap(likeUser -> {
                        likeUser.removeLike(like);
                        return userRepository.save(likeUser);
                    }).flatMap(updatedUser -> {
                        return userRepository.findById(entityId).flatMap(targetUser -> {
                            String message = String.format("User %s %s unliked your profile.",
                                    user.getFirstName(), user.getLastName());
                            return notificationService.sendNotification(entityId, message, entityId)
                                    .then();
                        });
                    }));
        }).doOnError(error -> logger.error("Error unliking entity: {}", error.getMessage()));
    }
}
