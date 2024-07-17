package com.example.websocket.service.user;

import com.example.websocket.model.Notification;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(UserNotificationService.class);
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public UserNotificationService(UserRepository userRepository,
            NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Mono<Void> sendNotification(String userId, String message, String entityId) {
        logger.info("Sending notification to user {}: {}", userId, message);
        return userRepository.findById(userId).flatMap(user -> {
            // Check if notification already exists and delete it
            return deleteNotificationByContentAndType(userId, entityId, "follow")
                    .then(notificationService.createNotification(new Notification(user.getId(),
                            user.getFirstName(), user.getLastName(), message, entityId)))
                    .flatMap(savedNotification -> {
                        user.addNotification(savedNotification);
                        return userRepository.save(user)
                                .doOnSuccess(saved -> logger.info("Notification sent: {}", saved));
                    });
        }).then().doOnError(
                error -> logger.error("Error sending notification: {}", error.getMessage()));
    }

    public Mono<Void> deleteNotificationByContentAndType(String userId, String content,
            String type) {
        return notificationService.deleteNotificationByContentAndType(userId, content, type);
    }
}
