package com.example.mychat.handler;

import com.example.mychat.model.Comment;
import com.example.mychat.model.Notification;
import com.example.mychat.model.User;
import com.example.mychat.service.CommentService;
import com.example.mychat.service.NotificationService;
import com.example.mychat.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.springframework.stereotype.Component;

@Component
public class CommentWebSocketHandler {

    private final CommentService commentService;
    private final NotificationService notificationService;
    private final UserService userService;
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public CommentWebSocketHandler(CommentService commentService,
            NotificationService notificationService, UserService userService) {
        this.commentService = commentService;
        this.notificationService = notificationService;
        this.userService = userService;
    }

    public void handleCreateComment(ChannelHandlerContext ctx, JsonNode dataNode) {
        try {
            Comment comment = OBJECT_MAPPER.treeToValue(dataNode, Comment.class);
            commentService.createComment(comment).subscribe(createdComment -> {
                try {
                    String response = OBJECT_MAPPER.writeValueAsString(createdComment);
                    ctx.channel()
                            .writeAndFlush(new TextWebSocketFrame("Comment created: " + response));

                    // Create a notification
                    Notification notification =
                            new Notification(createdComment.getAuthorId(), "New comment added");
                    notificationService.createNotification(notification)
                            .subscribe(createdNotification -> {
                                // Update the user with the new notification
                                userService.getUserById(createdComment.getAuthorId())
                                        .flatMap(user -> {
                                            user.addNotification(createdNotification);
                                            return userService
                                                    .updateUser(user.getId().toHexString(), user);
                                        }).subscribe();
                            });

                } catch (Exception e) {
                    ctx.channel().writeAndFlush(
                            new TextWebSocketFrame("Error creating comment: " + e.getMessage()));
                }
            });
        } catch (Exception e) {
            ctx.channel().writeAndFlush(
                    new TextWebSocketFrame("Error processing comment data: " + e.getMessage()));
        }
    }
}
