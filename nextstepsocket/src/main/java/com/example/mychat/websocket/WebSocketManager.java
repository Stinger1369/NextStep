package com.example.mychat.websocket;

import io.netty.channel.Channel;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.util.concurrent.GlobalEventExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class WebSocketManager {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketManager.class);
    private final ChannelGroup channels = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

    public void addChannel(Channel channel) {
        channels.add(channel);
        logger.info("Channel added: " + channel.id());
    }

    public void removeChannel(Channel channel) {
        channels.remove(channel);
        logger.info("Channel removed: " + channel.id());
    }

    public void broadcastMessage(String message) {
        for (Channel channel : channels) {
            channel.writeAndFlush(new TextWebSocketFrame(message));
        }
        logger.info("Broadcast message: " + message);
    }
}
