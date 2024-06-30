package com.example.mychat.handler;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ChatHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {
  private static final Logger logger = LoggerFactory.getLogger(ChatHandler.class);

  @Override
  protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame msg) {
    String request = msg.text();
    logger.info("Received message: {}", request);

    // Handle chat message
  }

  @Override
  public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
    cause.printStackTrace();
    ctx.close();
  }
}
