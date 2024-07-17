package com.example.websocket.handler.user;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class UserUnlikeHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserUnlikeHandler.class);
    private static final String USER_ID = "userId";
    private static final String ENTITY_ID = "entityId";
    private static final String ENTITY_TYPE = "entityType";

    private final UserService userService;

    public UserUnlikeHandler(UserService userService) {
        this.userService = userService;
    }

    public void handleUserUnlike(WebSocketSession session, JsonNode payload) {
        logger.info("Received user.unlike request with payload: {}", payload);

        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(ENTITY_ID)
                && payload.hasNonNull(ENTITY_TYPE)) {
            String userId = payload.get(USER_ID).asText();
            String entityId = payload.get(ENTITY_ID).asText();
            String entityType = payload.get(ENTITY_TYPE).asText();

            userService.unlikeEntity(userId, entityId, entityType).subscribe(savedUnlike -> {
                WebSocketErrorHandler.sendMessage(session, "user.unlike.success", savedUnlike);
                logger.info("Entity unliked by user: {}", userId);
            }, error -> {
                if ("User has already unliked this entity.".equals(error.getMessage())) {
                    WebSocketErrorHandler.sendErrorMessage(session,
                            "You have already unliked this entity.");
                } else {
                    WebSocketErrorHandler.sendErrorMessage(session, "Error unliking entity", error);
                }
            });
        } else {
            logger.warn("Missing fields in user.unlike payload: {}", payload);
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in user.unlike payload");
        }
    }
}
