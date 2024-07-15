package com.example.websocket.handler.user;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.UserService;
import com.example.websocket.service.NotificationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.websocket.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import reactor.core.publisher.Mono;

@Component
public class UserUnlikeHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserUnlikeHandler.class);
    private static final String USER_ID = "userId";
    private static final String ENTITY_ID = "entityId";
    private static final String ENTITY_TYPE = "entityType";
    private static final String ERROR_PROCESSING_JSON = "Error processing user data to JSON";

    private final UserService userService;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    public UserUnlikeHandler(UserService userService, NotificationService notificationService,
            ObjectMapper objectMapper) {
        this.userService = userService;
        this.notificationService = notificationService;
        this.objectMapper = objectMapper;
    }

    public void handleUserUnlike(WebSocketSession session, JsonNode payload) {
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
                WebSocketErrorHandler.sendMessage(session, "user.unlike.success", null);
                logger.info("Entity unliked by user: {}", userId);
            }, error -> WebSocketErrorHandler.sendErrorMessage(session, "Error unliking entity",
                    error));
        } else {
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in user.unlike payload");
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
                WebSocketErrorHandler.sendErrorMessage(session, ERROR_PROCESSING_JSON, e);
                return Mono.empty();
            }
            WebSocketErrorHandler.sendMessage(session, "notification.new", savedNotification);
            return Mono.empty();
        });
    }
}
