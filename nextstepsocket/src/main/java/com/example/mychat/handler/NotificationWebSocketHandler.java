package com.example.mychat.handler;

import com.example.mychat.model.Notification;
import com.example.mychat.service.NotificationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.springframework.stereotype.Component;

@Component
public class NotificationWebSocketHandler {

    private final NotificationService notificationService;
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public NotificationWebSocketHandler(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public void handleCreateNotification(ChannelHandlerContext ctx, JsonNode dataNode) {
        try {
            Notification notification = OBJECT_MAPPER.treeToValue(dataNode, Notification.class);
            notificationService.createNotification(notification).subscribe(createdNotification -> {
                try {
                    String response = OBJECT_MAPPER.writeValueAsString(createdNotification);
                    ctx.channel().writeAndFlush(
                            new TextWebSocketFrame("Notification created: " + response));
                } catch (Exception e) {
                    ctx.channel().writeAndFlush(new TextWebSocketFrame(
                            "Error creating notification: " + e.getMessage()));
                }
            });
        } catch (Exception e) {
            ctx.channel().writeAndFlush(new TextWebSocketFrame(
                    "Error processing notification data: " + e.getMessage()));
        }
    }
}
