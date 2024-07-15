package com.example.websocket.handler.user;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import reactor.core.publisher.Mono;

@Component
public class UserCreationHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserCreationHandler.class);
    private static final String EMAIL = "email";
    private static final String FIRST_NAME = "firstName";
    private static final String LAST_NAME = "lastName";

    private final UserService userService;

    public UserCreationHandler(UserService userService) {
        this.userService = userService;
    }

    public void handleUserCreate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(EMAIL) && payload.hasNonNull(FIRST_NAME)
                && payload.hasNonNull(LAST_NAME)) {
            String email = payload.get(EMAIL).asText();
            String firstName = payload.get(FIRST_NAME).asText();
            String lastName = payload.get(LAST_NAME).asText();
            logger.info("Checking if user with email {} exists", email);
            userService.createUserIfNotExists(email, firstName, lastName).flatMap(user -> {
                logger.info("User creation successful or user already existed: {}", user);
                WebSocketErrorHandler.sendMessage(session, "user.create.success",
                        Map.of("userId", user.getId()));
                return Mono.just(user);
            }).onErrorResume(error -> {
                logger.error("Error during user creation: {}", error.getMessage());
                WebSocketErrorHandler.sendErrorMessage(session, "Error creating user", error);
                return Mono.empty();
            }).subscribe();
        } else {
            logger.warn("Missing fields in user.create payload");
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in user.create payload");
        }
    }
}
