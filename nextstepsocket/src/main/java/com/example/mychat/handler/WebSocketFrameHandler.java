package com.example.mychat.handler;

import com.example.mychat.service.ApiKeyService;
import com.example.mychat.service.UserService;
import com.example.mychat.model.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import io.netty.channel.ChannelHandler.Sharable;

@Sharable
@Component
public class WebSocketFrameHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketFrameHandler.class);
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final ApiKeyWebSocketHandler apiKeyWebSocketHandler;
    private final CommentWebSocketHandler commentWebSocketHandler;
    private final ConversationWebSocketHandler conversationWebSocketHandler;
    private final NotificationWebSocketHandler notificationWebSocketHandler;
    private final PostWebSocketHandler postWebSocketHandler;
    private final UserWebSocketHandler userWebSocketHandler;
    private final ApiKeyService apiKeyService;
    private final UserService userService;

    public WebSocketFrameHandler(ApiKeyWebSocketHandler apiKeyWebSocketHandler,
            CommentWebSocketHandler commentWebSocketHandler,
            ConversationWebSocketHandler conversationWebSocketHandler,
            NotificationWebSocketHandler notificationWebSocketHandler,
            PostWebSocketHandler postWebSocketHandler, UserWebSocketHandler userWebSocketHandler,
            ApiKeyService apiKeyService, UserService userService) {
        this.apiKeyWebSocketHandler = apiKeyWebSocketHandler;
        this.commentWebSocketHandler = commentWebSocketHandler;
        this.conversationWebSocketHandler = conversationWebSocketHandler;
        this.notificationWebSocketHandler = notificationWebSocketHandler;
        this.postWebSocketHandler = postWebSocketHandler;
        this.userWebSocketHandler = userWebSocketHandler;
        this.apiKeyService = apiKeyService;
        this.userService = userService;
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) {
        logger.info("Handler added: {}", ctx.channel().id());
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) {
        logger.info("Handler removed: {}", ctx.channel().id());
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame frame) {
        String request = frame.text();
        logger.info("Received message: {}", request);

        try {
            JsonNode jsonNode = OBJECT_MAPPER.readTree(request);

            // Vérification de la présence de "action"
            JsonNode actionNode = jsonNode.get("action");
            if (actionNode == null || !actionNode.isTextual()) {
                logger.error("Missing or invalid action");
                ctx.channel().writeAndFlush(new TextWebSocketFrame("Missing or invalid action"));
                return;
            }
            String action = actionNode.asText();

            // Vérification de la présence de "data"
            JsonNode dataNode = jsonNode.get("data");
            if (dataNode == null || !dataNode.isObject()) {
                logger.error("Missing or invalid data");
                ctx.channel().writeAndFlush(new TextWebSocketFrame("Missing or invalid data"));
                return;
            }

            logger.info("Action: {}", action);
            logger.info("Data Node: {}", dataNode);

            switch (action) {
                case "generateApiKey":
                    apiKeyWebSocketHandler.handleGenerateApiKey(ctx, dataNode);
                    break;
                case "createUser":
                    userWebSocketHandler.handleCreateUser(dataNode, ctx);
                    break;
                case "login":
                    logger.info("Handling login action with data: {}", dataNode);
                    handleUserLogin(ctx, dataNode);
                    break;
                default:
                    // Vérification de la présence de "apiKey" pour toutes les autres actions
                    JsonNode apiKeyNode = jsonNode.get("apiKey");
                    if (apiKeyNode == null || !apiKeyNode.isTextual()) {
                        logger.error("Missing or invalid API key");
                        ctx.channel().writeAndFlush(
                                new TextWebSocketFrame("Missing or invalid API key"));
                        ctx.close();
                        return;
                    }
                    String apiKey = apiKeyNode.asText();

                    validateApiKey(apiKey).subscribe(isValid -> {
                        if (isValid) {
                            switch (action) {
                                case "createComment":
                                    commentWebSocketHandler.handleCreateComment(ctx, dataNode);
                                    break;
                                case "createConversation":
                                    conversationWebSocketHandler.handleCreateConversation(ctx,
                                            dataNode);
                                    break;
                                case "createNotification":
                                    notificationWebSocketHandler.handleCreateNotification(ctx,
                                            dataNode);
                                    break;
                                case "createPost":
                                    postWebSocketHandler.handleCreatePost(ctx, dataNode);
                                    break;
                                default:
                                    logger.error("Unknown action: {}", action);
                                    ctx.channel().writeAndFlush(
                                            new TextWebSocketFrame("Unknown action: " + action));
                            }
                        } else {
                            logger.error("Invalid API key");
                            ctx.channel().writeAndFlush(new TextWebSocketFrame("Invalid API key"));
                            ctx.close();
                        }
                    });
            }
        } catch (Exception e) {
            logger.error("Error processing message", e);
            ctx.channel().writeAndFlush(
                    new TextWebSocketFrame("Error processing message: " + e.getMessage()));
        }
    }

    private void handleUserLogin(ChannelHandlerContext ctx, JsonNode dataNode) {
        String userId = dataNode.get("userId").asText();
        String username = dataNode.get("username").asText(null);
        String email = dataNode.get("email").asText(null);

        logger.info("Handling user login for userId: {}", userId);
        logger.info("Username: {}, Email: {}", username, email);

        // Création ou mise à jour de l'utilisateur
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

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.error("Exception caught: ", cause);
        ctx.close();
    }

    private Mono<Boolean> validateApiKey(String apiKey) {
        return apiKeyService.validateApiKey(apiKey).map(apiKeyObj -> true).defaultIfEmpty(false);
    }
}
