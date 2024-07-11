package com.example.websocket.handler;

import com.example.websocket.model.Conversation;
import com.example.websocket.service.ConversationService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Component
public class ConversationWebSocketHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(ConversationWebSocketHandler.class);

    private final ConversationService conversationService;

    public ConversationWebSocketHandler(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        if ("conversation.create".equals(messageType)) {
            handleConversationCreate(session, payload);
        } else {
            sendErrorMessage(session, "Unknown conversation message type: " + messageType);
        }
    }

    private void handleConversationCreate(WebSocketSession session, JsonNode payload) {
        String senderId = payload.hasNonNull("senderId") ? payload.get("senderId").asText() : null;
        String receiverId =
                payload.hasNonNull("receiverId") ? payload.get("receiverId").asText() : null;
        String name = payload.hasNonNull("name") ? payload.get("name").asText() : null;
        String initialMessage =
                payload.hasNonNull("message") ? payload.get("message").asText() : null;

        if (senderId == null || receiverId == null || name == null || initialMessage == null) {
            sendErrorMessage(session, "Missing fields in conversation.create payload", null);
            return;
        }

        Conversation conversation = new Conversation(senderId, receiverId, name);

        conversationService.createConversation(conversation, initialMessage)
                .subscribe(createdConversation -> {
                    try {
                        session.sendMessage(new TextMessage(String.format(
                                "Conversation created with ID: %s", createdConversation.getId())));
                        logger.info("Conversation created: {}", createdConversation);
                    } catch (IOException e) {
                        logger.error("Error sending conversation creation confirmation", e);
                    }
                }, error -> sendErrorMessage(session, "Error creating conversation", error));
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
