package com.example.mychat;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.mychat.handler.AuthHandler;
import com.example.mychat.handler.ChatHandler;
import com.example.mychat.handler.NotificationHandler;

import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;

public class ChatServer {
  private static final Logger logger = LoggerFactory.getLogger(ChatServer.class);
  private static final int PORT = 8080;

  public void start() {
    NioEventLoopGroup bossGroup = new NioEventLoopGroup(1);
    NioEventLoopGroup workerGroup = new NioEventLoopGroup();
    try {
      ServerBootstrap b = new ServerBootstrap();
      b.group(bossGroup, workerGroup)
          .channel(NioServerSocketChannel.class)
          .childHandler(new ChannelInitializer<SocketChannel>() {
            @Override
            protected void initChannel(SocketChannel ch) {
              ChannelPipeline p = ch.pipeline();
              p.addLast(new HttpServerCodec());
              p.addLast(new HttpObjectAggregator(65536));
              p.addLast(new WebSocketServerProtocolHandler("/websocket"));
              p.addLast(new HttpServerHandler());
              p.addLast(new ChatHandler());
              p.addLast(new NotificationHandler());
              p.addLast(new AuthHandler());
            }
          });

      ChannelFuture f = b.bind(PORT).sync();
      logger.info("Server started successfully and is listening on port {}", PORT);

      f.channel().closeFuture().sync();
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      e.printStackTrace();
    } finally {
      bossGroup.shutdownGracefully();
      workerGroup.shutdownGracefully();
      logger.info("Server has been stopped.");
    }
  }

  public static void main(String[] args) {
    logger.info("Initializing ChatServer");
    new ChatServer().start();
  }
}
