package com.example.mychat.handler.servicehandlers;

import com.example.mychat.model.User;
import com.example.mychat.service.ApiKeyService;
import com.example.mychat.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class LoginHandler {

    private static final Logger logger = LoggerFactory.getLogger(LoginHandler.class);
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final UserService userService;
    private final ApiKeyService apiKeyService;

    public LoginHandler(UserService userService, ApiKeyService apiKeyService) {
        this.userService = userService;
        this.apiKeyService = apiKeyService;
    }

    public void handleUserLogin(ChannelHandlerContext ctx, JsonNode dataNode) {
        String userId = dataNode.get("userId").asText();
        String username = dataNode.get("username").asText(null);
        String email = dataNode.get("email").asText(null);

        logger.info("Handling user login for userId: {}", userId);
        logger.info("Username: {}, Email: {}", username, email);

        userService.getUserById(userId).switchIfEmpty(Mono.defer(() -> {
            logger.info("Creating new user with userId: {}", userId);
            User newUser = new User();
            newUser.setId(new ObjectId(userId));
            newUser.setUsername(username);
            newUser.setEmail(email);
            return userService.createUser(newUser);
        })).flatMap(user -> {
            logger.info("Updating existing user with userId: {}", user.getId());
            if (username != null) {
                user.setUsername(username);
            }
            if (email != null) {
                user.setEmail(email);
            }

            return apiKeyService.generateOrFetchApiKey(user.getId().toString()).flatMap(apiKey -> {
                user.setApiKey(apiKey.getKey());
                return userService.updateUser(user.getId().toString(), user);
            });
        }).subscribe(updatedUser -> {
            String response;
            try {
                response = OBJECT_MAPPER.writeValueAsString(updatedUser);
                logger.info("User updated successfully: {}", response);
                ctx.channel().writeAndFlush(new TextWebSocketFrame("User updated: " + response));
            } catch (JsonProcessingException e) {
                logger.error("Error processing user update response: {}", e.getMessage());
                ctx.channel().writeAndFlush(new TextWebSocketFrame(
                        "Error processing user update response: " + e.getMessage()));
            }
        }, error -> {
            logger.error("Error updating user: {}", error.getMessage());
            ctx.channel().writeAndFlush(
                    new TextWebSocketFrame("Error updating user: " + error.getMessage()));
        });
    }
}
