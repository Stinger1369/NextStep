package com.example.mychat.handler.servicehandlers;

import com.example.mychat.model.Post;
import com.example.mychat.service.PostService;
import com.example.mychat.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bson.types.ObjectId;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class CreatePostHandler {

    private static final Logger logger = LoggerFactory.getLogger(CreatePostHandler.class);
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final ConcurrentMap<String, Boolean> processingPosts = new ConcurrentHashMap<>();

    private final PostService postService;
    private final UserService userService;

    public CreatePostHandler(PostService postService, UserService userService) {
        this.postService = postService;
        this.userService = userService;
    }

    public void handleCreatePost(ChannelHandlerContext ctx, JsonNode dataNode) {
        String userId = dataNode.get("userId").asText();
        String title = dataNode.get("title").asText();
        String content = dataNode.get("content").asText();

        if (userId == null || !ObjectId.isValid(userId)) {
            ctx.channel().writeAndFlush(new TextWebSocketFrame("Invalid userId"));
            return;
        }

        Post post = new Post(userId, title, content);
        logger.info("Post object created: {}", post);

        // Vérifiez si un post avec le même contenu et le même userId est déjà en cours de
        // traitement
        if (processingPosts.putIfAbsent(userId + title + content, true) != null) {
            ctx.channel().writeAndFlush(new TextWebSocketFrame("Post is already being processed"));
            return;
        }

        postService.createPost(post).flatMap(createdPost -> {
            logger.info("Post created in PostService: {}", createdPost);
            return userService.getUserById(createdPost.getUserId()).flatMap(user -> {
                logger.info("User found: {}", user);
                user.addPost(createdPost);
                return userService.updateUser(user.getId().toHexString(), user)
                        .thenReturn(createdPost);
            });
        }).subscribe(createdPost -> {
            try {
                String response = OBJECT_MAPPER.writeValueAsString(createdPost);
                logger.info("Post created successfully: {}", response);
                ctx.channel().writeAndFlush(new TextWebSocketFrame("Post created: " + response));
            } catch (Exception e) {
                logger.error("Error serializing created post: ", e);
                ctx.channel().writeAndFlush(
                        new TextWebSocketFrame("Error creating post: " + e.getMessage()));
            } finally {
                processingPosts.remove(userId + title + content);
            }
        }, error -> {
            logger.error("Error creating post: ", error);
            ctx.channel().writeAndFlush(
                    new TextWebSocketFrame("Error creating post: " + error.getMessage()));
            processingPosts.remove(userId + title + content);
        });
    }
}
