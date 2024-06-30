package com.example.mychat.handler;

import static io.netty.handler.codec.http.HttpResponseStatus.OK;
import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;

import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpHeaderNames;
import io.netty.handler.codec.http.HttpHeaderValues;
import io.netty.handler.codec.http.HttpObject;
import java.util.logging.Logger;

public class AuthHandler extends SimpleChannelInboundHandler<HttpObject> {
  private static final Logger logger = Logger.getLogger(AuthHandler.class.getName());

  @Override
  protected void channelRead0(ChannelHandlerContext ctx, HttpObject msg) throws Exception {
    if (msg instanceof FullHttpRequest) {
      FullHttpRequest request = (FullHttpRequest) msg;

      DefaultFullHttpResponse response =
          new DefaultFullHttpResponse(
              HTTP_1_1, OK, Unpooled.wrappedBuffer("Hello, World!".getBytes()));
      response.headers().set(HttpHeaderNames.CONTENT_TYPE, "text/plain");
      response.headers().set(HttpHeaderNames.CONTENT_LENGTH, response.content().readableBytes());
      response.headers().set(HttpHeaderNames.CONNECTION, HttpHeaderValues.KEEP_ALIVE);

      ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
      logger.info("Received HTTP request: " + request.uri());
      logger.info("Sent HTTP response: Hello, World!");
    }
  }

  @Override
  public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
    logger.severe("Exception caught: " + cause.getMessage());
    cause.printStackTrace();
    ctx.close();
  }
}
