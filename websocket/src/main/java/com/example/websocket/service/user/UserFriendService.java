package com.example.websocket.service.user;

import com.example.websocket.model.user.FriendInfo;
import com.example.websocket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserFriendService {

    private static final Logger logger = LoggerFactory.getLogger(UserFriendService.class);
    private final UserRepository userRepository;
    private final UserNotificationService notificationService;

    public UserFriendService(UserRepository userRepository,
            UserNotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Mono<Void> sendFriendRequest(String userId, String friendId) {
        logger.info("Sending friend request from {} to {}", userId, friendId);
        return userRepository.findById(userId).flatMap(user -> {
            return userRepository.findById(friendId).flatMap(friend -> {
                if (user.getFriendRequests().stream().anyMatch(fr -> fr.getId().equals(friendId))) {
                    return Mono.error(new Exception("Friend request already sent."));
                }
                if (user.getFriends().stream().anyMatch(f -> f.getId().equals(friendId))) {
                    return Mono.error(new Exception("User is already your friend."));
                }
                FriendInfo friendInfo =
                        new FriendInfo(friendId, friend.getFirstName(), friend.getLastName());
                user.addFriendRequest(friendInfo);
                return userRepository.save(user).flatMap(savedUser -> {
                    String message = String.format("User %s %s sent you a friend request.",
                            user.getFirstName(), user.getLastName());
                    return notificationService.sendNotification(friendId, message, userId);
                });
            });
        }).doOnError(error -> logger.error("Error sending friend request: {}", error.getMessage()));
    }

    public Mono<Void> acceptFriendRequest(String userId, String friendId) {
        logger.info("Accepting friend request from {} by {}", friendId, userId);
        return userRepository.findById(userId).flatMap(user -> {
            return userRepository.findById(friendId).flatMap(friend -> {
                if (user.getFriends().stream().anyMatch(f -> f.getId().equals(friendId))) {
                    return Mono.error(new Exception("User is already your friend."));
                }
                FriendInfo friendInfo =
                        new FriendInfo(friendId, friend.getFirstName(), friend.getLastName());
                user.removeFriendRequest(friendInfo);
                user.addFriend(friendInfo);
                return userRepository.save(user).flatMap(savedUser -> {
                    FriendInfo userInfo =
                            new FriendInfo(userId, user.getFirstName(), user.getLastName());
                    friend.removeFriendRequest(userInfo);
                    friend.addFriend(userInfo);
                    return userRepository.save(friend).flatMap(savedFriend -> {
                        String message = String.format("User %s %s accepted your friend request.",
                                user.getFirstName(), user.getLastName());
                        return notificationService.sendNotification(friendId, message, userId)
                                .then();
                    });
                });
            });
        }).doOnError(
                error -> logger.error("Error accepting friend request: {}", error.getMessage()));
    }

    public Mono<Void> declineFriendRequest(String userId, String friendId) {
        logger.info("Declining friend request from {} by {}", friendId, userId);
        return userRepository.findById(userId).flatMap(user -> {
            FriendInfo friendInfo = new FriendInfo(friendId, "", ""); // name not necessary here
            user.removeFriendRequest(friendInfo);
            return userRepository.save(user).flatMap(savedUser -> {
                return userRepository.findById(friendId).flatMap(friend -> {
                    friend.removeFriendRequest(new FriendInfo(userId, "", ""));
                    return userRepository.save(friend).flatMap(savedFriend -> {
                        String message = String.format("User %s %s declined your friend request.",
                                user.getFirstName(), user.getLastName());
                        return notificationService.sendNotification(friendId, message, userId)
                                .then();
                    });
                });
            });
        }).doOnError(
                error -> logger.error("Error declining friend request: {}", error.getMessage()));
    }

    public Mono<Void> removeFriend(String userId, String friendId) {
        logger.info("Removing friend {} by {}", friendId, userId);
        return userRepository.findById(userId).flatMap(user -> {
            FriendInfo friendInfo = new FriendInfo(friendId, "", ""); // name not necessary here
            user.removeFriend(friendInfo);
            return userRepository.save(user).flatMap(savedUser -> {
                return userRepository.findById(friendId).flatMap(friend -> {
                    FriendInfo userInfo =
                            new FriendInfo(userId, user.getFirstName(), user.getLastName());
                    friend.removeFriend(userInfo);
                    return userRepository.save(friend).flatMap(savedFriend -> {
                        String message = String.format("User %s %s removed you from friends.",
                                user.getFirstName(), user.getLastName());
                        return notificationService.sendNotification(friendId, message, userId)
                                .then();
                    });
                });
            });
        }).doOnError(error -> logger.error("Error removing friend: {}", error.getMessage()));
    }
}
