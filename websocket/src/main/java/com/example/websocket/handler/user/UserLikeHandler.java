package com.example.websocket.handler.user;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class UserLikeHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserLikeHandler.class);
    private static final String USER_ID = "userId";
    private static final String ENTITY_ID = "entityId";
    private static final String ENTITY_TYPE = "entityType";

    private final UserService userService;

    public UserLikeHandler(UserService userService) {
        this.userService = userService;
    }

    public void handleUserLike(WebSocketSession session, JsonNode payload) {
        logger.info("Received user.like request with payload: {}", payload);

        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(ENTITY_ID)
                && payload.hasNonNull(ENTITY_TYPE)) {
            String userId = payload.get(USER_ID).asText();
            String entityId = payload.get(ENTITY_ID).asText();
            String entityType = payload.get(ENTITY_TYPE).asText();

            if (userId.equals(entityId)) {
                WebSocketErrorHandler.sendErrorMessage(session, "Users cannot like themselves");
                return;
            }

            userService.likeEntity(userId, entityId, entityType).subscribe(savedLike -> {
                WebSocketErrorHandler.sendMessage(session, "user.like.success", savedLike);
                logger.info("Entity liked by user: {}", userId);
            }, error -> {
                if ("User has already liked this entity.".equals(error.getMessage())) {
                    WebSocketErrorHandler.sendErrorMessage(session,
                            "You have already liked this entity.");
                } else {
                    WebSocketErrorHandler.sendErrorMessage(session, "Error liking entity", error);
                }
            });
        } else {
            logger.warn("Missing fields in user.like payload: {}", payload);
            WebSocketErrorHandler.sendErrorMessage(session, "Missing fields in user.like payload");
        }
    }
}
