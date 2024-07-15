package com.example.websocket.handler.comment;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.model.Comment;
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
public class CommentUpdateHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommentUpdateHandler.class);
    private static final String COMMENT_ID = "commentId";
    private static final String CONTENT = "content";
    private static final String PAYLOAD = "payload";
    private final CommentService commentService;
    private final ObjectMapper objectMapper;

    public CommentUpdateHandler(CommentService commentService, ObjectMapper objectMapper) {
        this.commentService = commentService;
        this.objectMapper = objectMapper;
    }

    public void handleCommentUpdate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(COMMENT_ID) && payload.hasNonNull(CONTENT)) {
            String commentId = payload.get(COMMENT_ID).asText();
            String content = payload.get(CONTENT).asText();

            commentService.updateComment(commentId, new Comment(null, null, null, null, content))
                    .subscribe(updatedComment -> {
                        try {
                            String result = objectMapper
                                    .writeValueAsString(Map.of("type", "comment.update.success",
                                            PAYLOAD, Map.of(COMMENT_ID, updatedComment.getId(),
                                                    CONTENT, updatedComment.getContent())));
                            session.sendMessage(new TextMessage(result));
                            logger.info("Comment updated: {}", updatedComment);
                        } catch (IOException e) {
                            logger.error("Error sending comment update confirmation", e);
                        }
                    }, error -> WebSocketErrorHandler.sendErrorMessage(session,
                            "Error updating comment", error));
        } else {
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in comment.update payload");
        }
    }
}
