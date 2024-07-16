package com.example.websocket.handler.message;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.MessageService;
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
public class MessageFetchHandler {
    private static final Logger logger = LoggerFactory.getLogger(MessageFetchHandler.class);
    private static final String MESSAGE_ID = "messageId";
    private static final String CONVERSATION_ID = "conversationId";
    private static final String PAYLOAD = "payload";

    private final MessageService messageService;
    private final ObjectMapper objectMapper;

    public MessageFetchHandler(MessageService messageService, ObjectMapper objectMapper) {
        this.messageService = messageService;
        this.objectMapper = objectMapper;
    }

    public void handleFetchMessage(WebSocketSession session, String messageType, JsonNode payload) {
        logger.info("Handling fetch message of type: {}", messageType);
        switch (messageType) {
            case "message.get":
                handleGetMessageById(session, payload);
                break;
            case "message.getByConversationId":
                handleGetMessagesByConversationId(session, payload);
                break;
            case "message.getAll":
                handleGetAllMessages(session);
                break;
            default:
                WebSocketErrorHandler.sendErrorMessage(session,
                        "Unknown fetch message type: " + messageType);
        }
    }

    private void handleGetMessageById(WebSocketSession session, JsonNode payload) {
        String messageId = payload.hasNonNull(MESSAGE_ID) ? payload.get(MESSAGE_ID).asText() : null;

        if (messageId == null) {
            logger.warn("Missing messageId in message.get payload");
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing messageId in message.get payload");
            return;
        }

        logger.info("Fetching message by ID: {}", messageId);

        messageService.getMessageById(messageId).subscribe(message -> {
            try {
                String result = objectMapper.writeValueAsString(
                        Map.of("type", "message.get.success", PAYLOAD, message));
                session.sendMessage(new TextMessage(result));
                logger.info("Message retrieved: {}", message);
            } catch (IOException e) {
                logger.error("Error sending message retrieval confirmation", e);
            }
        }, error -> {
            logger.error("Error retrieving message with ID: {}", messageId, error);
            WebSocketErrorHandler.sendErrorMessage(session, "Error retrieving message", error);
        });
    }

    private void handleGetMessagesByConversationId(WebSocketSession session, JsonNode payload) {
        String conversationId =
                payload.hasNonNull(CONVERSATION_ID) ? payload.get(CONVERSATION_ID).asText() : null;

        if (conversationId == null) {
            logger.warn("Missing conversationId in message.getByConversationId payload");
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing conversationId in message.getByConversationId payload");
            return;
        }

        logger.info("Fetching messages for conversation ID: {}", conversationId);

        messageService.getMessagesByConversationId(conversationId).collectList()
                .subscribe(messages -> {
                    try {
                        String result = objectMapper.writeValueAsString(
                                Map.of("type", "message.getByConversationId.success", PAYLOAD,
                                        Map.of("messages", messages)));
                        session.sendMessage(new TextMessage(result));
                        logger.info("Messages retrieved for conversationId {}: {}", conversationId,
                                messages);
                    } catch (IOException e) {
                        logger.error("Error sending messages retrieval confirmation", e);
                    }
                }, error -> {
                    logger.error("Error retrieving messages for conversation ID: {}",
                            conversationId, error);
                    WebSocketErrorHandler.sendErrorMessage(session, "Error retrieving messages",
                            error);
                });
    }

    private void handleGetAllMessages(WebSocketSession session) {
        logger.info("Fetching all messages");

        messageService.getAllMessages().collectList().subscribe(messages -> {
            try {
                String result = objectMapper.writeValueAsString(Map.of("type",
                        "message.getAll.success", PAYLOAD, Map.of("messages", messages)));
                session.sendMessage(new TextMessage(result));
                logger.info("All messages retrieved: {}", messages);
            } catch (IOException e) {
                logger.error("Error sending all messages retrieval confirmation", e);
            }
        }, error -> {
            logger.error("Error retrieving all messages", error);
            WebSocketErrorHandler.sendErrorMessage(session, "Error retrieving all messages", error);
        });
    }
}
