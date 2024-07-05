package com.example.mychat.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
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

    public WebSocketFrameHandler(ApiKeyWebSocketHandler apiKeyWebSocketHandler,
            CommentWebSocketHandler commentWebSocketHandler,
            ConversationWebSocketHandler conversationWebSocketHandler,
            NotificationWebSocketHandler notificationWebSocketHandler,
            PostWebSocketHandler postWebSocketHandler, UserWebSocketHandler userWebSocketHandler) {
        this.apiKeyWebSocketHandler = apiKeyWebSocketHandler;
        this.commentWebSocketHandler = commentWebSocketHandler;
        this.conversationWebSocketHandler = conversationWebSocketHandler;
        this.notificationWebSocketHandler = notificationWebSocketHandler;
        this.postWebSocketHandler = postWebSocketHandler;
        this.userWebSocketHandler = userWebSocketHandler;
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        logger.info("Handler added: {}", ctx.channel().id());
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        logger.info("Handler removed: {}", ctx.channel().id());
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame frame)
            throws JsonProcessingException {
        String request = frame.text();
        logger.info("Received message: {}", request);

        try {
            JsonNode jsonNode = OBJECT_MAPPER.readTree(request);
            String action = jsonNode.get("action").asText();
            JsonNode dataNode = jsonNode.get("data");

            logger.info("Action: {}", action);
            logger.info("Data Node: {}", dataNode.toString());

            switch (action) {
                case "createUser":
                    userWebSocketHandler.handleCreateUser(dataNode, ctx);
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
                case "createPost":
                    postWebSocketHandler.handleCreatePost(ctx, dataNode);
                    break;
                case "generateApiKey":
                    apiKeyWebSocketHandler.handleGenerateApiKey(ctx, dataNode);
                    break;
                default:
                    ctx.channel()
                            .writeAndFlush(new TextWebSocketFrame("Unknown action: " + action));
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
}
