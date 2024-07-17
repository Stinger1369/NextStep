package com.example.websocket.service.user;

import com.example.websocket.model.user.Follow;
import com.example.websocket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserFollowService {

    private static final Logger logger = LoggerFactory.getLogger(UserFollowService.class);
    private final UserRepository userRepository;
    private final UserNotificationService notificationService;

    public UserFollowService(UserRepository userRepository,
            UserNotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Mono<Void> followUser(String userId, String followId, String firstName,
            String lastName) {
        logger.info("User {} following {}", userId, followId);
        return userRepository.findById(userId).flatMap(user -> {
            if (user.isFollowing(followId)) {
                String message = "You are already following this user.";
                return notificationService.sendNotification(userId, message, followId)
                        .then(Mono.error(new IllegalStateException("User already following")));
            }

            Follow follow = new Follow(userId, followId, user.getFirstName(), user.getLastName());
            user.followUser(follow);
            return userRepository.save(user).flatMap(savedUser -> {
                return userRepository.findById(followId).flatMap(followedUser -> {
                    Follow follower = new Follow(userId, followId, firstName, lastName);
                    followedUser.addFollower(follower);
                    return userRepository.save(followedUser).flatMap(savedFollowedUser -> {
                        String message = String.format("User %s %s started following you.",
                                user.getFirstName(), user.getLastName());
                        return notificationService.sendNotification(followId, message, userId)
                                .then();
                    });
                });
            });
        }).doOnError(error -> logger.error("Error following user: {}", error.getMessage()));
    }

    public Mono<Void> unfollowUser(String userId, String followId) {
        logger.info("User {} unfollowing {}", userId, followId);
        return userRepository.findById(userId).flatMap(user -> {
            user.unfollowUser(followId);
            return userRepository.save(user).flatMap(savedUser -> {
                return userRepository.findById(followId).flatMap(followedUser -> {
                    followedUser.removeFollower(userId);
                    return userRepository.save(followedUser).flatMap(savedFollowedUser -> {
                        String message = String.format("User %s %s stopped following you.",
                                user.getFirstName(), user.getLastName());
                        return notificationService.sendNotification(followId, message, userId).then(
                                notificationService.deleteNotificationByContentAndType(followId,
                                        userId, "follow"));
                    });
                });
            });
        }).doOnError(error -> logger.error("Error unfollowing user: {}", error.getMessage()));
    }
}
