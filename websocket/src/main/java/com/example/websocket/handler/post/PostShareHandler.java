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
public class PostShareHandler {
    private static final Logger logger = LoggerFactory.getLogger(PostShareHandler.class);
    private static final String POST_ID = "postId";
    private static final String USER_ID = "userId";
    private static final String EMAIL = "email";
    private final PostService postService;

    public PostShareHandler(PostService postService) {
        this.postService = postService;
    }

    public void handleSharePost(WebSocketSession session, JsonNode payload) {
        logger.info("Handling post.share with payload: {}", payload);

        if (payload.hasNonNull(POST_ID) && payload.hasNonNull(USER_ID)
                && payload.hasNonNull(EMAIL)) {
            String postId = payload.get(POST_ID).asText();
            String userId = payload.get(USER_ID).asText();
            String email = payload.get(EMAIL).asText();
            logger.info("Sharing post with postId: {} to email: {}", postId, email);
            postService.sharePost(postId, userId, email).subscribe(post -> {
                try {
                    session.sendMessage(new TextMessage(String.format(
                            "{\"type\":\"post.share.success\",\"payload\":{\"postId\":\"%s\"}}",
                            postId)));
                    logger.info("Post shared successfully: {}", post);
                } catch (IOException e) {
                    logger.error("Error sending post share confirmation", e);
                }
            }, error -> {
                logger.error("Error sharing post with postId: {} to email: {}", postId, email,
                        error);
                WebSocketErrorHandler.sendErrorMessage(session, "Error sharing post", error);
            });
        } else {
            logger.error("Missing fields in post.share payload: postId={}, email={}",
                    payload.hasNonNull(POST_ID), payload.hasNonNull(EMAIL));
            WebSocketErrorHandler.sendErrorMessage(session, "Missing fields in post.share payload",
                    null);
        }
    }
}
