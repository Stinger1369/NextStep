package com.example.websocket.handler.message;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.MessageService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Map;

@Component
public class MessageLikeHandler {
    private static final Logger logger = LoggerFactory.getLogger(MessageLikeHandler.class);
    private static final String MESSAGE_ID = "messageId";
    private static final String USER_ID = "userId";
    private static final String USER_FIRST_NAME = "userFirstName";
    private static final String USER_LAST_NAME = "userLastName";
    private static final String PAYLOAD = "payload";

    private final MessageService messageService;
    private final ObjectMapper objectMapper;

    public MessageLikeHandler(MessageService messageService, ObjectMapper objectMapper) {
        this.messageService = messageService;
        this.objectMapper = objectMapper;
    }

    public void handleLikeMessage(WebSocketSession session, JsonNode payload) {
        String messageId = payload.hasNonNull(MESSAGE_ID) ? payload.get(MESSAGE_ID).asText() : null;
        String userId = payload.hasNonNull(USER_ID) ? payload.get(USER_ID).asText() : null;
        String userFirstName =
                payload.hasNonNull(USER_FIRST_NAME) ? payload.get(USER_FIRST_NAME).asText() : null;
        String userLastName =
                payload.hasNonNull(USER_LAST_NAME) ? payload.get(USER_LAST_NAME).asText() : null;

        if (messageId == null || userId == null || userFirstName == null || userLastName == null) {
            logger.warn("Missing fields in {} payload", MESSAGE_ID);
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in " + MESSAGE_ID + " payload");
            return;
        }

        logger.info("Liking message with ID: {} by user: {} {} ({})", messageId, userFirstName,
                userLastName, userId);

        messageService.likeMessage(messageId, userId, userFirstName, userLastName)
                .subscribe(likedMessage -> {
                    try {
                        String result = objectMapper
                                .writeValueAsString(Map.of("type", "message.like.success", PAYLOAD,
                                        Map.of(MESSAGE_ID, likedMessage.getId())));
                        session.sendMessage(new TextMessage(result));
                        logger.info("Message liked successfully: {}", likedMessage);
                    } catch (IOException e) {
                        logger.error("Error sending message like confirmation", e);
                    }
                }, error -> {
                    logger.error("Error liking message with ID: {}", messageId, error);
                    WebSocketErrorHandler.sendErrorMessage(session, "Error liking message", error);
                });
    }
}
