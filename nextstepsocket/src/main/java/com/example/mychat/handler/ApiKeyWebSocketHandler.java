package com.example.mychat.handler;

import com.fasterxml.jackson.databind.JsonNode;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.example.mychat.service.ApiKeyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class ApiKeyWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(ApiKeyWebSocketHandler.class);
    private final ApiKeyService apiKeyService;

    @Autowired
    public ApiKeyWebSocketHandler(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    public void handleGenerateApiKey(ChannelHandlerContext ctx, JsonNode dataNode) {
        String owner = dataNode.get("owner").asText();
        apiKeyService.generateOrFetchApiKey(owner).subscribe(apiKey -> {
            ctx.channel()
                    .writeAndFlush(new TextWebSocketFrame(
                            "{\"action\":\"generateApiKey\", \"success\":true, \"apiKey\":\""
                                    + apiKey.getKey() + "\"}"));
        }, error -> {
            logger.error("Error generating or fetching API key", error);
            ctx.channel()
                    .writeAndFlush(new TextWebSocketFrame(
                            "{\"action\":\"generateApiKey\", \"success\":false, \"error\":\""
                                    + error.getMessage() + "\"}"));
        });
    }
}
