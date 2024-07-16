package com.example.websocket.handler.conversation;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.model.Conversation;
import com.example.websocket.service.ConversationService;
import com.example.websocket.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Component
public class ConversationCreateHandler {
    private static final Logger logger = LoggerFactory.getLogger(ConversationCreateHandler.class);

    private final ConversationService conversationService;
    private final UserService userService;

    public ConversationCreateHandler(ConversationService conversationService, UserService userService) {
        this.conversationService = conversationService;
        this.userService = userService;
    }

    public void handleConversationCreate(WebSocketSession session, JsonNode payload) {
        logger.info("Received conversation.create request with payload: {}", payload);

        String senderId = payload.hasNonNull("senderId") ? payload.get("senderId").asText() : null;
        String senderFirstName = payload.hasNonNull("senderFirstName") ? payload.get("senderFirstName").asText() : null;
        String senderLastName = payload.hasNonNull("senderLastName") ? payload.get("senderLastName").asText() : null;
        String receiverId = payload.hasNonNull("receiverId") ? payload.get("receiverId").asText() : null;
        String receiverFirstName = payload.hasNonNull("receiverFirstName") ? payload.get("receiverFirstName").asText() : null;
        String receiverLastName = payload.hasNonNull("receiverLastName") ? payload.get("receiverLastName").asText() : null;
        String name = payload.hasNonNull("name") ? payload.get("name").asText() : null;
        String initialMessage = payload.hasNonNull("initialMessage") ? payload.get("initialMessage").asText() : null;

        if (senderId == null || senderFirstName == null || senderLastName == null ||
            receiverId == null || receiverFirstName == null || receiverLastName == null ||
            name == null || initialMessage == null) {
            logger.error("Missing fields in conversation.create payload");
            WebSocketErrorHandler.sendErrorMessage(session, "Missing fields in conversation.create payload");
            return;
        }

        logger.info("Fetching sender and receiver details");
        userService.getUserById(senderId).zipWith(userService.getUserById(receiverId))
            .flatMap(tuple -> {
                logger.info("Creating conversation between {} {} and {} {}", senderFirstName, senderLastName, receiverFirstName, receiverLastName);
                Conversation conversation = new Conversation(senderId, senderFirstName, senderLastName, receiverId, receiverFirstName, receiverLastName, name);
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
            }, error -> {
                logger.error("Error creating conversation", error);
                WebSocketErrorHandler.sendErrorMessage(session, "Error creating conversation", error);
            });
    }
}
