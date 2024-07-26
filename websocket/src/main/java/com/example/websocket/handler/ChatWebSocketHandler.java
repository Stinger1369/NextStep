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
    private final LikeWebSocketHandler likeHandler;
    private final MessageWebSocketHandler messageHandler;
    private final NotificationWebSocketHandler notificationHandler;

    public ChatWebSocketHandler(ObjectMapper objectMapper, UserWebSocketHandler userHandler,
            PostWebSocketHandler postHandler, CommentWebSocketHandler commentHandler,
            ConversationWebSocketHandler conversationHandler, LikeWebSocketHandler likeHandler,
            MessageWebSocketHandler messageHandler,
            NotificationWebSocketHandler notificationHandler) {
        this.objectMapper = objectMapper;
        this.userHandler = userHandler;
        this.postHandler = postHandler;
        this.commentHandler = commentHandler;
        this.conversationHandler = conversationHandler;
        this.likeHandler = likeHandler;
        this.messageHandler = messageHandler;
        this.notificationHandler = notificationHandler;
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session,
            @NonNull TextMessage message) {
        logger.info("Received message: {}", message.getPayload());

        try {
            JsonNode jsonNode = objectMapper.readTree(message.getPayload());
            String messageType = jsonNode.get("type").asText();
            JsonNode payload = jsonNode.get("payload");

            if (payload == null) {
                logger.error("Payload is missing in the message: {}", message.getPayload());
                WebSocketErrorHandler.sendErrorMessage(session, "Missing payload in message", null);
                return;
            }

            switch (messageType) {
                case "user.create":
                case "user.check":
                case "user.getCurrent":
                case "user.getById":
                case "user.like":
                case "user.unlike":
                case "friend.request":
                case "friend.request.accept":
                case "friend.request.decline":
                case "friend.remove":
                case "profile.visit":
                case "user.follow":
                case "user.unfollow":
                case "user.block":
                case "user.unblock":
                    userHandler.handleMessage(session, messageType, payload);
                    break;
                case "post.create":
                case "post.getById":
                case "post.getAll":
                case "post.delete":
                case "post.like":
                case "post.unlike":
                case "post.share":
                case "post.repost":
                case "post.update":
                    postHandler.handleMessage(session, messageType, payload);
                    break;
                case "comment.create":
                case "comment.update":
                case "comment.delete":
                case "comment.like":
                case "comment.unlike":
                case "comment.getById":
                case "comment.getAll":
                    commentHandler.handleMessage(session, messageType, payload);
                    break;
                case "conversation.create":
                case "conversation.getById":
                case "conversation.getAll":
                case "conversation.update":
                case "conversation.delete":
                case "conversation.like":
                case "conversation.unlike":
                    conversationHandler.handleMessage(session, messageType, payload);
                    break;
                case "message.create":
                case "message.like":
                case "message.unlike":
                case "message.get":
                case "message.getByConversationId":
                case "message.getAll":
                case "message.update":
                case "message.delete":
                    messageHandler.handleMessage(session, messageType, payload);
                    break;
                case "like.create":
                case "like.delete":
                    likeHandler.handleMessage(session, messageType, payload);
                    break;
                case "notification.subscribe":
                case "notification.unsubscribe":
                case "notification.get":
                case "notification.getAllByUser":
                    notificationHandler.handleTextMessage(session, message);
                    break;
                default:
                    WebSocketErrorHandler.sendErrorMessage(session,
                            String.format("Unknown message type: %s", messageType));
            }
        } catch (IOException e) {
            logger.error("Error processing message", e);
            WebSocketErrorHandler.sendErrorMessage(session, "Invalid JSON format");
        }
    }
}
