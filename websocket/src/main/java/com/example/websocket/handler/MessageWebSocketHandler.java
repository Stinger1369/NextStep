package com.example.websocket.handler;

import com.example.websocket.handler.message.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class MessageWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(MessageWebSocketHandler.class);

    private final MessageCreateHandler messageCreateHandler;
    private final MessageLikeHandler messageLikeHandler;
    private final MessageUnlikeHandler messageUnlikeHandler;
    private final MessageFetchHandler messageFetchHandler;
    private final MessageUpdateHandler messageUpdateHandler;
    private final MessageDeleteHandler messageDeleteHandler;

    public MessageWebSocketHandler(MessageCreateHandler messageCreateHandler,
            MessageLikeHandler messageLikeHandler, MessageUnlikeHandler messageUnlikeHandler,
            MessageFetchHandler messageFetchHandler, MessageUpdateHandler messageUpdateHandler,
            MessageDeleteHandler messageDeleteHandler) {
        this.messageCreateHandler = messageCreateHandler;
        this.messageLikeHandler = messageLikeHandler;
        this.messageUnlikeHandler = messageUnlikeHandler;
        this.messageFetchHandler = messageFetchHandler;
        this.messageUpdateHandler = messageUpdateHandler;
        this.messageDeleteHandler = messageDeleteHandler;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        logger.info("Handling message of type: {}", messageType);
        switch (messageType) {
            case "message.create":
                logger.info("Invoking create message handler");
                messageCreateHandler.handleCreateMessage(session, payload);
                break;
            case "message.like":
                logger.info("Invoking like message handler");
                messageLikeHandler.handleLikeMessage(session, payload);
                break;
            case "message.unlike":
                logger.info("Invoking unlike message handler");
                messageUnlikeHandler.handleUnlikeMessage(session, payload);
                break;
            case "message.get":
            case "message.getByConversationId":
            case "message.getAll":
                logger.info("Invoking fetch message handler for type: {}", messageType);
                messageFetchHandler.handleFetchMessage(session, messageType, payload);
                break;
            case "message.update":
                logger.info("Invoking update message handler");
                messageUpdateHandler.handleUpdateMessage(session, payload);
                break;
            case "message.delete":
                logger.info("Invoking delete message handler");
                messageDeleteHandler.handleDeleteMessage(session, payload);
                break;
            default:
                logger.warn("Unknown message type: {}", messageType);
                WebSocketErrorHandler.sendErrorMessage(session,
                        "Unknown message type: " + messageType);
        }
    }
}
