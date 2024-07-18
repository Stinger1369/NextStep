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
public class PostImageHandler {

    private static final Logger logger = LoggerFactory.getLogger(PostImageHandler.class);
    private static final String POST_ID = "postId";
    private static final String USER_ID = "userId";
    private static final String IMAGE_NAME = "imageName";
    private static final String BASE64_DATA = "base64Data";
    private static final String PAYLOAD = "payload";

    private final PostService postService;
    private final ObjectMapper objectMapper;

    public PostImageHandler(PostService postService, ObjectMapper objectMapper) {
        this.postService = postService;
        this.objectMapper = objectMapper;
    }

    public void handleAddImageToPost(WebSocketSession session, JsonNode payload) {
        logger.info("Handling add image to post with payload: {}", payload);

        String postId = payload.hasNonNull(POST_ID) ? payload.get(POST_ID).asText() : null;
        String userId = payload.hasNonNull(USER_ID) ? payload.get(USER_ID).asText() : null;
        String imageName = payload.hasNonNull(IMAGE_NAME) ? payload.get(IMAGE_NAME).asText() : null;
        String base64Data =
                payload.hasNonNull(BASE64_DATA) ? payload.get(BASE64_DATA).asText() : null;

        if (postId == null || userId == null || imageName == null || base64Data == null) {
            logger.error("Missing fields in post.addImage payload");
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in post.addImage payload");
            return;
        }

        logger.info("Adding image to post with ID: {} by user ID: {}", postId, userId);

        postService.addImageToPost(postId, userId, imageName, base64Data).subscribe(post -> {
            try {
                String result = objectMapper.writeValueAsString(Map.of("type",
                        "post.addImage.success", PAYLOAD, Map.of(POST_ID, post.getId())));
                session.sendMessage(new TextMessage(result));
                logger.info("Image added to post: {}", post);
            } catch (IOException e) {
                logger.error("Error sending post image addition confirmation", e);
            }
        }, error -> {
            logger.error("Error adding image to post with ID: {} by user ID: {}", postId, userId,
                    error);
            WebSocketErrorHandler.sendErrorMessage(session, "Error adding image to post", error);
        });
    }
}
