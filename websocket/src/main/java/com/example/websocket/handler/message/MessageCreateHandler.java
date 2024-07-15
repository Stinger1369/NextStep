package com.example.websocket.handler.message;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.model.Message;
import com.example.websocket.service.MessageService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Component
public class MessageCreateHandler {
    private static final Logger logger = LoggerFactory.getLogger(MessageCreateHandler.class);
    private static final String CONVERSATION_ID = "conversationId";
    private static final String USER_ID = "userId";
    private static final String USER_FIRST_NAME = "userFirstName";
    private static final String USER_LAST_NAME = "userLastName";
    private static final String CONTENT = "content";

    private final MessageService messageService;

    public MessageCreateHandler(MessageService messageService) {
        this.messageService = messageService;
    }

    public void handleCreateMessage(WebSocketSession session, JsonNode payload) {
        String conversationId =
                payload.hasNonNull(CONVERSATION_ID) ? payload.get(CONVERSATION_ID).asText() : null;
        String senderId = payload.hasNonNull(USER_ID) ? payload.get(USER_ID).asText() : null;
        String senderFirstName =
                payload.hasNonNull(USER_FIRST_NAME) ? payload.get(USER_FIRST_NAME).asText() : null;
        String senderLastName =
                payload.hasNonNull(USER_LAST_NAME) ? payload.get(USER_LAST_NAME).asText() : null;
        String content = payload.hasNonNull(CONTENT) ? payload.get(CONTENT).asText() : null;

        if (conversationId == null || senderId == null || senderFirstName == null
                || senderLastName == null || content == null) {
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in message.create payload");
            return;
        }

        Message message =
                new Message(conversationId, senderId, senderFirstName, senderLastName, content);

        messageService.createMessage(message).subscribe(createdMessage -> {
            try {
                session.sendMessage(new TextMessage(String.format(
                        "{\"type\":\"message.create.success\",\"payload\":{\"messageId\":\"%s\"}}",
                        createdMessage.getId())));
                logger.info("Message created: {}", createdMessage);
            } catch (IOException e) {
                logger.error("Error sending message creation confirmation", e);
            }
        }, error -> WebSocketErrorHandler.sendErrorMessage(session, "Error creating message",
                error));
    }
}
