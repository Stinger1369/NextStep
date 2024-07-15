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
        if (payload.hasNonNull(MESSAGE_ID) && payload.hasNonNull(USER_ID)) {
            String messageId = payload.get(MESSAGE_ID).asText();
            String userId = payload.get(USER_ID).asText();
            messageService.deleteMessage(messageId, userId).subscribe(unused -> {
                try {
                    session.sendMessage(new TextMessage(String.format(
                            "{\"type\":\"message.delete.success\",\"payload\":{\"messageId\":\"%s\"}}",
                            messageId)));
                    logger.info("Message deleted: {}", messageId);
                } catch (IOException e) {
                    logger.error("Error sending message deletion confirmation", e);
                }
            }, error -> WebSocketErrorHandler.sendErrorMessage(session, "Error deleting message",
                    error));
        } else {
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in message.delete payload");
        }
    }
}
