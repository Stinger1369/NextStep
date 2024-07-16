package com.example.websocket.handler.message;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.MessageService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Component
public class MessageDeleteHandler {
    private static final Logger logger = LoggerFactory.getLogger(MessageDeleteHandler.class);
    private static final String MESSAGE_ID = "messageId";
    private static final String USER_ID = "userId";

    private final MessageService messageService;

    public MessageDeleteHandler(MessageService messageService) {
        this.messageService = messageService;
    }

    public void handleDeleteMessage(WebSocketSession session, JsonNode payload) {
        logger.info("Received message.delete payload: {}", payload);

        if (payload.hasNonNull(MESSAGE_ID) && payload.hasNonNull(USER_ID)) {
            String messageId = payload.get(MESSAGE_ID).asText();
            String userId = payload.get(USER_ID).asText();

            logger.info("Attempting to delete message with ID: {} for user ID: {}", messageId,
                    userId);

            messageService.deleteMessage(messageId, userId).subscribe(unused -> {
                try {
                    String response = String.format(
                            "{\"type\":\"message.delete.success\",\"payload\":{\"messageId\":\"%s\"}}",
                            messageId);
                    session.sendMessage(new TextMessage(response));
                    logger.info("Message deleted: {}", messageId);
                } catch (IOException e) {
                    logger.error("Error sending message deletion confirmation", e);
                }
            }, error -> {
                logger.error("Error deleting message with ID: {}", messageId, error);
                WebSocketErrorHandler.sendErrorMessage(session, "Error deleting message", error);
            });
        } else {
            logger.warn("Missing fields in message.delete payload");
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in message.delete payload");
        }
    }
}
