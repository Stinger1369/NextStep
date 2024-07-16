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
public class PostUpdateHandler {
    private static final Logger logger = LoggerFactory.getLogger(PostUpdateHandler.class);
    private static final String POST_ID = "postId";
    private static final String TITLE = "title";
    private static final String CONTENT = "content";
    private final PostService postService;

    public PostUpdateHandler(PostService postService) {
        this.postService = postService;
    }

    public void handleUpdatePost(WebSocketSession session, JsonNode payload) {
        logger.info("Handling post.update with payload: {}", payload);

        if (payload.hasNonNull(POST_ID) && payload.hasNonNull(TITLE)
                && payload.hasNonNull(CONTENT)) {
            String postId = payload.get(POST_ID).asText();
            String title = payload.get(TITLE).asText();
            String content = payload.get(CONTENT).asText();

            logger.info("Updating post with postId: {}, title: {}, content: {}", postId, title,
                    content);

            Post post = new Post();
            post.setTitle(title);
            post.setContent(content);

            postService.updatePost(postId, post).subscribe(updatedPost -> {
                try {
                    session.sendMessage(new TextMessage(String.format(
                            "{\"type\":\"post.update.success\",\"payload\":{\"postId\":\"%s\"}}",
                            updatedPost.getId())));
                    logger.info("Post updated successfully: {}", updatedPost);
                } catch (IOException e) {
                    logger.error("Error sending post update confirmation", e);
                }
            }, error -> {
                logger.error("Error updating post with postId: {}", postId, error);
                WebSocketErrorHandler.sendErrorMessage(session, "Error updating post", error);
            });
        } else {
            logger.error("Missing fields in post.update payload: postId={}, title={}, content={}",
                    payload.hasNonNull(POST_ID), payload.hasNonNull(TITLE),
                    payload.hasNonNull(CONTENT));
            WebSocketErrorHandler.sendErrorMessage(session, "Missing fields in post.update payload",
                    null);
        }
    }
}
