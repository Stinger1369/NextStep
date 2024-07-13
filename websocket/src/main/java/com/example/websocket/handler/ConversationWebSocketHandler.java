package com.example.websocket.handler;

import com.example.websocket.model.Conversation;
import com.example.websocket.service.ConversationService;
import com.example.websocket.service.UserService;
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
public class ConversationWebSocketHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(ConversationWebSocketHandler.class);

    private static final String CONVERSATION_ID = "conversationId";
    private static final String PAYLOAD = "payload";

    private final ConversationService conversationService;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    public ConversationWebSocketHandler(ConversationService conversationService,
            UserService userService, ObjectMapper objectMapper) {
        this.conversationService = conversationService;
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        switch (messageType) {
            case "conversation.create":
                handleConversationCreate(session, payload);
                break;
            case "conversation.getById":
                handleGetConversationById(session, payload);
                break;
            case "conversation.getAll":
                handleGetAllConversations(session);
                break;
            case "conversation.update":
                handleUpdateConversation(session, payload);
                break;
            case "conversation.delete":
                handleDeleteConversation(session, payload);
                break;
            default:
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

        userService.getUserById(senderId).zipWith(userService.getUserById(receiverId))
                .flatMap(tuple -> {
                    Conversation conversation = new Conversation(senderId,
                            tuple.getT1().getFirstName(), tuple.getT1().getLastName(), receiverId,
                            tuple.getT2().getFirstName(), tuple.getT2().getLastName(), name);
                    return conversationService.createConversation(conversation, initialMessage);
                }).subscribe(createdConversation -> {
                    try {
                        session.sendMessage(new TextMessage(String.format(
                                "Conversation created with ID: %s", createdConversation.getId())));
                        logger.info("Conversation created: {}", createdConversation);
                    } catch (IOException e) {
                        logger.error("Error sending conversation creation confirmation", e);
                    }
                }, error -> sendErrorMessage(session, "Error creating conversation", error));
    }

    private void handleGetConversationById(WebSocketSession session, JsonNode payload) {
        String conversationId =
                payload.hasNonNull(CONVERSATION_ID) ? payload.get(CONVERSATION_ID).asText() : null;

        if (conversationId == null) {
            sendErrorMessage(session, "Missing conversationId in conversation.getById payload",
                    null);
            return;
        }

        conversationService.getConversationById(conversationId).subscribe(conversation -> {
            try {
                String result = objectMapper.writeValueAsString(
                        Map.of("type", "conversation.getById.success", PAYLOAD, conversation));
                session.sendMessage(new TextMessage(result));
                logger.info("Conversation retrieved: {}", conversation);
            } catch (IOException e) {
                logger.error("Error sending conversation retrieval confirmation", e);
            }
        }, error -> sendErrorMessage(session, "Error retrieving conversation", error));
    }

    private void handleGetAllConversations(WebSocketSession session) {
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
            try {
                session.sendMessage(new TextMessage(
                        "{\"type\":\"error\",\"payload\":{\"message\":\"Error fetching conversations\"}}"));
                logger.error("Error fetching conversations", error);
            } catch (IOException e) {
                logger.error("Error sending error message", e);
            }
        });
    }

    private void handleUpdateConversation(WebSocketSession session, JsonNode payload) {
        String conversationId =
                payload.hasNonNull(CONVERSATION_ID) ? payload.get(CONVERSATION_ID).asText() : null;

        if (conversationId == null) {
            sendErrorMessage(session, "Missing conversationId in conversation.update payload",
                    null);
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
                }, error -> sendErrorMessage(session, "Error updating conversation", error));
    }

    private void handleDeleteConversation(WebSocketSession session, JsonNode payload) {
        String conversationId =
                payload.hasNonNull(CONVERSATION_ID) ? payload.get(CONVERSATION_ID).asText() : null;

        if (conversationId == null) {
            sendErrorMessage(session, "Missing conversationId in conversation.delete payload",
                    null);
            return;
        }

        conversationService.deleteConversation(conversationId).subscribe(unused -> {
            try {
                session.sendMessage(new TextMessage(String.format(
                        "{\"type\":\"conversation.delete.success\",\"payload\":{\"conversationId\":\"%s\"}}",
                        conversationId)));
            } catch (IOException e) {
                logger.error("Error sending conversation deletion confirmation", e);
            }
        }, error -> sendErrorMessage(session, "Error deleting conversation", error));
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
