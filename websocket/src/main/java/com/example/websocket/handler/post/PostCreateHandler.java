package com.example.websocket.handler.post;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.model.Post;
import com.example.websocket.service.PostService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Component
public class PostCreateHandler {
    private static final Logger logger = LoggerFactory.getLogger(PostCreateHandler.class);
    private static final String USER_ID = "userId";
    private static final String CONTENT = "content";
    private static final String TITLE = "title";
    private final PostService postService;

    public PostCreateHandler(PostService postService) {
        this.postService = postService;
    }

    public void handlePostCreate(WebSocketSession session, JsonNode payload) {
        logger.info("Handling post.create with payload: {}", payload);

        if (payload.hasNonNull(USER_ID) && payload.hasNonNull(CONTENT)
                && payload.hasNonNull(TITLE)) {
            String userId = payload.get(USER_ID).asText();
            String title = payload.get(TITLE).asText();
            String content = payload.get(CONTENT).asText();

            logger.info("Creating post with userId: {}, title: {}, content: {}", userId, title,
                    content);

            postService.createPost(new Post(userId, null, null, title, content))
                    .subscribe(createdPost -> {
                        try {
                            session.sendMessage(new TextMessage(String.format(
                                    "{\"type\":\"post.create.success\",\"payload\":{\"postId\":\"%s\", \"content\":\"%s\"}}",
                                    createdPost.getId(), createdPost.getContent())));
                            logger.info("Post created: {}", createdPost);
                        } catch (IOException e) {
                            logger.error("Error sending post creation confirmation", e);
                        }
                    }, error -> WebSocketErrorHandler.sendErrorMessage(session,
                            "Error creating post", error));
        } else {
            logger.error("Missing fields in post.create payload: userId={}, title={}, content={}",
                    payload.hasNonNull(USER_ID), payload.hasNonNull(TITLE),
                    payload.hasNonNull(CONTENT));
            WebSocketErrorHandler.sendErrorMessage(session, "Missing fields in post.create payload",
                    null);
        }
    }
}

