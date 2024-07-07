package com.example.mychat;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.cors.CorsConfig;
import io.netty.handler.codec.http.cors.CorsConfigBuilder;
import io.netty.handler.codec.http.cors.CorsHandler;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import io.netty.handler.stream.ChunkedWriteHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import com.example.mychat.handler.WebSocketFrameHandler;
import io.netty.handler.codec.http.HttpMethod;

public class NettyServer {

    private static final Logger logger = LoggerFactory.getLogger(NettyServer.class);
    private final int port;
    private final ApplicationContext context;

    public NettyServer(int port, ApplicationContext context) {
        this.port = port;
        this.context = context;
    }

    public void start() throws InterruptedException {
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap b = new ServerBootstrap();
            b.group(bossGroup, workerGroup).channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            logger.info("Initializing channel: {}", ch);

                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast(new HttpServerCodec());
                            pipeline.addLast(new HttpObjectAggregator(64 * 1024));
                            pipeline.addLast(new ChunkedWriteHandler());

                            // Configure CORS
                            CorsConfig corsConfig = CorsConfigBuilder.forAnyOrigin()
                                    .allowedRequestHeaders("*")
                                    .allowedRequestMethods(HttpMethod.GET, HttpMethod.POST,
                                            HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.OPTIONS)
                                    .allowCredentials().build();
                            pipeline.addLast(new CorsHandler(corsConfig));

                            pipeline.addLast(new WebSocketServerProtocolHandler("/ws"));

                            // Inject dependencies
                            WebSocketFrameHandler webSocketFrameHandler =
                                    context.getBean(WebSocketFrameHandler.class);
                            pipeline.addLast(webSocketFrameHandler);
                        }
                    });

            ChannelFuture f = b.bind(port).sync();
            logger.info("Netty server started on port {}", port);
            f.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            logger.error("Server interrupted", e);
            Thread.currentThread().interrupt(); // Re-interrupt the thread
        } catch (Exception e) {
            logger.error("Error starting Netty server", e);
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
            logger.info("Netty server shutdown");
        }
    }
}