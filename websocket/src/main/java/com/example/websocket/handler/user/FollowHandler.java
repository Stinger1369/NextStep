package com.example.websocket.handler.user;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.model.Notification;
import com.example.websocket.service.UserService;
import com.example.websocket.service.NotificationService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class FollowHandler {
        private static final Logger logger = LoggerFactory.getLogger(FollowHandler.class);
        private static final String USER_ID = "userId";
        private static final String FOLLOW_ID = "followId";
        private static final String FIRST_NAME = "firstName";
        private static final String LAST_NAME = "lastName";
        private static final String CONTENT = "content";

        private final UserService userService;
        private final NotificationService notificationService;

        public FollowHandler(UserService userService, NotificationService notificationService) {
                this.userService = userService;
                this.notificationService = notificationService;
        }

        public void handleFollowUser(WebSocketSession session, JsonNode payload) {
                logger.info("Handling user.follow with payload: {}", payload);

                if (payload.hasNonNull(USER_ID) && payload.hasNonNull(FOLLOW_ID)
                                && payload.hasNonNull(FIRST_NAME) && payload.hasNonNull(LAST_NAME)
                                && payload.hasNonNull(CONTENT)) {
                        String userId = payload.get(USER_ID).asText();
                        String followId = payload.get(FOLLOW_ID).asText();
                        String firstName = payload.get(FIRST_NAME).asText();
                        String lastName = payload.get(LAST_NAME).asText();
                        String content = payload.get(CONTENT).asText();

                        logger.info("User with userId: {} is following user with followId: {}",
                                        userId, followId);
                        userService.followUser(userId, followId, firstName, lastName)
                                        .subscribe(unused -> {
                                                WebSocketErrorHandler.sendMessage(session,
                                                                "user.follow.success", null);
                                                logger.info("User with userId: {} followed user with followId: {}",
                                                                userId, followId);

                                                // Create a notification
                                                String message = String.format(
                                                                "User %s started following you.",
                                                                firstName);
                                                Notification notification = new Notification(userId,
                                                                firstName, lastName, message,
                                                                content, "follow");

                                                notificationService.createNotification(notification)
                                                                .subscribe();
                                        }, error -> {
                                                if (error instanceof IllegalStateException
                                                                && "User already following".equals(
                                                                                error.getMessage())) {
                                                        WebSocketErrorHandler.sendMessage(session,
                                                                        "user.follow.already",
                                                                        "You are already following this user.");
                                                } else {
                                                        logger.error("Error following user with userId: {} and followId: {}",
                                                                        userId, followId, error);
                                                        WebSocketErrorHandler.sendErrorMessage(
                                                                        session,
                                                                        "Error following user",
                                                                        error);
                                                }
                                        });
                } else {
                        logger.error("Missing fields in user.follow payload: userId={}, followId={}",
                                        payload.hasNonNull(USER_ID), payload.hasNonNull(FOLLOW_ID));
                        WebSocketErrorHandler.sendErrorMessage(session,
                                        "Missing fields in user.follow payload");
                }
        }

        public void handleUnfollowUser(WebSocketSession session, JsonNode payload) {
                logger.info("Handling user.unfollow with payload: {}", payload);

                if (payload.hasNonNull(USER_ID) && payload.hasNonNull(FOLLOW_ID)) {
                        String userId = payload.get(USER_ID).asText();
                        String followId = payload.get(FOLLOW_ID).asText();
                        logger.info("User with userId: {} is unfollowing user with followId: {}",
                                        userId, followId);
                        userService.unfollowUser(userId, followId).subscribe(unused -> {
                                WebSocketErrorHandler.sendMessage(session, "user.unfollow.success",
                                                null);
                                logger.info("User with userId: {} unfollowed user with followId: {}",
                                                userId, followId);

                                // Create a notification
                                String message = String.format("User %s stopped following you.",
                                                userId);
                                Notification notification = new Notification(followId, "System",
                                                "Notification", message, userId, "unfollow");
                                notificationService.createNotification(notification).subscribe();
                        }, error -> {
                                logger.error("Error unfollowing user with userId: {} and followId: {}",
                                                userId, followId, error);
                                WebSocketErrorHandler.sendErrorMessage(session,
                                                "Error unfollowing user", error);
                        });
                } else {
                        logger.error("Missing fields in user.unfollow payload: userId={}, followId={}",
                                        payload.hasNonNull(USER_ID), payload.hasNonNull(FOLLOW_ID));
                        WebSocketErrorHandler.sendErrorMessage(session,
                                        "Missing fields in user.unfollow payload");
                }
        }
}
