package com.example; // Ensure the package declaration matches your directory structure

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.*;

import java.nio.charset.StandardCharsets;

import static io.netty.handler.codec.http.HttpResponseStatus.*;
import static io.netty.handler.codec.http.HttpVersion.*;

public class NettyServer {

    private final int port;

    public NettyServer(int port) {
        this.port = port;
    }

    public void start() throws Exception {
        NioEventLoopGroup bossGroup = new NioEventLoopGroup();
        NioEventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap b = new ServerBootstrap();
            b.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .handler(new LoggingHandler(LogLevel.INFO)) // Added LoggingHandler import
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch) throws Exception {
                            ChannelPipeline p = ch.pipeline();
                            p.addLast(new HttpServerCodec());
                            p.addLast(new HttpObjectAggregator(65536));
                            p.addLast(new SimpleHttpServerHandler());
                        }
                    })
                    .option(ChannelOption.SO_BACKLOG, 128)
                    .childOption(ChannelOption.SO_KEEPALIVE, true);

            ChannelFuture f = b.bind(port).sync();
            System.out.println("Netty Server started on port " + port);
            f.channel().closeFuture().sync();
        } finally {
            System.out.println("Shutting down Netty Server");
            workerGroup.shutdownGracefully();
            bossGroup.shutdownGracefully();
        }
    }

    public static void main(String[] args) throws Exception {
        int port = 8080;
        if (args.length > 0) {
            port = Integer.parseInt(args[0]);
        }
        System.out.println("Starting Netty Server on port " + port);
        new NettyServer(port).start();
    }

    private static class SimpleHttpServerHandler extends SimpleChannelInboundHandler<HttpObject> {

        private static final String CONTENT_TYPE = "text/plain";
        private static final String CONNECTION = "keep-alive";

        @Override
        protected void channelRead0(ChannelHandlerContext ctx, HttpObject msg) throws Exception {
            if (msg instanceof FullHttpRequest) {
                FullHttpRequest request = (FullHttpRequest) msg;

                if (request.method() == HttpMethod.GET) {
                    handleGetRequest(ctx, request);
                } else if (request.method() == HttpMethod.POST) {
                    handlePostRequest(ctx, request);
                } else {
                    sendError(ctx, METHOD_NOT_ALLOWED);
                }
            }
        }

        private void handleGetRequest(ChannelHandlerContext ctx, FullHttpRequest request) {
            DefaultFullHttpResponse response = new DefaultFullHttpResponse(
                    HTTP_1_1, OK, Unpooled.wrappedBuffer("Hello, World! This is a GET request.".getBytes()));
            setCommonResponseHeaders(response);
            ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
            System.out.println("Received HTTP GET request: " + request.uri());
            System.out.println("Sent HTTP response for GET request");
        }

        private void handlePostRequest(ChannelHandlerContext ctx, FullHttpRequest request) {
            ByteBuf content = request.content();
            String message = content.toString(StandardCharsets.UTF_8);

            // You can process the message here, e.g., store it in a database or send a response
            // For demonstration purposes, we'll just echo back the message in the response
            DefaultFullHttpResponse response = new DefaultFullHttpResponse(
                    HTTP_1_1, OK, Unpooled.wrappedBuffer(("Received message: " + message).getBytes()));
            setCommonResponseHeaders(response);
            ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
            System.out.println("Received HTTP POST request: " + request.uri());
            System.out.println("Sent HTTP response for POST request");
        }

        private void sendError(ChannelHandlerContext ctx, HttpResponseStatus status) {
            DefaultFullHttpResponse response = new DefaultFullHttpResponse(HTTP_1_1, status,
                    Unpooled.wrappedBuffer(status.toString().getBytes()));
            setCommonResponseHeaders(response);
            ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
        }

        private void setCommonResponseHeaders(DefaultFullHttpResponse response) {
            response.headers().set(HttpHeaderNames.CONTENT_TYPE, CONTENT_TYPE);
            response.headers().set(HttpHeaderNames.CONTENT_LENGTH, response.content().readableBytes());
            response.headers().set(HttpHeaderNames.CONNECTION, CONNECTION);
        }
    }
}
