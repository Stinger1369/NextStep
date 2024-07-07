package com.example.mychat.handler;

import com.example.mychat.handler.servicehandlers.CreatePostHandler;
import com.example.mychat.handler.servicehandlers.LoginHandler;
import com.example.mychat.service.ApiKeyService;
import com.example.mychat.service.UserService;
import com.example.mychat.service.PostService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
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
    private final UserWebSocketHandler userWebSocketHandler;
    private final ApiKeyService apiKeyService;
    private final LoginHandler loginHandler;
    private final CreatePostHandler createPostHandler;

    public WebSocketFrameHandler(ApiKeyWebSocketHandler apiKeyWebSocketHandler,
                                 CommentWebSocketHandler commentWebSocketHandler,
                                 ConversationWebSocketHandler conversationWebSocketHandler,
                                 NotificationWebSocketHandler notificationWebSocketHandler,
                                 UserWebSocketHandler userWebSocketHandler,
                                 ApiKeyService apiKeyService,
                                 UserService userService,
                                 PostService postService) {
        this.apiKeyWebSocketHandler = apiKeyWebSocketHandler;
        this.commentWebSocketHandler = commentWebSocketHandler;
        this.conversationWebSocketHandler = conversationWebSocketHandler;
        this.notificationWebSocketHandler = notificationWebSocketHandler;
        this.userWebSocketHandler = userWebSocketHandler;
        this.apiKeyService = apiKeyService;
        this.loginHandler = new LoginHandler(userService, apiKeyService);
        this.createPostHandler = new CreatePostHandler(postService, userService);
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

            JsonNode actionNode = jsonNode.get("action");
            if (actionNode == null || !actionNode.isTextual()) {
                logger.error("Missing or invalid action");
                ctx.channel().writeAndFlush(new TextWebSocketFrame("Missing or invalid action"));
                return;
            }
            String action = actionNode.asText();

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
                    loginHandler.handleUserLogin(ctx, dataNode);
                    break;
                default:
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
                            handleAction(ctx, action, dataNode);
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

    private void handleAction(ChannelHandlerContext ctx, String action, JsonNode dataNode) {
        switch (action) {
            case "createPost":
                logger.info("Handling createPost action with data: {}", dataNode);
                createPostHandler.handleCreatePost(ctx, dataNode);
                break;
            case "createComment":
                commentWebSocketHandler.handleCreateComment(ctx, dataNode);
                break;
            case "createConversation":
                conversationWebSocketHandler.handleCreateConversation(ctx, dataNode);
                break;
            case "createNotification":
                notificationWebSocketHandler.handleCreateNotification(ctx, dataNode);
                break;
            default:
                logger.error("Unknown action: {}", action);
                ctx.channel().writeAndFlush(new TextWebSocketFrame("Unknown action: " + action));
        }
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
