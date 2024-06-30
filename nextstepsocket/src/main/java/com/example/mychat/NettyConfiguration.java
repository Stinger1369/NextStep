package com.example.mychat;

import com.example.mychat.controller.ConversationController;
import com.example.mychat.controller.NotificationController;
import com.example.mychat.model.Message;
import com.example.mychat.model.Notification;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.reactive.HttpHandler;
import org.springframework.http.server.reactive.ReactorHttpHandlerAdapter;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.netty.http.server.HttpServer;

import static org.springframework.web.reactive.function.server.RequestPredicates.*;

@Configuration
@EnableWebFlux
public class NettyConfiguration {

    @Bean
    public HttpServer nettyServer(HttpHandler httpHandler) {
        ReactorHttpHandlerAdapter adapter = new ReactorHttpHandlerAdapter(httpHandler);
        HttpServer server = HttpServer.create().host("localhost").port(8080);
        return server.handle(adapter);
    }

    @Bean
    public HttpHandler httpHandler(RouterFunction<?> route) {
        return RouterFunctions.toHttpHandler(route);
    }

    @Bean
    public RouterFunction<ServerResponse> route(ConversationController conversationController,
            NotificationController notificationController) {
        return RouterFunctions.route()
                .POST("/conversations",
                        request -> request.bodyToMono(Message.class).flatMap(conversationController::addMessageToConversation))
                .GET("/conversations/{id}", request -> conversationController.getConversationById(request.pathVariable("id")))
                .GET("/conversations", request -> conversationController.getAllConversations())

                .POST("/notifications",
                        request -> request.bodyToMono(Notification.class)
                                .flatMap(notificationController::createNotification))
                .GET("/notifications/{id}",
                        request -> notificationController.getNotificationById(request.pathVariable("id")))
                .GET("/notifications", request -> notificationController.getAllNotifications())
                .PUT("/notifications/{id}",
                        request -> request.bodyToMono(Notification.class)
                                .flatMap(notification -> notificationController
                                        .updateNotification(request.pathVariable("id"), notification)))
                .DELETE("/notifications/{id}",
                        request -> notificationController.deleteNotification(request.pathVariable("id"))
                                .then(ServerResponse.noContent().build()))
                .build();
    }
}
