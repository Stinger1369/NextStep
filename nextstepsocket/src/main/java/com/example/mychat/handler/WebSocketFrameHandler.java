package com.example.mychat.handler;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebSocketFrameHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketFrameHandler.class);

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        logger.info("Handler added: {}", ctx.channel().id());
        super.handlerAdded(ctx);
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        logger.info("Handler removed: {}", ctx.channel().id());
        super.handlerRemoved(ctx);
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame frame) {
        String request = frame.text();
        logger.info("Received message: {}", request);
        ctx.channel().writeAndFlush(new TextWebSocketFrame("Hello, " + request));
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.error("Exception caught: ", cause);
        ctx.close();
    }
}
