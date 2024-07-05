package com.example.mychat.handler;

import com.example.mychat.model.User;
import com.example.mychat.service.UserService;
import com.example.mychat.websocket.WebSocketManager;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.springframework.stereotype.Component;

@Component
public class UserWebSocketHandler {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private final UserService userService;
    private final WebSocketManager webSocketManager;

    public UserWebSocketHandler(UserService userService, WebSocketManager webSocketManager) {
        this.userService = userService;
        this.webSocketManager = webSocketManager;
    }

    public void handleCreateUser(JsonNode dataNode, ChannelHandlerContext ctx) {
        try {
            User user = OBJECT_MAPPER.treeToValue(dataNode, User.class);
            userService.createUser(user).subscribe(createdUser -> {
                try {
                    String response = OBJECT_MAPPER.writeValueAsString(createdUser);
                    webSocketManager.broadcastMessage("New user created: " + response);
                    ctx.channel()
                            .writeAndFlush(new TextWebSocketFrame("User created: " + response));
                } catch (JsonProcessingException e) {
                    ctx.channel().writeAndFlush(new TextWebSocketFrame(
                            "Error creating user response: " + e.getMessage()));
                }
            });
        } catch (JsonProcessingException e) {
            ctx.channel().writeAndFlush(
                    new TextWebSocketFrame("Error parsing user data: " + e.getMessage()));
        }
    }
}
