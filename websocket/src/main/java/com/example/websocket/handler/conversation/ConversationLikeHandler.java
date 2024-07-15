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
public class ConversationLikeHandler {
    private static final Logger logger = LoggerFactory.getLogger(ConversationLikeHandler.class);
    private static final String CONVERSATION_ID = "conversationId";
    private static final String USER_ID = "userId";
    private static final String PAYLOAD = "payload";

    private final ConversationService conversationService;
    private final ObjectMapper objectMapper;

    public ConversationLikeHandler(ConversationService conversationService,
            ObjectMapper objectMapper) {
        this.conversationService = conversationService;
        this.objectMapper = objectMapper;
    }

    public void handleLikeConversation(WebSocketSession session, JsonNode payload) {
        String conversationId =
                payload.hasNonNull(CONVERSATION_ID) ? payload.get(CONVERSATION_ID).asText() : null;
        String userId = payload.hasNonNull(USER_ID) ? payload.get(USER_ID).asText() : null;

        if (conversationId == null || userId == null) {
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in conversation.like payload");
            return;
        }

        conversationService.likeConversation(conversationId, userId)
                .subscribe(likedConversation -> {
                    try {
                        String result = objectMapper.writeValueAsString(
                                Map.of("type", "conversation.like.success", PAYLOAD,
                                        Map.of(CONVERSATION_ID, likedConversation.getId())));
                        session.sendMessage(new TextMessage(result));
                        logger.info("Conversation liked: {}", likedConversation);
                    } catch (IOException e) {
                        logger.error("Error sending conversation like confirmation", e);
                    }
                }, error -> WebSocketErrorHandler.sendErrorMessage(session,
                        "Error liking conversation", error));
    }
}
