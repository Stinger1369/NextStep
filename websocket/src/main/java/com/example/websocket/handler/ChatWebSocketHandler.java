package com.example.websocket.handler;

import com.example.websocket.model.*;
import com.example.websocket.service.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(ChatWebSocketHandler.class);

    private final UserService userService;
    private final PostService postService;
    private final CommentService commentService;
    private final ConversationService conversationService;
    private final ObjectMapper objectMapper;

    public ChatWebSocketHandler(UserService userService, PostService postService,
            CommentService commentService, ConversationService conversationService,
            ObjectMapper objectMapper) {
        this.userService = userService;
        this.postService = postService;
        this.commentService = commentService;
        this.conversationService = conversationService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session,
            @NonNull TextMessage message) {
        logger.info("Received message: {}", message.getPayload());

        try {
            JsonNode jsonNode = objectMapper.readTree(message.getPayload());
            String messageType = jsonNode.get("type").asText();
            JsonNode payload = jsonNode.get("payload");

            switch (messageType) {
                case "user.create":
                    handleUserCreate(session, payload);
                    break;
                case "post.create":
                    handlePostCreate(session, payload);
                    break;
                case "comment.create":
                    handleCommentCreate(session, payload);
                    break;
                case "conversation.create":
                    handleConversationCreate(session, payload);
                    break;
                case "post.getById":
                    handleGetPost(session, payload);
                    break;
                default:
                    session.sendMessage(new TextMessage(
                            String.format("Unknown message type: %s", messageType)));
            }
        } catch (IOException e) {
            logger.error("Error processing message", e);
        }
    }

    private void handleUserCreate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull("email") && payload.hasNonNull("firstName")
                && payload.hasNonNull("lastName")) {
            User user = new User(payload.get("email").asText(), payload.get("firstName").asText(),
                    payload.get("lastName").asText());

            userService.createUser(user).subscribe(createdUser -> {
                try {
                    session.sendMessage(new TextMessage(
                            String.format("User created with ID: %s", createdUser.getId())));
                    logger.info("User created: {}", createdUser);
                } catch (IOException e) {
                    logger.error("Error sending creation confirmation", e);
                }
            }, error -> sendErrorMessage(session, "Error creating user", error));
        } else {
            sendErrorMessage(session, "Missing fields in user.create payload", null);
        }
    }

    private void handlePostCreate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull("userId") && payload.hasNonNull("content")) {
            Post post = new Post(payload.get("userId").asText(),
                    payload.hasNonNull("title") ? payload.get("title").asText() : "",
                    payload.get("content").asText());

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

    private void handleCommentCreate(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull("userId") && payload.hasNonNull("postId")
                && payload.hasNonNull("content")) {
            Comment comment = new Comment(payload.get("userId").asText(),
                    payload.get("postId").asText(), payload.get("content").asText());

            logger.info("Creating comment: {}", comment);

            commentService.createComment(comment).subscribe(updatedUser -> {
                try {
                    int numComments = updatedUser.getPosts().stream()
                            .filter(post -> post.getId().toString().equals(comment.getPostId()))
                            .findFirst().map(post -> post.getComments().size()).orElse(0);

                    session.sendMessage(new TextMessage(
                            String.format("Comment added to post. Updated post now has %d comments",
                                    numComments)));
                    logger.info("Comment added to post: {}", updatedUser);
                } catch (IOException e) {
                    logger.error("Error sending comment creation confirmation", e);
                }
            }, error -> sendErrorMessage(session, "Error creating comment", error));
        } else {
            sendErrorMessage(session, "Missing fields in comment.create payload", null);
        }
    }

    private void handleConversationCreate(WebSocketSession session, JsonNode payload) {
        String senderId = payload.hasNonNull("senderId") ? payload.get("senderId").asText() : null;
        String receiverId =
                payload.hasNonNull("receiverId") ? payload.get("receiverId").asText() : null;
        String name = payload.hasNonNull("name") ? payload.get("name").asText() : null;
        String initialMessage =
                payload.hasNonNull("message") ? payload.get("message").asText() : null;

        if (senderId == null || receiverId == null || name == null || initialMessage == null) {
            sendErrorMessage(session, "Missing fields in conversation.create payload", null);
            return;
        }

        Conversation conversation = new Conversation(senderId, receiverId, name);

        conversationService.createConversation(conversation, initialMessage)
                .subscribe(createdConversation -> {
                    try {
                        session.sendMessage(new TextMessage(String.format(
                                "Conversation created with ID: %s", createdConversation.getId())));
                        logger.info("Conversation created: {}", createdConversation);
                    } catch (IOException e) {
                        logger.error("Error sending conversation creation confirmation", e);
                    }
                }, error -> sendErrorMessage(session, "Error creating conversation", error));
    }

    private void handleGetPost(WebSocketSession session, JsonNode payload) {
        if (payload.hasNonNull("postId")) {
            String postId = payload.get("postId").asText();
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
            session.sendMessage(new TextMessage(String.format("%s: %s", errorMessage,
                    error != null ? error.getMessage() : "N/A")));
        } catch (IOException e) {
            logger.error("Error sending error message", e);
        }
    }
}
