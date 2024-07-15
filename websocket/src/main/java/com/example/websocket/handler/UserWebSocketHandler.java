package com.example.websocket.handler;

import com.example.websocket.handler.user.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;


@Component
public class UserWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserWebSocketHandler.class);

    private final UserCreationHandler userCreationHandler;
    private final UserCheckHandler userCheckHandler;
    private final UserLikeHandler userLikeHandler;
    private final UserUnlikeHandler userUnlikeHandler;
    private final UserFetchHandler userFetchHandler;

    public UserWebSocketHandler(UserCreationHandler userCreationHandler,
            UserCheckHandler userCheckHandler, UserLikeHandler userLikeHandler,
            UserUnlikeHandler userUnlikeHandler, UserFetchHandler userFetchHandler) {
        this.userCreationHandler = userCreationHandler;
        this.userCheckHandler = userCheckHandler;
        this.userLikeHandler = userLikeHandler;
        this.userUnlikeHandler = userUnlikeHandler;
        this.userFetchHandler = userFetchHandler;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        logger.info("Handling message of type: {}", messageType);
        switch (messageType) {
            case "user.create":
                userCreationHandler.handleUserCreate(session, payload);
                break;
            case "user.check":
                userCheckHandler.handleUserCheck(session, payload);
                break;
            case "user.getById":
                userFetchHandler.handleGetUserById(session, payload);
                break;
            case "user.getCurrent":
                userFetchHandler.handleGetCurrentUser(session, payload);
                break;
            case "user.like":
                userLikeHandler.handleUserLike(session, payload);
                break;
            case "user.unlike":
                userUnlikeHandler.handleUserUnlike(session, payload);
                break;
            default:
                WebSocketErrorHandler.sendErrorMessage(session,
                        "Unknown user message type: " + messageType);
        }
    }
}
