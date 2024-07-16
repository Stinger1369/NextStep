package com.example.websocket.handler.user;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import reactor.core.publisher.Mono;

@Component
public class UserFetchHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserFetchHandler.class);
    private static final String USER_ID = "userId";
    private static final String ERROR_PROCESSING_JSON = "Error processing user data to JSON";

    private final UserService userService;
    private final ObjectMapper objectMapper;

    public UserFetchHandler(UserService userService, ObjectMapper objectMapper) {
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    public void handleGetUserById(WebSocketSession session, JsonNode payload) {
        logger.info("Received user.getById request with payload: {}", payload);

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
                    WebSocketErrorHandler.sendErrorMessage(session, ERROR_PROCESSING_JSON, e);
                    return Mono.empty();
                }
                WebSocketErrorHandler.sendMessage(session, "user.getById.success", userJson);
                logger.info("Sent user.getById.success for userId {}", userId);
                return Mono.just(user);
            }).onErrorResume(error -> {
                logger.error("Error fetching user data for userId {}: {}", userId,
                        error.getMessage());
                WebSocketErrorHandler.sendErrorMessage(session, "Error fetching user data", error);
                return Mono.empty();
            }).subscribe();
        } else {
            logger.warn("Missing fields in user.getById payload: {}", payload);
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in user.getById payload");
        }
    }

    public void handleGetCurrentUser(WebSocketSession session, JsonNode payload) {
        logger.info("Received user.getCurrent request with payload: {}", payload);

        if (payload.hasNonNull(USER_ID)) {
            String userId = payload.get(USER_ID).asText();
            logger.info("Fetching current user with ID {}", userId);
            userService.getUserById(userId).flatMap(user -> {
                logger.info("Current user fetched: {}", user);
                String userJson;
                try {
                    userJson = objectMapper.writeValueAsString(user);
                } catch (JsonProcessingException e) {
                    logger.error(ERROR_PROCESSING_JSON, e);
                    WebSocketErrorHandler.sendErrorMessage(session, ERROR_PROCESSING_JSON, e);
                    return Mono.empty();
                }
                WebSocketErrorHandler.sendMessage(session, "user.getCurrent.success", userJson);
                logger.info("Sent user.getCurrent.success for userId {}", userId);
                return Mono.just(user);
            }).onErrorResume(error -> {
                logger.error("Error fetching current user data for userId {}: {}", userId,
                        error.getMessage());
                WebSocketErrorHandler.sendErrorMessage(session, "Error fetching user data", error);
                return Mono.empty();
            }).subscribe();
        } else {
            logger.warn("Missing fields in user.getCurrent payload: {}", payload);
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in user.getCurrent payload");
        }
    }
}
