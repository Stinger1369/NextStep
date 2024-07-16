package com.example.websocket.handler;

import com.example.websocket.handler.comment.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class CommentWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(CommentWebSocketHandler.class);

    private final CommentCreateHandler commentCreateHandler;
    private final CommentUpdateHandler commentUpdateHandler;
    private final CommentDeleteHandler commentDeleteHandler;
    private final CommentLikeHandler commentLikeHandler;
    private final CommentUnlikeHandler commentUnlikeHandler;
    private final CommentFetchHandler commentFetchHandler;

    public CommentWebSocketHandler(CommentCreateHandler commentCreateHandler,
            CommentUpdateHandler commentUpdateHandler, CommentDeleteHandler commentDeleteHandler,
            CommentLikeHandler commentLikeHandler, CommentUnlikeHandler commentUnlikeHandler,
            CommentFetchHandler commentFetchHandler) {
        this.commentCreateHandler = commentCreateHandler;
        this.commentUpdateHandler = commentUpdateHandler;
        this.commentDeleteHandler = commentDeleteHandler;
        this.commentLikeHandler = commentLikeHandler;
        this.commentUnlikeHandler = commentUnlikeHandler;
        this.commentFetchHandler = commentFetchHandler;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        logger.info("Handling message of type: {}", messageType);
        switch (messageType) {
            case "comment.create":
                logger.info("Delegating to CommentCreateHandler");
                commentCreateHandler.handleCommentCreate(session, payload);
                break;
            case "comment.update":
                logger.info("Delegating to CommentUpdateHandler");
                commentUpdateHandler.handleCommentUpdate(session, payload);
                break;
            case "comment.delete":
                logger.info("Delegating to CommentDeleteHandler");
                commentDeleteHandler.handleCommentDelete(session, payload);
                break;
            case "comment.like":
                logger.info("Delegating to CommentLikeHandler");
                commentLikeHandler.handleCommentLike(session, payload);
                break;
            case "comment.unlike":
                logger.info("Delegating to CommentUnlikeHandler");
                commentUnlikeHandler.handleCommentUnlike(session, payload);
                break;
            case "comment.getById":
            case "comment.getAll":
                logger.info("Delegating to CommentFetchHandler");
                commentFetchHandler.handleFetchComment(session, messageType, payload);
                break;
            default:
                logger.warn("Unknown comment message type: {}", messageType);
                WebSocketErrorHandler.sendErrorMessage(session,
                        "Unknown comment message type: " + messageType);
        }
    }
}
