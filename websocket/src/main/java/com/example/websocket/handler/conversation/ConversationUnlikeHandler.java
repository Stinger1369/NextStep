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
public class ConversationUnlikeHandler {
    private static final Logger logger = LoggerFactory.getLogger(ConversationUnlikeHandler.class);
    private static final String CONVERSATION_ID = "conversationId";
    private static final String USER_ID = "userId";
    private static final String PAYLOAD = "payload";

    private final ConversationService conversationService;
    private final ObjectMapper objectMapper;

    public ConversationUnlikeHandler(ConversationService conversationService,
            ObjectMapper objectMapper) {
        this.conversationService = conversationService;
        this.objectMapper = objectMapper;
    }

    public void handleUnlikeConversation(WebSocketSession session, JsonNode payload) {
        logger.info("Handling unlike conversation with payload: {}", payload);

        String conversationId =
                payload.hasNonNull(CONVERSATION_ID) ? payload.get(CONVERSATION_ID).asText() : null;
        String userId = payload.hasNonNull(USER_ID) ? payload.get(USER_ID).asText() : null;

        if (conversationId == null || userId == null) {
            logger.error("Missing fields in conversation.unlike payload");
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in conversation.unlike payload");
            return;
        }

        conversationService.unlikeConversation(conversationId, userId)
                .subscribe(unlikedConversation -> {
                    try {
                        String result = objectMapper.writeValueAsString(
                                Map.of("type", "conversation.unlike.success", PAYLOAD,
                                        Map.of(CONVERSATION_ID, unlikedConversation.getId())));
                        session.sendMessage(new TextMessage(result));
                        logger.info("Conversation unliked: {}", unlikedConversation);
                    } catch (IOException e) {
                        logger.error("Error sending conversation unlike confirmation", e);
                    }
                }, error -> {
                    if ("User has already unliked this conversation.".equals(error.getMessage())) {
                        WebSocketErrorHandler.sendErrorMessage(session,
                                "You have already unliked this conversation.");
                    } else {
                        WebSocketErrorHandler.sendErrorMessage(session,
                                "Error unliking conversation", error);
                    }
                });
    }
}
