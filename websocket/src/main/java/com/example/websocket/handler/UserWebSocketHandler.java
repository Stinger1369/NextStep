package com.example.websocket.handler;

import com.example.websocket.service.UserService;
import com.example.websocket.model.Notification;
import com.example.websocket.service.CommentService;
import com.example.websocket.service.NotificationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.io.IOException;

@Component
public class UserWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserWebSocketHandler.class);
    private static final String EMAIL = "email";
    private static final String FIRST_NAME = "firstName";
    private static final String LAST_NAME = "lastName";
    private static final String USER_ID = "userId";
    private static final String COMMENT_ID = "commentId";
    private static final String ENTITY_ID = "entityId";
    private static final String ENTITY_TYPE = "entityType";
    private static final String ERROR_PROCESSING_JSON = "Error processing user data to JSON";

    private final UserService userService;
    private final CommentService commentService;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    public UserWebSocketHandler(UserService userService, CommentService commentService,
            NotificationService notificationService, ObjectMapper objectMapper) {
        this.userService = userService;
        this.commentService = commentService;
        this.notificationService = notificationService;
        this.objectMapper = objectMapper;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        logger.info("Handling message of type: {}", messageType);
        switch (messageType) {
            case "user.create":
                handleUserCreate(session, payload);
                break;
            case "user.check":
                handleUserCheck(session, payload);
                break;
            case "user.getById":
                handleGetUserById(session, payload);
                break;
            case "user.getCurrent":
                handleGetCurrentUser(session, payload);
                break;
            case "user.like":
                handleUserLike(session, payload);
                break;
            case "user.unlike":
                handleUserUnlike(session, payload);
                break;
            case "comment.like":
                handleCommentLike(session, payload);
                break;
            case "comment.unlike":
                handleCommentUnlike(session, payload);
                break;
            default:
                sendErrorMessage(session, "Unknown user message type: " + messageType);
        }
    }

    private void handleGetCurrentUser(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID)) {
            String userId = payload.get(USER_ID).asText();
            logger.info("Fetching user with ID {}", userId);
            userService.getUserById(userId).flatMap(user -> {
                logger.info("User fetched: {}", user);
                String userJson;
                try {
                    userJson = objectMapper.writeValueAsString(user);
                } catch (JsonProcessingException e) {
                    logger.error(ERROR_PROCESSING_JSON, e);
                    sendErrorMessage(session, ERROR_PROCESSING_JSON, e);
                    return Mono.empty();
                }
                sendMessage(session,
                        new TextMessage(String.format(
                                "{\"type\":\"user.getCurrent.success\",\"payload\":%s}",
                                userJson)));
                return Mono.just(user);
            }).onErrorResume(error -> {
                logger.error("Error fetching user data: {}", error.getMessage());
                sendErrorMessage(session, "Error fetching user data", error);
                return Mono.empty();
            }).subscribe();
        } else {
            logger.warn("Missing fields in user.getCurrent payload");
            sendErrorMessage(session, "Missing fields in user.getCurrent payload", null);
        }
    }

    private void handleGetUserById(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID)) {
            String userId = payload.get(USER_ID).asText();
            logger.info("Fetching user with ID {}", userId);
            userService.getUserById(userId).flatMap(user -> {
                logger.info("User fetched: {}", user);
                String userJson;
                try {
                    userJson = objectMapper.writeValueAsString(user);
                } catch (JsonProcessingException e) {
                    logger.error(ERROR_PROCESSING_JSON, e);
                    sendErrorMessage(session, ERROR_PROCESSING_JSON, e);
                    return Mono.empty();
                }
                sendMessage(session, new TextMessage(String
                        .format("{\"type\":\"user.getById.success\",\"payload\":%s}", userJson)));
                return Mono.just(user);
            }).onErrorResume(error -> {
                logger.error("Error fetching user data: {}", error.getMessage());
                sendErrorMessage(session, "Error fetching user data", error);
                return Mono.empty();
            }).subscribe();
        } else {
            logger.warn("Missing fields in user.getById payload");
            sendErrorMessage(session, "Missing fields in user.getById payload", null);
        }
    }

    private void handleUserCreate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(EMAIL) && payload.hasNonNull(FIRST_NAME)
                && payload.hasNonNull(LAST_NAME)) {
            String email = payload.get(EMAIL).asText();
            String firstName = payload.get(FIRST_NAME).asText();
            String lastName = payload.get(LAST_NAME).asText();
            logger.info("Checking if user with email {} exists", email);
            userService.createUserIfNotExists(email, firstName, lastName).flatMap(user -> {
                logger.info("User creation successful or user already existed: {}", user);
                sendMessage(session, new TextMessage(String.format(
                        "{\"type\":\"user.create.success\",\"payload\":{\"userId\":\"%s\"}}",
                        user.getId())));
                return Mono.just(user);
            }).onErrorResume(error -> {
                logger.error("Error during user creation: {}", error.getMessage());
                sendErrorMessage(session, "Error creating user", error);
                return Mono.empty();
            }).subscribe();
        } else {
            logger.warn("Missing fields in user.create payload");
            sendErrorMessage(session, "Missing fields in user.create payload", null);
        }
    }

    private void handleUserCheck(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(EMAIL)) {
            String email = payload.get(EMAIL).asText();
            logger.info("Checking if user with email {} exists", email);
            userService.getUserByEmail(email).subscribe(existingUser -> {
                boolean userExists = existingUser != null;
                logger.info("User existence check for {}: {}", email, userExists);
                sendUserCheckResult(session, userExists);
            }, error -> {
                logger.error("Error checking user existence", error);
                sendUserCheckResult(session, false);
            });
        } else {
            logger.warn("Missing fields in user.check payload");
            sendErrorMessage(session, "Missing fields in user.check payload", null);
        }
    }

    private void sendUserCheckResult(WebSocketSession session, boolean exists) {
        String result = String
                .format("{\"type\":\"user.check.result\",\"payload\":{\"exists\":%b}}", exists);
        sendMessage(session, new TextMessage(result));
        logger.info("Sent user check result: {}", result);
    }

    private void handleCommentLike(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(COMMENT_ID)) {
            String userId = payload.get(USER_ID).asText();
            String commentId = payload.get(COMMENT_ID).asText();

            userService.getUserById(userId).flatMap(
                    user -> commentService.likeComment(commentId, userId).flatMap(savedComment -> {
                        String message = String.format("User %s %s liked your comment.",
                                user.getFirstName(), user.getLastName());
                        return sendNotification(userId, user.getFirstName(), user.getLastName(),
                                message, savedComment.getContent(), session);
                    })).subscribe(savedComment -> {
                        String result = "{\"type\":\"comment.like.success\",\"payload\":{}}";
                        sendMessage(session, new TextMessage(result));
                        logger.info("Comment liked by user: {}", userId);
                    }, error -> sendErrorMessage(session, "Error liking comment", error));
        } else {
            sendErrorMessage(session, "Missing fields in comment.like payload", null);
        }
    }

    private void handleCommentUnlike(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(COMMENT_ID)) {
            String userId = payload.get(USER_ID).asText();
            String commentId = payload.get(COMMENT_ID).asText();

            commentService.unlikeComment(commentId, userId).subscribe(savedComment -> {
                String result = "{\"type\":\"comment.unlike.success\",\"payload\":{}}";
                sendMessage(session, new TextMessage(result));
                logger.info("Comment unliked by user: {}", userId);
            }, error -> sendErrorMessage(session, "Error unliking comment", error));
        } else {
            sendErrorMessage(session, "Missing fields in comment.unlike payload", null);
        }
    }

    private void handleUserLike(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(ENTITY_ID)
                && payload.hasNonNull(ENTITY_TYPE)) {
            String userId = payload.get(USER_ID).asText();
            String entityId = payload.get(ENTITY_ID).asText();
            String entityType = payload.get(ENTITY_TYPE).asText();

            userService.getUserById(userId).flatMap(user -> {
                return userService.likeEntity(userId, entityId, entityType).flatMap(savedLike -> {
                    String message = String.format("User %s %s liked your %s.", user.getFirstName(),
                            user.getLastName(), entityType);
                    return sendNotification(userId, user.getFirstName(), user.getLastName(),
                            message, entityId, session);
                });
            }).subscribe(savedLike -> {
                sendSuccessMessage(session, "user.like.success", savedLike);
                logger.info("Entity liked by user: {}", userId);
            }, error -> sendErrorMessage(session, "Error liking entity", error));
        } else {
            sendErrorMessage(session, "Missing fields in user.like payload");
        }
    }

    private void handleUserUnlike(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(ENTITY_ID)
                && payload.hasNonNull(ENTITY_TYPE)) {
            String userId = payload.get(USER_ID).asText();
            String entityId = payload.get(ENTITY_ID).asText();
            String entityType = payload.get(ENTITY_TYPE).asText();

            userService.getUserById(userId).flatMap(user -> {
                return userService.unlikeEntity(userId, entityId, entityType).flatMap(unused -> {
                    String message = String.format("User %s %s unliked your %s.",
                            user.getFirstName(), user.getLastName(), entityType);
                    return sendNotification(userId, user.getFirstName(), user.getLastName(),
                            message, entityId, session);
                });
            }).subscribe(unused -> {
                sendSuccessMessage(session, "user.unlike.success", null);
                logger.info("Entity unliked by user: {}", userId);
            }, error -> sendErrorMessage(session, "Error unliking entity", error));
        } else {
            sendErrorMessage(session, "Missing fields in user.unlike payload");
        }
    }

    private Mono<Void> sendNotification(String userId, String firstName, String lastName,
            String message, String content, WebSocketSession session) {
        Notification notification = new Notification(userId, firstName, lastName, message, content);
        return notificationService.createNotification(notification).flatMap(savedNotification -> {
            String notificationJson;
            try {
                notificationJson = objectMapper.writeValueAsString(savedNotification);
            } catch (JsonProcessingException e) {
                logger.error(ERROR_PROCESSING_JSON, e);
                sendErrorMessage(session, ERROR_PROCESSING_JSON, e);
                return Mono.empty();
            }
            sendMessage(session, new TextMessage(String
                    .format("{\"type\":\"notification.new\",\"payload\":%s}", notificationJson)));
            return Mono.empty();
        });
    }

    private void sendSuccessMessage(WebSocketSession session, String messageType, Object payload) {
        try {
            String result =
                    objectMapper.writeValueAsString(new WebSocketResponse(messageType, payload));
            session.sendMessage(new TextMessage(result));
        } catch (IOException e) {
            logger.error("Error sending success message", e);
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage, Throwable error) {
        logger.error("{}: {}", errorMessage, error != null ? error.getMessage() : "N/A", error);
        sendMessage(session,
                new TextMessage(
                        String.format("{\"type\":\"error\",\"payload\":{\"message\":\"%s: %s\"}}",
                                errorMessage, error != null ? error.getMessage() : "N/A")));
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage) {
        sendErrorMessage(session, errorMessage, null);
    }

    private void sendMessage(WebSocketSession session, TextMessage message) {
        if (session.isOpen()) {
            try {
                session.sendMessage(message);
            } catch (IOException e) {
                logger.error("Error sending message", e);
            }
        } else {
            logger.warn("Attempted to send message to closed session: {}", message.getPayload());
        }
    }

    static class WebSocketResponse {
        private String type;
        private Object payload;

        public WebSocketResponse(String type, Object payload) {
            this.type = type;
            this.payload = payload;
        }

        // Getters and setters
    }

    static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        // Getters and setters
    }
}
