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
public class PostRepostHandler {
    private static final Logger logger = LoggerFactory.getLogger(PostRepostHandler.class);
    private static final String POST_ID = "postId";
    private static final String USER_ID = "userId";
    private final PostService postService;

    public PostRepostHandler(PostService postService) {
        this.postService = postService;
    }

    public void handleRepostPost(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(POST_ID) && payload.hasNonNull(USER_ID)) {
            String postId = payload.get(POST_ID).asText();
            String userId = payload.get(USER_ID).asText();
            postService.repostPost(postId, userId).subscribe(post -> {
                try {
                    session.sendMessage(new TextMessage(String.format(
                            "{\"type\":\"post.repost.success\",\"payload\":{\"postId\":\"%s\"}}",
                            postId)));
                    logger.info("Post reposted: {}", post);
                } catch (IOException e) {
                    logger.error("Error sending post repost confirmation", e);
                }
            }, error -> WebSocketErrorHandler.sendErrorMessage(session, "Error reposting post",
                    error));
        } else {
            WebSocketErrorHandler.sendErrorMessage(session, "Missing fields in post.repost payload",
                    null);
        }
    }
}
