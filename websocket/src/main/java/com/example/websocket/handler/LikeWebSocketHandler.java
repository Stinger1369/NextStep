package com.example.websocket.handler;

import com.example.websocket.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Component
public class LikeWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(LikeWebSocketHandler.class);
    private static final String USER_ID = "userId";
    private static final String ENTITY_ID = "entityId";
    private static final String ENTITY_TYPE = "entityType";

    private final UserService userService;
    private final ObjectMapper objectMapper;

    public LikeWebSocketHandler(UserService userService, ObjectMapper objectMapper) {
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        logger.info("Handling message of type: {}", messageType);
        switch (messageType) {
            case "like.create":
                handleLikeCreate(session, payload);
                break;
            case "like.delete":
                handleLikeDelete(session, payload);
                break;
            default:
                WebSocketErrorHandler.sendErrorMessage(session,
                        "Unknown like message type: " + messageType);
        }
    }

    private void handleLikeCreate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(ENTITY_ID)
                && payload.hasNonNull(ENTITY_TYPE)) {
            String userId = payload.get(USER_ID).asText();
            String entityId = payload.get(ENTITY_ID).asText();
            String entityType = payload.get(ENTITY_TYPE).asText();

            userService.likeEntity(userId, entityId, entityType).subscribe(savedLike -> {
                try {
                    String result = objectMapper.writeValueAsString(savedLike);
                    session.sendMessage(new TextMessage(result));
                } catch (IOException e) {
                    logger.error("Error sending like creation response", e);
                }
            }, error -> {
                if ("User has already liked this entity.".equals(error.getMessage())) {
                    WebSocketErrorHandler.sendErrorMessage(session,
                            "You have already liked this entity.");
                } else {
                    WebSocketErrorHandler.sendErrorMessage(session, "Error creating like", error);
                }
            });
        } else {
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in like.create payload");
        }
    }

    private void handleLikeDelete(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(ENTITY_ID)
                && payload.hasNonNull(ENTITY_TYPE)) {
            String userId = payload.get(USER_ID).asText();
            String entityId = payload.get(ENTITY_ID).asText();
            String entityType = payload.get(ENTITY_TYPE).asText();

            userService.unlikeEntity(userId, entityId, entityType).subscribe(unused -> {
                try {
                    String result = "{\"type\":\"like.delete.success\"}";
                    session.sendMessage(new TextMessage(result));
                } catch (IOException e) {
                    logger.error("Error sending like deletion response", e);
                }
            }, error -> WebSocketErrorHandler.sendErrorMessage(session, "Error deleting like",
                    error));
        } else {
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in like.delete payload");
        }
    }
}
