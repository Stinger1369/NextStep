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
public class MessageUnlikeHandler {
    private static final Logger logger = LoggerFactory.getLogger(MessageUnlikeHandler.class);
    private static final String MESSAGE_ID = "messageId";
    private static final String USER_ID = "userId";
    private static final String USER_FIRST_NAME = "userFirstName";
    private static final String USER_LAST_NAME = "userLastName";
    private static final String PAYLOAD = "payload";

    private final MessageService messageService;
    private final ObjectMapper objectMapper;

    public MessageUnlikeHandler(MessageService messageService, ObjectMapper objectMapper) {
        this.messageService = messageService;
        this.objectMapper = objectMapper;
    }

    public void handleUnlikeMessage(WebSocketSession session, JsonNode payload) {
        String messageId = payload.hasNonNull(MESSAGE_ID) ? payload.get(MESSAGE_ID).asText() : null;
        String userId = payload.hasNonNull(USER_ID) ? payload.get(USER_ID).asText() : null;
        String userFirstName =
                payload.hasNonNull(USER_FIRST_NAME) ? payload.get(USER_FIRST_NAME).asText() : null;
        String userLastName =
                payload.hasNonNull(USER_LAST_NAME) ? payload.get(USER_LAST_NAME).asText() : null;

        if (messageId == null || userId == null || userFirstName == null || userLastName == null) {
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in message.unlike payload");
            return;
        }

        messageService.unlikeMessage(messageId, userId, userFirstName, userLastName)
                .subscribe(unlikedMessage -> {
                    try {
                        String result = objectMapper
                                .writeValueAsString(Map.of("type", "message.unlike.success",
                                        PAYLOAD, Map.of(MESSAGE_ID, unlikedMessage.getId())));
                        session.sendMessage(new TextMessage(result));
                        logger.info("Message unliked: {}", unlikedMessage);
                    } catch (IOException e) {
                        logger.error("Error sending message unlike confirmation", e);
                    }
                }, error -> WebSocketErrorHandler.sendErrorMessage(session,
                        "Error unliking message", error));
    }
}
