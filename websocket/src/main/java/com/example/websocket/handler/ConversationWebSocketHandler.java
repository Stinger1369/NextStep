package com.example.websocket.handler;

import com.example.websocket.handler.conversation.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class ConversationWebSocketHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(ConversationWebSocketHandler.class);

    private final ConversationCreateHandler conversationCreateHandler;
    private final ConversationFetchHandler conversationFetchHandler;
    private final ConversationUpdateHandler conversationUpdateHandler;
    private final ConversationDeleteHandler conversationDeleteHandler;
    private final ConversationLikeHandler conversationLikeHandler;
    private final ConversationUnlikeHandler conversationUnlikeHandler;

    public ConversationWebSocketHandler(ConversationCreateHandler conversationCreateHandler,
            ConversationFetchHandler conversationFetchHandler,
            ConversationUpdateHandler conversationUpdateHandler,
            ConversationDeleteHandler conversationDeleteHandler,
            ConversationLikeHandler conversationLikeHandler,
            ConversationUnlikeHandler conversationUnlikeHandler) {
        this.conversationCreateHandler = conversationCreateHandler;
        this.conversationFetchHandler = conversationFetchHandler;
        this.conversationUpdateHandler = conversationUpdateHandler;
        this.conversationDeleteHandler = conversationDeleteHandler;
        this.conversationLikeHandler = conversationLikeHandler;
        this.conversationUnlikeHandler = conversationUnlikeHandler;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        logger.info("Handling message of type: {}", messageType);
        switch (messageType) {
            case "conversation.create":
                logger.info("Calling handleConversationCreate");
                conversationCreateHandler.handleConversationCreate(session, payload);
                break;
            case "conversation.getById":
            case "conversation.getAll":
                logger.info("Calling handleFetchConversation for type: {}", messageType);
                conversationFetchHandler.handleFetchConversation(session, messageType, payload);
                break;
            case "conversation.update":
                logger.info("Calling handleUpdateConversation");
                conversationUpdateHandler.handleUpdateConversation(session, payload);
                break;
            case "conversation.delete":
                logger.info("Calling handleDeleteConversation");
                conversationDeleteHandler.handleDeleteConversation(session, payload);
                break;
            case "conversation.like":
                logger.info("Calling handleLikeConversation");
                conversationLikeHandler.handleLikeConversation(session, payload);
                break;
            case "conversation.unlike":
                logger.info("Calling handleUnlikeConversation");
                conversationUnlikeHandler.handleUnlikeConversation(session, payload);
                break;
            default:
                logger.warn("Unknown conversation message type: {}", messageType);
                WebSocketErrorHandler.sendErrorMessage(session,
                        "Unknown conversation message type: " + messageType);
        }
    }
}
