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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class PostWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(PostWebSocketHandler.class);
    private static final String USER_ID = "userId";
    private static final String POST_ID = "postId";
    private static final String CONTENT = "content";
    private static final String TITLE = "title";

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
            case "post.delete":
                handleDeletePost(session, payload);
                break;
            default:
                sendErrorMessage(session, "Unknown post message type: " + messageType);
        }
    }

    private void handlePostCreate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(CONTENT)) {
            String userId = payload.get(USER_ID).asText();
            String content = payload.get(CONTENT).asText();
            String title =
                    payload.hasNonNull(TITLE) ? payload.get(TITLE).asText() : "Default Title";

            Post post = new Post(userId, title, content);

            postService.createPost(post).subscribe(createdPost -> {
                try {
                    String response = objectMapper
                            .writeValueAsString(Map.of("type", "post.create.success", "payload",
                                    Map.of("postId", createdPost.getId().toHexString())));
                    session.sendMessage(new TextMessage(response));
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
                List<Map<String, Object>> postList = posts.stream()
                        .map(post -> Map.of("_id", post.getId().toHexString(), "userId",
                                post.getUserId(), "title", post.getTitle(), "content",
                                post.getContent(), "createdAt", post.getCreatedAt(), "updatedAt",
                                post.getUpdatedAt(), "comments", post.getComments()))
                        .collect(Collectors.toList());

                String response = objectMapper.writeValueAsString(Map.of("type",
                        "post.getAll.success", "payload", Map.of("posts", postList)));
                session.sendMessage(new TextMessage(response));
                logger.info("Sent all posts: {}", response);
            } catch (IOException e) {
                logger.error("Error sending all posts", e);
            }
        }, error -> sendErrorMessage(session, "Error fetching posts", error));
    }

    private void handleGetPost(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(POST_ID)) {
            String postId = payload.get(POST_ID).asText();
            postService.getPostById(postId).subscribe(post -> {
                try {
                    String response = objectMapper.writeValueAsString(Map.of("type",
                            "post.getById.success", "payload",
                            Map.of("id", post.getId().toHexString(), "userId", post.getUserId(),
                                    "title", post.getTitle(), "content", post.getContent(),
                                    "createdAt", post.getCreatedAt(), "updatedAt",
                                    post.getUpdatedAt(), "comments", post.getComments())));
                    session.sendMessage(new TextMessage(response));
                    logger.info("Post retrieved: {}", post);
                } catch (IOException e) {
                    logger.error("Error sending post retrieval confirmation", e);
                }
            }, error -> sendErrorMessage(session, "Error retrieving post", error));
        } else {
            sendErrorMessage(session, "Missing postId in post.getById payload", null);
        }
    }

    private void handleDeletePost(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull(POST_ID)) {
            String postId = payload.get(POST_ID).asText();
            postService.deletePost(postId).subscribe(unused -> {
                try {
                    String response = objectMapper.writeValueAsString(Map.of("type",
                            "post.delete.success", "payload", Map.of("postId", postId)));
                    session.sendMessage(new TextMessage(response));
                    logger.info("Post deleted with ID: {}", postId);
                } catch (IOException e) {
                    logger.error("Error sending post deletion confirmation", e);
                }
            }, error -> sendErrorMessage(session, "Error deleting post", error));
        } else {
            sendErrorMessage(session, "Missing postId in post.delete payload", null);
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage, Throwable error) {
        logger.error("{}: {}", errorMessage, error != null ? error.getMessage() : "N/A", error);
        try {
            String response = objectMapper
                    .writeValueAsString(Map.of("type", "error", "payload", Map.of("message",
                            errorMessage + (error != null ? ": " + error.getMessage() : ""))));
            session.sendMessage(new TextMessage(response));
        } catch (IOException e) {
            logger.error("Error sending error message", e);
        }
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage) {
        sendErrorMessage(session, errorMessage, null);
    }
}
