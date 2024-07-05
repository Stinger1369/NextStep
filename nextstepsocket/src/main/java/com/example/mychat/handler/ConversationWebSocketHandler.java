package com.example.mychat.handler;

import com.example.mychat.model.Notification;
import com.example.mychat.model.User;
import com.example.mychat.service.ConversationService;
import com.example.mychat.service.NotificationService;
import com.example.mychat.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.springframework.stereotype.Component;

@Component
public class ConversationWebSocketHandler {

    private final ConversationService conversationService;
    private final NotificationService notificationService;
    private final UserService userService;
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public ConversationWebSocketHandler(ConversationService conversationService,
            NotificationService notificationService, UserService userService) {
        this.conversationService = conversationService;
        this.notificationService = notificationService;
        this.userService = userService;
    }

    public void handleCreateConversation(ChannelHandlerContext ctx, JsonNode dataNode) {
        try {
            String senderId = dataNode.get("senderId").asText();
            String receiverId = dataNode.get("receiverId").asText();
            String content = dataNode.get("content").asText();

            conversationService.addMessageToConversation(senderId, receiverId, content)
                    .subscribe(conversation -> {
                        try {
                            String response = OBJECT_MAPPER.writeValueAsString(conversation);
                            ctx.channel().writeAndFlush(
                                    new TextWebSocketFrame("Conversation updated: " + response));

                            // Create a notification
                            Notification notification =
                                    new Notification(receiverId, "New message received");
                            notificationService.createNotification(notification)
                                    .subscribe(createdNotification -> {
                                        // Update the user with the new notification
                                        userService.getUserById(receiverId).flatMap(user -> {
                                            user.addNotification(createdNotification);
                                            return userService
                                                    .updateUser(user.getId().toHexString(), user);
                                        }).subscribe();
                                    });

                        } catch (Exception e) {
                            ctx.channel().writeAndFlush(new TextWebSocketFrame(
                                    "Error creating conversation: " + e.getMessage()));
                        }
                    });
        } catch (Exception e) {
            ctx.channel().writeAndFlush(new TextWebSocketFrame(
                    "Error processing conversation data: " + e.getMessage()));
        }
    }
}
