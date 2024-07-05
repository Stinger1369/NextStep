package com.example.mychat.handler;

import com.example.mychat.service.ApiKeyService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.springframework.stereotype.Component;

@Component
public class ApiKeyWebSocketHandler {

    private final ApiKeyService apiKeyService;
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public ApiKeyWebSocketHandler(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    public void handleGenerateApiKey(ChannelHandlerContext ctx, JsonNode dataNode) {
        String owner = dataNode.get("owner").asText();
        apiKeyService.generateApiKey(owner).subscribe(apiKey -> {
            try {
                String response = OBJECT_MAPPER.writeValueAsString(apiKey);
                ctx.channel()
                        .writeAndFlush(new TextWebSocketFrame("API key generated: " + response));
            } catch (Exception e) {
                ctx.channel().writeAndFlush(
                        new TextWebSocketFrame("Error generating API key: " + e.getMessage()));
            }
        });
    }
}
