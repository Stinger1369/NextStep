package com.example.websocket.handler;

import com.example.websocket.service.UserService;
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
public class LikeWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(LikeWebSocketHandler.class);
    private final UserService userService;
    private final ObjectMapper objectMapper;

    public LikeWebSocketHandler(UserService userService, ObjectMapper objectMapper) {
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        switch (messageType) {
            case "like.create":
                handleLikeCreate(session, payload);
                break;
            case "like.delete":
                handleLikeDelete(session, payload);
                break;
            default:
                sendErrorMessage(session, "Unknown like message type: " + messageType);
        }
    }

    private void handleLikeCreate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull("userId") && payload.hasNonNull("entityId")
                && payload.hasNonNull("entityType")) {
            String userId = payload.get("userId").asText();
            String entityId = payload.get("entityId").asText();
            String entityType = payload.get("entityType").asText();

            userService.likeEntity(userId, entityId, entityType).subscribe(savedLike -> {
                try {
                    String result = objectMapper.writeValueAsString(savedLike);
                    session.sendMessage(new TextMessage(result));
                } catch (IOException e) {
                    logger.error("Error sending like creation response", e);
                }
            }, error -> sendErrorMessage(session, "Error creating like", error));
        } else {
            sendErrorMessage(session, "Missing fields in like.create payload");
        }
    }

    private void handleLikeDelete(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull("userId") && payload.hasNonNull("entityId")
                && payload.hasNonNull("entityType")) {
            String userId = payload.get("userId").asText();
            String entityId = payload.get("entityId").asText();
            String entityType = payload.get("entityType").asText();

            userService.unlikeEntity(userId, entityId, entityType).subscribe(unused -> {
                try {
                    String result = "{\"type\":\"like.delete.success\"}";
                    session.sendMessage(new TextMessage(result));
                } catch (IOException e) {
                    logger.error("Error sending like deletion response", e);
                }
            }, error -> sendErrorMessage(session, "Error deleting like", error));
        } else {
            sendErrorMessage(session, "Missing fields in like.delete payload");
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage, Throwable error) {
        logger.error("{}: {}", errorMessage, error != null ? error.getMessage() : "N/A", error);
        try {
            String result =
                    objectMapper.writeValueAsString(new WebSocketResponse("error", errorMessage));
            session.sendMessage(new TextMessage(result));
        } catch (IOException e) {
            logger.error("Error sending error message", e);
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage) {
        sendErrorMessage(session, errorMessage, null);
    }

    static class WebSocketResponse {
        private String type;
        private String payload;

        public WebSocketResponse(String type, String payload) {
            this.type = type;
            this.payload = payload;
        }

        // Getters and setters
    }
}
