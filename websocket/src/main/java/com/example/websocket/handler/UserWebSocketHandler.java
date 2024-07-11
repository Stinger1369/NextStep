package com.example.websocket.handler;

import com.example.websocket.model.User;
import com.example.websocket.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
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

    private final UserService userService;

    public UserWebSocketHandler(UserService userService) {
        this.userService = userService;
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
            default:
                sendErrorMessage(session, "Unknown user message type: " + messageType);
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
                try {
                    logger.info("User creation successful or user already existed: {}", user);
                    session.sendMessage(new TextMessage(String.format(
                            "{\"type\":\"user.create.success\",\"payload\":{\"userId\":\"%s\"}}",
                            user.getId())));
                } catch (IOException e) {
                    logger.error("Error sending creation confirmation", e);
                }
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
        try {
            String result = String
                    .format("{\"type\":\"user.check.result\",\"payload\":{\"exists\":%b}}", exists);
            session.sendMessage(new TextMessage(result));
            logger.info("Sent user check result: {}", result);
        } catch (IOException e) {
            logger.error("Error sending user check result", e);
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage, Throwable error) {
        logger.error("{}: {}", errorMessage, error != null ? error.getMessage() : "N/A", error);
        try {
            session.sendMessage(new TextMessage(
                    String.format("{\"type\":\"error\",\"payload\":{\"message\":\"%s: %s\"}}",
                            errorMessage, error != null ? error.getMessage() : "N/A")));
        } catch (IOException e) {
            logger.error("Error sending error message", e);
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage) {
        sendErrorMessage(session, errorMessage, null);
    }
}
