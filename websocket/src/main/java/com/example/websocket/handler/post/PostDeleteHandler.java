package com.example.websocket.handler.post;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.PostService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Component
public class PostDeleteHandler {
    private static final Logger logger = LoggerFactory.getLogger(PostDeleteHandler.class);
    private static final String POST_ID = "postId";
    private static final String USER_ID = "userId";
    private final PostService postService;

    public PostDeleteHandler(PostService postService) {
        this.postService = postService;
    }

    public void handleDeletePost(WebSocketSession session, JsonNode payload) {
        logger.info("Handling post.delete with payload: {}", payload);

        if (payload.hasNonNull(POST_ID) && payload.hasNonNull(USER_ID)) {
            String postId = payload.get(POST_ID).asText();
            String userId = payload.get(USER_ID).asText();
            logger.info("Deleting post with postId: {} and userId: {}", postId, userId);
            postService.deletePost(postId, userId).subscribe(unused -> {
                try {
                    session.sendMessage(new TextMessage(String.format(
                            "{\"type\":\"post.delete.success\",\"payload\":{\"postId\":\"%s\"}}",
                            postId)));
                    logger.info("Post deleted successfully: {}", postId);
                } catch (IOException e) {
                    logger.error("Error sending post deletion confirmation", e);
                }
            }, error -> {
                logger.error("Error deleting post with postId: {} and userId: {}", postId, userId, error);
                WebSocketErrorHandler.sendErrorMessage(session, "Error deleting post", error);
            });
        } else {
            logger.error("Missing fields in post.delete payload: postId={}, userId={}",
                    payload.hasNonNull(POST_ID), payload.hasNonNull(USER_ID));
            WebSocketErrorHandler.sendErrorMessage(session, "Missing fields in post.delete payload", null);
        }
    }
}
