package com.example.websocket.handler.message;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.model.Message;
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
public class MessageUpdateHandler {
    private static final Logger logger = LoggerFactory.getLogger(MessageUpdateHandler.class);
    private static final String MESSAGE_ID = "messageId";
    private static final String CONTENT = "content";
    private static final String PAYLOAD = "payload";

    private final MessageService messageService;
    private final ObjectMapper objectMapper;

    public MessageUpdateHandler(MessageService messageService, ObjectMapper objectMapper) {
        this.messageService = messageService;
        this.objectMapper = objectMapper;
    }

    public void handleUpdateMessage(WebSocketSession session, JsonNode payload) {
        String messageId = payload.hasNonNull(MESSAGE_ID) ? payload.get(MESSAGE_ID).asText() : null;
        String content = payload.hasNonNull(CONTENT) ? payload.get(CONTENT).asText() : null;

        if (messageId == null || content == null) {
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in message.update payload");
            return;
        }

        Message newMessageData = new Message();
        newMessageData.setContent(content);

        messageService.updateMessage(messageId, newMessageData).subscribe(updatedMessage -> {
            try {
                String result = objectMapper.writeValueAsString(
                        Map.of("type", "message.update.success", PAYLOAD, updatedMessage));
                session.sendMessage(new TextMessage(result));
                logger.info("Message updated: {}", updatedMessage);
            } catch (IOException e) {
                logger.error("Error sending message update confirmation", e);
            }
        }, error -> WebSocketErrorHandler.sendErrorMessage(session, "Error updating message",
                error));
    }
}
