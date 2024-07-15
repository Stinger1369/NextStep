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
        if (payload.hasNonNull(EMAIL)) {
            String email = payload.get(EMAIL).asText();
            logger.info("Checking if user with email {} exists", email);
            userService.getUserByEmail(email).subscribe(existingUser -> {
                boolean userExists = existingUser != null;
                logger.info("User existence check for {}: {}", email, userExists);
                WebSocketErrorHandler.sendMessage(session, "user.check.result",
                        Map.of("exists", userExists));
            }, error -> {
                logger.error("Error checking user existence", error);
                WebSocketErrorHandler.sendMessage(session, "user.check.result",
                        Map.of("exists", false));
            });
        } else {
            logger.warn("Missing fields in user.check payload");
            WebSocketErrorHandler.sendErrorMessage(session, "Missing fields in user.check payload");
        }
    }
}
