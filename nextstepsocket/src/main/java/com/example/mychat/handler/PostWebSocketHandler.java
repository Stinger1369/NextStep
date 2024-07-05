package com.example.mychat.handler;

import com.example.mychat.model.Notification;
import com.example.mychat.model.Post;
import com.example.mychat.model.User;
import com.example.mychat.service.NotificationService;
import com.example.mychat.service.PostService;
import com.example.mychat.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.springframework.stereotype.Component;

@Component
public class PostWebSocketHandler {

    private final PostService postService;
    private final NotificationService notificationService;
    private final UserService userService;
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public PostWebSocketHandler(PostService postService, NotificationService notificationService,
            UserService userService) {
        this.postService = postService;
        this.notificationService = notificationService;
        this.userService = userService;
    }

    public void handleCreatePost(ChannelHandlerContext ctx, JsonNode dataNode) {
        try {
            Post post = OBJECT_MAPPER.treeToValue(dataNode, Post.class);
            postService.createPost(post).subscribe(createdPost -> {
                try {
                    String response = OBJECT_MAPPER.writeValueAsString(createdPost);
                    ctx.channel()
                            .writeAndFlush(new TextWebSocketFrame("Post created: " + response));

                    // Create a notification
                    Notification notification =
                            new Notification(createdPost.getUserId(), "New post created");
                    notificationService.createNotification(notification)
                            .subscribe(createdNotification -> {
                                // Update the user with the new notification
                                userService.getUserById(createdPost.getUserId()).flatMap(user -> {
                                    user.addNotification(createdNotification);
                                    return userService.updateUser(user.getId().toHexString(), user);
                                }).subscribe();
                            });

                } catch (Exception e) {
                    ctx.channel().writeAndFlush(
                            new TextWebSocketFrame("Error creating post: " + e.getMessage()));
                }
            });
        } catch (Exception e) {
            ctx.channel().writeAndFlush(
                    new TextWebSocketFrame("Error processing post data: " + e.getMessage()));
        }
    }
}
