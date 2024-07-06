package com.example.mychat.handler;

import com.example.mychat.service.ApiKeyService;
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
    private final PostWebSocketHandler postWebSocketHandler;
    private final UserWebSocketHandler userWebSocketHandler;
    private final ApiKeyService apiKeyService;

    public WebSocketFrameHandler(ApiKeyWebSocketHandler apiKeyWebSocketHandler,
            CommentWebSocketHandler commentWebSocketHandler,
            ConversationWebSocketHandler conversationWebSocketHandler,
            NotificationWebSocketHandler notificationWebSocketHandler,
            PostWebSocketHandler postWebSocketHandler, UserWebSocketHandler userWebSocketHandler,
            ApiKeyService apiKeyService) {
        this.apiKeyWebSocketHandler = apiKeyWebSocketHandler;
        this.commentWebSocketHandler = commentWebSocketHandler;
        this.conversationWebSocketHandler = conversationWebSocketHandler;
        this.notificationWebSocketHandler = notificationWebSocketHandler;
        this.postWebSocketHandler = postWebSocketHandler;
        this.userWebSocketHandler = userWebSocketHandler;
        this.apiKeyService = apiKeyService;
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
                ctx.channel().writeAndFlush(new TextWebSocketFrame("Missing or invalid action"));
                return;
            }
            String action = actionNode.asText();

            // Vérification de la présence de "data"
            JsonNode dataNode = jsonNode.get("data");
            if (dataNode == null || !dataNode.isObject()) {
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
                default:
                    // Vérification de la présence de "apiKey" pour toutes les autres actions
                    JsonNode apiKeyNode = jsonNode.get("apiKey");
                    if (apiKeyNode == null || !apiKeyNode.isTextual()) {
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
                                    ctx.channel().writeAndFlush(
                                            new TextWebSocketFrame("Unknown action: " + action));
                            }
                        } else {
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

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.error("Exception caught: ", cause);
        ctx.close();
    }

    private Mono<Boolean> validateApiKey(String apiKey) {
        return apiKeyService.validateApiKey(apiKey).map(apiKeyObj -> true).defaultIfEmpty(false);
    }
}
