package com.example.websocket.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(ChatWebSocketHandler.class);

    private final ObjectMapper objectMapper;
    private final UserWebSocketHandler userHandler;
    private final PostWebSocketHandler postHandler;
    private final CommentWebSocketHandler commentHandler;
    private final ConversationWebSocketHandler conversationHandler;

    public ChatWebSocketHandler(ObjectMapper objectMapper, UserWebSocketHandler userHandler,
            PostWebSocketHandler postHandler, CommentWebSocketHandler commentHandler,
            ConversationWebSocketHandler conversationHandler) {
        this.objectMapper = objectMapper;
        this.userHandler = userHandler;
        this.postHandler = postHandler;
        this.commentHandler = commentHandler;
        this.conversationHandler = conversationHandler;
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session,
            @NonNull TextMessage message) {
        logger.info("Received message: {}", message.getPayload());

        try {
            JsonNode jsonNode = objectMapper.readTree(message.getPayload());
            String messageType = jsonNode.get("type").asText();
            JsonNode payload = jsonNode.get("payload");

            switch (messageType) {
                case "user.create":
                case "user.check":
                case "user.getCurrent":
                    userHandler.handleMessage(session, messageType, payload);
                    break;
                case "post.create":
                case "post.getById":
                case "post.getAll":
                case "post.delete":
                    postHandler.handleMessage(session, messageType, payload);
                    break;
                case "comment.create":
                    commentHandler.handleMessage(session, messageType, payload);
                    break;
                case "conversation.create":
                    conversationHandler.handleMessage(session, messageType, payload);
                    break;
                default:
                    sendErrorMessage(session,
                            String.format("Unknown message type: %s", messageType));
            }
        } catch (IOException e) {
            logger.error("Error processing message", e);
            sendErrorMessage(session, "Invalid JSON format");
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage) {
        try {
            session.sendMessage(new TextMessage(String.format(
                    "{\"type\":\"error\",\"payload\":{\"message\":\"%s\"}}", errorMessage)));
        } catch (IOException e) {
            logger.error("Error sending error message", e);
        }
    }
}
