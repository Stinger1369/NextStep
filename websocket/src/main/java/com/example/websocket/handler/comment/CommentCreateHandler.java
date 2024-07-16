package com.example.websocket.handler.comment;

import com.example.websocket.handler.WebSocketErrorHandler;
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
public class CommentCreateHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommentCreateHandler.class);
    private static final String USER_ID = "userId";
    private static final String POST_ID = "postId";
    private static final String CONTENT = "content";
    private static final String PAYLOAD = "payload";
    private static final String COMMENT_ID = "commentId";
    private static final String CREATED_AT = "createdAt";
    private static final String UPDATED_AT = "updatedAt";
    private static final String FIRST_NAME = "firstName";
    private static final String LAST_NAME = "lastName";

    private final CommentService commentService;
    private final PostService postService;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    public CommentCreateHandler(CommentService commentService, PostService postService,
            UserService userService, ObjectMapper objectMapper) {
        this.commentService = commentService;
        this.postService = postService;
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    public void handleCommentCreate(WebSocketSession session, JsonNode payload) {
        logger.info("handleCommentCreate called with payload: {}", payload);

        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(POST_ID)
                && payload.hasNonNull(CONTENT)) {
            String userId = payload.get(USER_ID).asText();
            String postId = payload.get(POST_ID).asText();
            String content = payload.get(CONTENT).asText();

            logger.info("Creating comment for userId: {}, postId: {}", userId, postId);

            userService.getUserById(userId).flatMap(user -> {
                Comment comment = new Comment(userId, postId, user.getFirstName(),
                        user.getLastName(), content);

                logger.info("Generated comment: {}", comment);

                return commentService.createComment(comment).flatMap(savedComment -> {
                    logger.info("Comment created: {}. Adding to postId: {}", savedComment, postId);
                    return postService.addCommentToPost(postId, savedComment).thenReturn(savedComment);
                });
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
                    logger.info("Comment creation message sent: {}", savedComment);
                } catch (IOException e) {
                    logger.error("Error sending comment creation confirmation", e);
                }
            }, error -> {
                logger.error("Error creating comment", error);
                WebSocketErrorHandler.sendErrorMessage(session, "Error creating comment", error);
            });
        } else {
            logger.warn("Missing fields in comment.create payload: {}", payload);
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in comment.create payload");
        }
    }
}
