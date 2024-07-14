package com.example.websocket.handler;

import com.example.websocket.service.UserService;
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
    private static final String ERROR_PROCESSING_JSON = "Error processing user data to JSON";

    private final UserService userService;
    private final ObjectMapper objectMapper;

    public UserWebSocketHandler(UserService userService, ObjectMapper objectMapper) {
        this.userService = userService;
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
}
