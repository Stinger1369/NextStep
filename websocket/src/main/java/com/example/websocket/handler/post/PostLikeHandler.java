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
public class PostLikeHandler {
    private static final Logger logger = LoggerFactory.getLogger(PostLikeHandler.class);
    private static final String POST_ID = "postId";
    private static final String USER_ID = "userId";
    private final PostService postService;

    public PostLikeHandler(PostService postService) {
        this.postService = postService;
    }

    public void handleLikePost(WebSocketSession session, JsonNode payload) {
        logger.info("Handling post.like with payload: {}", payload);

        if (payload.hasNonNull(POST_ID) && payload.hasNonNull(USER_ID)) {
            String postId = payload.get(POST_ID).asText();
            String userId = payload.get(USER_ID).asText();
            logger.info("Liking post with postId: {} by userId: {}", postId, userId);
            postService.likePost(postId, userId).subscribe(post -> {
                try {
                    session.sendMessage(new TextMessage(String.format(
                            "{\"type\":\"post.like.success\",\"payload\":{\"postId\":\"%s\"}}",
                            postId)));
                    logger.info("Post liked successfully: {}", post);
                } catch (IOException e) {
                    logger.error("Error sending post like confirmation", e);
                }
            }, error -> {
                logger.error("Error liking post with postId: {} by userId: {}", postId, userId,
                        error);
                WebSocketErrorHandler.sendErrorMessage(session, error.getMessage(), error);
            });
        } else {
            logger.error("Missing fields in post.like payload: postId={}, userId={}",
                    payload.hasNonNull(POST_ID), payload.hasNonNull(USER_ID));
            WebSocketErrorHandler.sendErrorMessage(session, "Missing fields in post.like payload",
                    null);
        }
    }
}
