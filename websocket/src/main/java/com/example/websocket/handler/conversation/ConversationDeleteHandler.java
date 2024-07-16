package com.example.websocket.handler.conversation;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.ConversationService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Component
public class ConversationDeleteHandler {
    private static final Logger logger = LoggerFactory.getLogger(ConversationDeleteHandler.class);
    private static final String CONVERSATION_ID = "conversationId";

    private final ConversationService conversationService;

    public ConversationDeleteHandler(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    public void handleDeleteConversation(WebSocketSession session, JsonNode payload) {
        logger.info("Received conversation.delete request with payload: {}", payload);

        String conversationId = payload.hasNonNull(CONVERSATION_ID) ? payload.get(CONVERSATION_ID).asText() : null;

        if (conversationId == null) {
            logger.error("Missing conversationId in conversation.delete payload");
            WebSocketErrorHandler.sendErrorMessage(session, "Missing conversationId in conversation.delete payload");
            return;
        }

        logger.info("Deleting conversation with ID: {}", conversationId);
        conversationService.deleteConversation(conversationId).subscribe(unused -> {
            try {
                session.sendMessage(new TextMessage(String.format(
                    "{\"type\":\"conversation.delete.success\",\"payload\":{\"conversationId\":\"%s\"}}",
                    conversationId)));
                logger.info("Conversation deleted: {}", conversationId);
            } catch (IOException e) {
                logger.error("Error sending conversation deletion confirmation", e);
            }
        }, error -> {
            logger.error("Error deleting conversation", error);
            WebSocketErrorHandler.sendErrorMessage(session, "Error deleting conversation", error);
        });
    }
}
