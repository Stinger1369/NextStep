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
public class CommentDeleteHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommentDeleteHandler.class);
    private static final String COMMENT_ID = "commentId";
    private static final String PAYLOAD = "payload";
    private final CommentService commentService;
    private final ObjectMapper objectMapper;

    public CommentDeleteHandler(CommentService commentService, ObjectMapper objectMapper) {
        this.commentService = commentService;
        this.objectMapper = objectMapper;
    }

    public void handleCommentDelete(WebSocketSession session, JsonNode payload) {
        logger.info("handleCommentDelete called with payload: {}", payload);

        if (payload.hasNonNull(COMMENT_ID)) {
            String commentId = payload.get(COMMENT_ID).asText();
            logger.info("Deleting comment with commentId: {}", commentId);

            commentService.deleteComment(commentId).subscribe(unused -> {
                try {
                    String result = objectMapper.writeValueAsString(Map.of("type",
                            "comment.delete.success", PAYLOAD, Map.of(COMMENT_ID, commentId)));
                    session.sendMessage(new TextMessage(result));
                    logger.info("Comment deleted and confirmation sent: {}", commentId);
                } catch (IOException e) {
                    logger.error("Error sending comment deletion confirmation", e);
                }
            }, error -> {
                logger.error("Error deleting comment", error);
                WebSocketErrorHandler.sendErrorMessage(session, "Error deleting comment", error);
            });
        } else {
            logger.warn("Missing commentId in comment.delete payload: {}", payload);
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing commentId in comment.delete payload");
        }
    }
}
