package com.example.websocket.handler;

import com.example.websocket.model.Post;
import com.example.websocket.service.PostService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.Map;

@Component
public class PostWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(PostWebSocketHandler.class);
    private static final String USER_ID = "userId";
    private static final String POST_ID = "postId";
    private static final String CONTENT = "content";

    private final PostService postService;
    private final ObjectMapper objectMapper;

    public PostWebSocketHandler(PostService postService, ObjectMapper objectMapper) {
        this.postService = postService;
        this.objectMapper = objectMapper;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        switch (messageType) {
            case "post.create":
                handlePostCreate(session, payload);
                break;
            case "post.getById":
                handleGetPost(session, payload);
                break;
            case "post.getAll":
                handleGetAllPosts(session);
                break;
            default:
                sendErrorMessage(session, "Unknown post message type: " + messageType);
        }
    }

    private void handlePostCreate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(CONTENT)) {
            Post post = new Post(payload.get(USER_ID).asText(),
                    payload.hasNonNull("title") ? payload.get("title").asText() : "",
                    payload.get(CONTENT).asText());

            postService.createPost(post).subscribe(createdPost -> {
                try {
                    session.sendMessage(new TextMessage(
                            String.format("Post created with ID: %s", createdPost.getId())));
                    logger.info("Post created: {}", createdPost);
                } catch (IOException e) {
                    logger.error("Error sending post creation confirmation", e);
                }
            }, error -> sendErrorMessage(session, "Error creating post", error));
        } else {
            sendErrorMessage(session, "Missing fields in post.create payload", null);
        }
    }

    private void handleGetAllPosts(WebSocketSession session) {
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
            try {
                session.sendMessage(new TextMessage(
                        "{\"type\":\"error\",\"payload\":{\"message\":\"Error fetching posts\"}}"));
                logger.error("Error fetching posts", error);
            } catch (IOException e) {
                logger.error("Error sending error message", e);
            }
        });
    }

    private void handleGetPost(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(POST_ID)) {
            String postId = payload.get(POST_ID).asText();
            postService.getPostById(postId).subscribe(post -> {
                try {
                    session.sendMessage(new TextMessage(String.format(
                            "Post retrieved. It has %d comments", post.getComments().size())));
                    logger.info("Post retrieved: {}", post);
                } catch (IOException e) {
                    logger.error("Error sending post retrieval confirmation", e);
                }
            }, error -> sendErrorMessage(session, "Error retrieving post", error));
        } else {
            sendErrorMessage(session, "Missing postId in post.getById payload", null);
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage, Throwable error) {
        logger.error("{}: {}", errorMessage, error != null ? error.getMessage() : "N/A", error);
        try {
            session.sendMessage(new TextMessage(
                    String.format("{\"type\":\"error\",\"payload\":{\"message\":\"%s: %s\"}}",
                            errorMessage, error != null ? error.getMessage() : "N/A")));
        } catch (IOException e) {
            logger.error("Error sending error message", e);
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage) {
        sendErrorMessage(session, errorMessage, null);
    }
}
