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
public class PostUnlikeHandler {
    private static final Logger logger = LoggerFactory.getLogger(PostUnlikeHandler.class);
    private static final String POST_ID = "postId";
    private static final String USER_ID = "userId";
    private final PostService postService;

    public PostUnlikeHandler(PostService postService) {
        this.postService = postService;
    }

    public void handleUnlikePost(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(POST_ID) && payload.hasNonNull(USER_ID)) {
            String postId = payload.get(POST_ID).asText();
            String userId = payload.get(USER_ID).asText();
            postService.unlikePost(postId, userId).subscribe(post -> {
                try {
                    session.sendMessage(new TextMessage(String.format(
                            "{\"type\":\"post.unlike.success\",\"payload\":{\"postId\":\"%s\"}}",
                            postId)));
                    logger.info("Post unliked: {}", post);
                } catch (IOException e) {
                    logger.error("Error sending post unlike confirmation", e);
                }
            }, error -> WebSocketErrorHandler.sendErrorMessage(session, "Error unliking post",
                    error));
        } else {
            WebSocketErrorHandler.sendErrorMessage(session, "Missing fields in post.unlike payload",
                    null);
        }
    }
}
