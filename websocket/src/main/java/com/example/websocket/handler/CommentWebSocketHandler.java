package com.example.websocket.handler;

import com.example.websocket.model.Comment;
import com.example.websocket.service.CommentService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Component
public class CommentWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(CommentWebSocketHandler.class);
    private static final String USER_ID = "userId";
    private static final String POST_ID = "postId";
    private static final String CONTENT = "content";

    private final CommentService commentService;

    public CommentWebSocketHandler(CommentService commentService) {
        this.commentService = commentService;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        if ("comment.create".equals(messageType)) {
            handleCommentCreate(session, payload);
        } else {
            sendErrorMessage(session, "Unknown comment message type: " + messageType);
        }
    }

    private void handleCommentCreate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(POST_ID)
                && payload.hasNonNull(CONTENT)) {
            Comment comment = new Comment(payload.get(USER_ID).asText(),
                    payload.get(POST_ID).asText(), payload.get(CONTENT).asText());

            logger.info("Creating comment: {}", comment);

            commentService.createComment(comment).subscribe(updatedUser -> {
                try {
                    int numComments = updatedUser.getPosts().stream()
                            .filter(post -> post.getId().toString().equals(comment.getPostId()))
                            .findFirst().map(post -> post.getComments().size()).orElse(0);

                    session.sendMessage(new TextMessage(
                            String.format("Comment added to post. Updated post now has %d comments",
                                    numComments)));
                    logger.info("Comment added to post: {}", updatedUser);
                } catch (IOException e) {
                    logger.error("Error sending comment creation confirmation", e);
                }
            }, error -> sendErrorMessage(session, "Error creating comment", error));
        } else {
            sendErrorMessage(session, "Missing fields in comment.create payload", null);
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage, Throwable error) {
        logger.error("{}: {}", errorMessage, error != null ? error.getMessage() : "N/A", error);
        try {
            session.sendMessage(new TextMessage(
                    String.format("{\"type\":\"error\",\"payload\":{\"message\":\"%s: %s\"}}",
                            errorMessage, error != null ? error.getMessage() : "N/A")));
        } catch (IOException e) {
            logger.error("Error sending error message", e);
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage) {
        sendErrorMessage(session, errorMessage, null);
    }
}
