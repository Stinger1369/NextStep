package com.example.websocket.handler.user;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class UserCheckHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserCheckHandler.class);
    private static final String EMAIL = "email";

    private final UserService userService;

    public UserCheckHandler(UserService userService) {
        this.userService = userService;
    }

    public void handleUserCheck(WebSocketSession session, JsonNode payload) {
        logger.info("Received user.check request with payload: {}", payload);

        if (payload.hasNonNull(EMAIL)) {
            String email = payload.get(EMAIL).asText();
            logger.info("Checking if user with email {} exists", email);
            userService.getUserByEmail(email).subscribe(existingUser -> {
                boolean userExists = existingUser != null;
                logger.info("User existence check for {}: {}", email, userExists);
                WebSocketErrorHandler.sendMessage(session, "user.check.result",
                        Map.of("exists", userExists));
                logger.info("Sent user.check.result for email {}: {}", email, userExists);
            }, error -> {
                logger.error("Error checking user existence for email: {}", email, error);
                WebSocketErrorHandler.sendMessage(session, "user.check.result",
                        Map.of("exists", false));
                logger.info("Sent user.check.result for email {}: false", email);
            });
        } else {
            logger.warn("Missing email field in user.check payload: {}", payload);
            WebSocketErrorHandler.sendErrorMessage(session, "Missing fields in user.check payload");
        }
    }
}
