package com.example.websocket.handler.post;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.service.PostService;
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
public class PostFetchHandler {
    private static final Logger logger = LoggerFactory.getLogger(PostFetchHandler.class);
    private static final String POST_ID = "postId";
    private final PostService postService;
    private final ObjectMapper objectMapper;

    public PostFetchHandler(PostService postService, ObjectMapper objectMapper) {
        this.postService = postService;
        this.objectMapper = objectMapper;
    }

    public void handleGetAllPosts(WebSocketSession session) {
        logger.info("Handling post.getAll request");

        postService.getAllPosts().collectList().subscribe(posts -> {
            try {
                String result = objectMapper.writeValueAsString(
                        Map.of("type", "post.getAll.success", "payload", Map.of("posts", posts)));
                session.sendMessage(new TextMessage(result));
                logger.info("Sent all posts: {}", result);
            } catch (IOException e) {
                logger.error("Error sending all posts", e);
            }
        }, error -> {
            logger.error("Error fetching all posts", error);
            WebSocketErrorHandler.sendErrorMessage(session, "Error fetching posts", error);
        });
    }

    public void handleGetPost(WebSocketSession session, JsonNode payload) {
        logger.info("Handling post.getById with payload: {}", payload);

        if (payload.hasNonNull(POST_ID)) {
            String postId = payload.get(POST_ID).asText();
            logger.info("Fetching post with postId: {}", postId);
            postService.getPostById(postId).subscribe(post -> {
                try {
                    String postJson = objectMapper.writeValueAsString(post);
                    session.sendMessage(new TextMessage(String.format(
                            "{\"type\":\"post.getById.success\",\"payload\":%s}", postJson)));
                    logger.info("Post retrieved: {}", post);
                } catch (IOException e) {
                    logger.error("Error sending post retrieval confirmation", e);
                }
            }, error -> {
                logger.error("Error retrieving post with postId: {}", postId, error);
                WebSocketErrorHandler.sendErrorMessage(session, "Error retrieving post", error);
            });
        } else {
            logger.error("Missing postId in post.getById payload");
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing postId in post.getById payload", null);
        }
    }
}
