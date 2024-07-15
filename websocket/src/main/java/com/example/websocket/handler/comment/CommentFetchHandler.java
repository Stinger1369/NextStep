package com.example.websocket.handler.comment;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.CommentService;
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
public class CommentFetchHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommentFetchHandler.class);
    private static final String COMMENT_ID = "commentId";
    private static final String PAYLOAD = "payload";
    private final CommentService commentService;
    private final ObjectMapper objectMapper;

    public CommentFetchHandler(CommentService commentService, ObjectMapper objectMapper) {
        this.commentService = commentService;
        this.objectMapper = objectMapper;
    }

    public void handleFetchComment(WebSocketSession session, String messageType, JsonNode payload) {
        switch (messageType) {
            case "comment.getById":
                handleGetCommentById(session, payload);
                break;
            case "comment.getAll":
                handleGetAllComments(session);
                break;
            default:
                WebSocketErrorHandler.sendErrorMessage(session,
                        "Unknown comment fetch message type: " + messageType);
        }
    }

    private void handleGetCommentById(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(COMMENT_ID)) {
            String commentId = payload.get(COMMENT_ID).asText();

            commentService.getCommentById(commentId).subscribe(comment -> {
                try {
                    String result = objectMapper.writeValueAsString(Map.of("type",
                            "comment.getById.success", PAYLOAD,
                            Map.of(COMMENT_ID, comment.getId(), "userId", comment.getUserId(),
                                    "postId", comment.getPostId(), "content", comment.getContent(),
                                    "createdAt", comment.getCreatedAt(), "updatedAt",
                                    comment.getUpdatedAt(), "firstName", comment.getFirstName(),
                                    "lastName", comment.getLastName())));
                    session.sendMessage(new TextMessage(result));
                    logger.info("Comment retrieved: {}", comment);
                } catch (IOException e) {
                    logger.error("Error sending comment retrieval confirmation", e);
                }
            }, error -> WebSocketErrorHandler.sendErrorMessage(session, "Error retrieving comment",
                    error));
        } else {
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in comment.getById payload");
        }
    }

    private void handleGetAllComments(WebSocketSession session) {
        commentService.getAllComments().collectList().subscribe(comments -> {
            try {
                String result = objectMapper.writeValueAsString(Map.of("type",
                        "comment.getAll.success", PAYLOAD, Map.of("comments", comments)));
                session.sendMessage(new TextMessage(result));
                logger.info("Sent all comments: {}", result);
            } catch (IOException e) {
                logger.error("Error sending all comments", e);
            }
        }, error -> WebSocketErrorHandler.sendErrorMessage(session, "Error fetching comments",
                error));
    }
}
