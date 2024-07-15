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
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.Map;

@Component
public class ConversationWebSocketHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(ConversationWebSocketHandler.class);

    private static final String CONVERSATION_ID = "conversationId";
    private static final String MESSAGE_ID = "messageId";
    private static final String USER_ID = "userId";
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
            case "message.like":
                handleLikeMessage(session, payload);
                break;
            case "message.unlike":
                handleUnlikeMessage(session, payload);
                break;
            default:
                sendErrorMessage(session, "Unknown conversation message type: " + messageType);
        }
    }

    private void handleConversationCreate(WebSocketSession session, JsonNode payload) {
        String senderId = payload.hasNonNull("senderId") ? payload.get("senderId").asText() : null;
        String senderFirstName =
                payload.hasNonNull("senderFirstName") ? payload.get("senderFirstName").asText()
                        : null;
        String senderLastName =
                payload.hasNonNull("senderLastName") ? payload.get("senderLastName").asText()
                        : null;
        String receiverId =
                payload.hasNonNull("receiverId") ? payload.get("receiverId").asText() : null;
        String receiverFirstName =
                payload.hasNonNull("receiverFirstName") ? payload.get("receiverFirstName").asText()
                        : null;
        String receiverLastName =
                payload.hasNonNull("receiverLastName") ? payload.get("receiverLastName").asText()
                        : null;
        String name = payload.hasNonNull("name") ? payload.get("name").asText() : null;
        String initialMessage =
                payload.hasNonNull("initialMessage") ? payload.get("initialMessage").asText()
                        : null;

        if (senderId == null || senderFirstName == null || senderLastName == null
                || receiverId == null || receiverFirstName == null || receiverLastName == null
                || name == null || initialMessage == null) {
            sendErrorMessage(session, "Missing fields in conversation.create payload", null);
            return;
        }

        userService.getUserById(senderId).zipWith(userService.getUserById(receiverId))
                .flatMap(tuple -> {
                    Conversation conversation = new Conversation(senderId, senderFirstName,
                            senderLastName, receiverId, receiverFirstName, receiverLastName, name);
                    return conversationService.createConversation(conversation, initialMessage);
                }).subscribe(createdConversation -> {
                    try {
                        session.sendMessage(new TextMessage(String.format(
                                "{\"type\":\"conversation.create.success\",\"payload\":{\"conversationId\":\"%s\"}}",
                                createdConversation.getId())));
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

    private void handleLikeMessage(WebSocketSession session, JsonNode payload) {
        String conversationId =
                payload.hasNonNull(CONVERSATION_ID) ? payload.get(CONVERSATION_ID).asText() : null;
        String messageId = payload.hasNonNull(MESSAGE_ID) ? payload.get(MESSAGE_ID).asText() : null;
        String userId = payload.hasNonNull(USER_ID) ? payload.get(USER_ID).asText() : null;

        if (conversationId == null || messageId == null || userId == null) {
            sendErrorMessage(session, "Missing fields in message.like payload", null);
            return;
        }

        conversationService.likeMessage(conversationId, messageId, userId)
                .subscribe(likedMessage -> {
                    try {
                        String result = objectMapper
                                .writeValueAsString(Map.of("type", "message.like.success", PAYLOAD,
                                        Map.of("messageId", likedMessage.getId())));
                        session.sendMessage(new TextMessage(result));
                        logger.info("Message liked: {}", likedMessage);
                    } catch (IOException e) {
                        logger.error("Error sending message like confirmation", e);
                    }
                }, error -> sendErrorMessage(session, "Error liking message", error));
    }

    private void handleUnlikeMessage(WebSocketSession session, JsonNode payload) {
        String conversationId =
                payload.hasNonNull(CONVERSATION_ID) ? payload.get(CONVERSATION_ID).asText() : null;
        String messageId = payload.hasNonNull(MESSAGE_ID) ? payload.get(MESSAGE_ID).asText() : null;
        String userId = payload.hasNonNull(USER_ID) ? payload.get(USER_ID).asText() : null;

        if (conversationId == null || messageId == null || userId == null) {
            sendErrorMessage(session, "Missing fields in message.unlike payload", null);
            return;
        }

        conversationService.unlikeMessage(conversationId, messageId, userId)
                .subscribe(unlikedMessage -> {
                    try {
                        String result = objectMapper
                                .writeValueAsString(Map.of("type", "message.unlike.success",
                                        PAYLOAD, Map.of("messageId", unlikedMessage.getId())));
                        session.sendMessage(new TextMessage(result));
                        logger.info("Message unliked: {}", unlikedMessage);
                    } catch (IOException e) {
                        logger.error("Error sending message unlike confirmation", e);
                    }
                }, error -> sendErrorMessage(session, "Error unliking message", error));
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
