package com.example.websocket.handler.conversation;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.ConversationService;
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
public class ConversationFetchHandler {
    private static final Logger logger = LoggerFactory.getLogger(ConversationFetchHandler.class);
    private static final String CONVERSATION_ID = "conversationId";
    private static final String PAYLOAD = "payload";

    private final ConversationService conversationService;
    private final ObjectMapper objectMapper;

    public ConversationFetchHandler(ConversationService conversationService,
            ObjectMapper objectMapper) {
        this.conversationService = conversationService;
        this.objectMapper = objectMapper;
    }

    public void handleFetchConversation(WebSocketSession session, String messageType,
            JsonNode payload) {
        logger.info("Handling fetch conversation message of type: {}", messageType);

        switch (messageType) {
            case "conversation.getById":
                handleGetConversationById(session, payload);
                break;
            case "conversation.getAll":
                handleGetAllConversations(session);
                break;
            default:
                logger.warn("Unknown fetch conversation message type: {}", messageType);
                WebSocketErrorHandler.sendErrorMessage(session,
                        "Unknown fetch conversation message type: " + messageType);
        }
    }

    private void handleGetConversationById(WebSocketSession session, JsonNode payload) {
        logger.info("Handling get conversation by ID with payload: {}", payload);

        String conversationId =
                payload.hasNonNull(CONVERSATION_ID) ? payload.get(CONVERSATION_ID).asText() : null;

        if (conversationId == null) {
            logger.error("Missing conversationId in conversation.getById payload");
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing conversationId in conversation.getById payload");
            return;
        }

        logger.info("Fetching conversation with ID: {}", conversationId);

        conversationService.getConversationById(conversationId).subscribe(conversation -> {
            try {
                String result = objectMapper.writeValueAsString(
                        Map.of("type", "conversation.getById.success", PAYLOAD, conversation));
                session.sendMessage(new TextMessage(result));
                logger.info("Conversation retrieved: {}", conversation);
            } catch (IOException e) {
                logger.error("Error sending conversation retrieval confirmation", e);
            }
        }, error -> {
            logger.error("Error retrieving conversation with ID: {}", conversationId, error);
            WebSocketErrorHandler.sendErrorMessage(session, "Error retrieving conversation", error);
        });
    }

    private void handleGetAllConversations(WebSocketSession session) {
        logger.info("Fetching all conversations");

        conversationService.getAllConversations().collectList().subscribe(conversations -> {
            try {
                String result = objectMapper
                        .writeValueAsString(Map.of("type", "conversation.getAll.success", PAYLOAD,
                                Map.of("conversations", conversations)));
                session.sendMessage(new TextMessage(result));
                logger.info("Sent all conversations: {}", result);
            } catch (IOException e) {
                logger.error("Error sending all conversations", e);
            }
        }, error -> {
            logger.error("Error fetching all conversations", error);
            WebSocketErrorHandler.sendErrorMessage(session, "Error fetching conversations", error);
        });
    }
}
