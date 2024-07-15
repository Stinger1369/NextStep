package com.example.websocket.handler.conversation;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.ConversationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage; // Import this
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Map;

@Component
public class ConversationUpdateHandler {
    private static final Logger logger = LoggerFactory.getLogger(ConversationUpdateHandler.class);
    private static final String CONVERSATION_ID = "conversationId";
    private static final String PAYLOAD = "payload";

    private final ConversationService conversationService;
    private final ObjectMapper objectMapper;

    public ConversationUpdateHandler(ConversationService conversationService,
            ObjectMapper objectMapper) {
        this.conversationService = conversationService;
        this.objectMapper = objectMapper;
    }

    public void handleUpdateConversation(WebSocketSession session, JsonNode payload) {
        String conversationId =
                payload.hasNonNull(CONVERSATION_ID) ? payload.get(CONVERSATION_ID).asText() : null;

        if (conversationId == null) {
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing conversationId in conversation.update payload");
            return;
        }

        conversationService.updateConversation(conversationId, payload)
                .subscribe(updatedConversation -> {
                    try {
                        String result = objectMapper.writeValueAsString(Map.of("type",
                                "conversation.update.success", PAYLOAD, updatedConversation));
                        session.sendMessage(new TextMessage(result));
                        logger.info("Conversation updated: {}", updatedConversation);
                    } catch (IOException e) {
                        logger.error("Error sending conversation update confirmation", e);
                    }
                }, error -> WebSocketErrorHandler.sendErrorMessage(session,
                        "Error updating conversation", error));
    }
}
