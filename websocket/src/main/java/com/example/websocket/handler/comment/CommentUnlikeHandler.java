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
public class CommentUnlikeHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommentUnlikeHandler.class);
    private static final String COMMENT_ID = "commentId";
    private static final String USER_ID = "userId";
    private static final String PAYLOAD = "payload";
    private final CommentService commentService;
    private final ObjectMapper objectMapper;

    public CommentUnlikeHandler(CommentService commentService, ObjectMapper objectMapper) {
        this.commentService = commentService;
        this.objectMapper = objectMapper;
    }

    public void handleCommentUnlike(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(COMMENT_ID)) {
            String userId = payload.get(USER_ID).asText();
            String commentId = payload.get(COMMENT_ID).asText();

            commentService.unlikeComment(commentId, userId).subscribe(unlikedComment -> {
                try {
                    String result = objectMapper
                            .writeValueAsString(Map.of("type", "comment.unlike.success", PAYLOAD,
                                    Map.of(COMMENT_ID, unlikedComment.getId(), USER_ID, userId)));
                    session.sendMessage(new TextMessage(result));
                    logger.info("Comment unliked: {}", unlikedComment);
                } catch (IOException e) {
                    logger.error("Error sending comment unlike confirmation", e);
                }
            }, error -> WebSocketErrorHandler.sendErrorMessage(session, "Error unliking comment",
                    error));
        } else {
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in comment.unlike payload");
        }
    }
}
