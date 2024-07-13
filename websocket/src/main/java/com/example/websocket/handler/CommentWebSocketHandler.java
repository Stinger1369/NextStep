package com.example.websocket.handler;

import com.example.websocket.model.Comment;
import com.example.websocket.service.CommentService;
import com.example.websocket.service.PostService;
import com.example.websocket.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Map;

@Component
public class CommentWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(CommentWebSocketHandler.class);
    private static final String USER_ID = "userId";
    private static final String POST_ID = "postId";
    private static final String CONTENT = "content";
    private static final String COMMENT_ID = "commentId";
    private static final String PAYLOAD = "payload";
    private static final String CREATED_AT = "createdAt";
    private static final String UPDATED_AT = "updatedAt";
    private static final String FIRST_NAME = "firstName";
    private static final String LAST_NAME = "lastName";

    private final CommentService commentService;
    private final PostService postService;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    public CommentWebSocketHandler(CommentService commentService, PostService postService,
            UserService userService, ObjectMapper objectMapper) {
        this.commentService = commentService;
        this.postService = postService;
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        switch (messageType) {
            case "comment.create":
                handleCommentCreate(session, payload);
                break;
            case "comment.update":
                handleCommentUpdate(session, payload);
                break;
            case "comment.delete":
                handleCommentDelete(session, payload);
                break;
            case "comment.getById":
                handleGetCommentById(session, payload);
                break;
            case "comment.getAll":
                handleGetAllComments(session);
                break;
            default:
                sendErrorMessage(session, "Unknown comment message type: " + messageType);
        }
    }

    private void handleCommentCreate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(POST_ID)
                && payload.hasNonNull(CONTENT)) {
            String userId = payload.get(USER_ID).asText();
            String postId = payload.get(POST_ID).asText();
            String content = payload.get(CONTENT).asText();

            userService.getUserById(userId).flatMap(user -> {
                Comment comment = new Comment(userId, postId, user.getFirstName(),
                        user.getLastName(), content);

                logger.info("Creating comment: {}", comment);

                return commentService.createComment(comment).flatMap(savedComment -> postService
                        .addCommentToPost(postId, savedComment).thenReturn(savedComment));
            }).subscribe(savedComment -> {
                try {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
                    String createdAt = sdf.format(savedComment.getCreatedAt());
                    String updatedAt = sdf.format(savedComment.getUpdatedAt());

                    String result = objectMapper.writeValueAsString(Map.of("type",
                            "comment.create.success", PAYLOAD,
                            Map.of(COMMENT_ID, savedComment.getId(), POST_ID,
                                    savedComment.getPostId(), USER_ID, savedComment.getUserId(),
                                    FIRST_NAME, savedComment.getFirstName(), LAST_NAME,
                                    savedComment.getLastName(), CONTENT, savedComment.getContent(),
                                    CREATED_AT, createdAt, UPDATED_AT, updatedAt)));
                    session.sendMessage(new TextMessage(result));
                    logger.info("Comment created and added to post: {}", savedComment);
                } catch (IOException e) {
                    logger.error("Error sending comment creation confirmation", e);
                }
            }, error -> sendErrorMessage(session, "Error creating comment", error));
        } else {
            sendErrorMessage(session, "Missing fields in comment.create payload", null);
        }
    }

    private void handleCommentUpdate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(COMMENT_ID) && payload.hasNonNull(CONTENT)) {
            String commentId = payload.get(COMMENT_ID).asText();
            String content = payload.get(CONTENT).asText();

            commentService.updateComment(commentId, new Comment(null, null, null, null, content))
                    .subscribe(updatedComment -> {
                        try {
                            String result = objectMapper.writeValueAsString(
                                    Map.of("type", "comment.update.success", PAYLOAD,
                                            Map.of(COMMENT_ID, updatedComment.getId(), USER_ID,
                                                    updatedComment.getUserId(), POST_ID,
                                                    updatedComment.getPostId(), CONTENT,
                                                    updatedComment.getContent(), CREATED_AT,
                                                    updatedComment.getCreatedAt(), UPDATED_AT,
                                                    updatedComment.getUpdatedAt())));
                            session.sendMessage(new TextMessage(result));
                            logger.info("Comment updated: {}", updatedComment);
                        } catch (IOException e) {
                            logger.error("Error sending comment update confirmation", e);
                        }
                    }, error -> sendErrorMessage(session, "Error updating comment", error));
        } else {
            sendErrorMessage(session, "Missing fields in comment.update payload", null);
        }
    }

    private void handleCommentDelete(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(COMMENT_ID)) {
            String commentId = payload.get(COMMENT_ID).asText();

            commentService.deleteComment(commentId).subscribe(updatedUser -> {
                try {
                    String result = objectMapper.writeValueAsString(Map.of("type",
                            "comment.delete.success", PAYLOAD, Map.of(COMMENT_ID, commentId)));
                    session.sendMessage(new TextMessage(result));
                    logger.info("Comment deleted: {}", commentId);
                } catch (IOException e) {
                    logger.error("Error sending comment deletion confirmation", e);
                }
            }, error -> sendErrorMessage(session, "Error deleting comment", error));
        } else {
            sendErrorMessage(session, "Missing commentId in comment.delete payload", null);
        }
    }

    private void handleGetCommentById(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(COMMENT_ID)) {
            String commentId = payload.get(COMMENT_ID).asText();

            commentService.getCommentById(commentId).subscribe(comment -> {
                try {
                    String result = objectMapper.writeValueAsString(Map.of("type",
                            "comment.getById.success", PAYLOAD,
                            Map.of(COMMENT_ID, comment.getId(), USER_ID, comment.getUserId(),
                                    POST_ID, comment.getPostId(), CONTENT, comment.getContent(),
                                    CREATED_AT, comment.getCreatedAt(), UPDATED_AT,
                                    comment.getUpdatedAt(), FIRST_NAME, comment.getFirstName(),
                                    LAST_NAME, comment.getLastName())));
                    session.sendMessage(new TextMessage(result));
                    logger.info("Comment retrieved: {}", comment);
                } catch (IOException e) {
                    logger.error("Error sending comment retrieval confirmation", e);
                }
            }, error -> sendErrorMessage(session, "Error retrieving comment", error));
        } else {
            sendErrorMessage(session, "Missing fields in comment.getById payload", null);
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
        }, error -> sendErrorMessage(session, "Error fetching comments", error));
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage, Throwable error) {
        logger.error("{}: {}", errorMessage, error != null ? error.getMessage() : "N/A", error);
        try {
            String result = objectMapper
                    .writeValueAsString(Map.of("type", "error", PAYLOAD, Map.of("message",
                            errorMessage, "details", error != null ? error.getMessage() : "N/A")));
            session.sendMessage(new TextMessage(result));
        } catch (IOException e) {
            logger.error("Error sending error message", e);
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage) {
        sendErrorMessage(session, errorMessage, null);
    }
}
