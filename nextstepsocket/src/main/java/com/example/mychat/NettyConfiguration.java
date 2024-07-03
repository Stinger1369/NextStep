package com.example.mychat;

import com.example.mychat.controller.ConversationController;
import com.example.mychat.controller.NotificationController;
import com.example.mychat.controller.PostController;
import com.example.mychat.controller.CommentController;
import com.example.mychat.controller.UserController;
import com.example.mychat.model.Message;
import com.example.mychat.model.Notification;
import com.example.mychat.model.Post;
import com.example.mychat.model.Comment;
import com.example.mychat.model.User;
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
                        NotificationController notificationController,
                        UserController userController,
                        PostController postController,
                        CommentController commentController) {
                return RouterFunctions.route()
                                // Conversation routes
                                .POST("/conversations", request -> request.bodyToMono(Message.class)
                                                .flatMap(conversationController::addMessageToConversation))
                                .GET("/conversations/{id}", request -> conversationController
                                                .getConversationById(request.pathVariable("id")))
                                .GET("/conversations", request -> conversationController.getAllConversations())

                                // Notification routes
                                .POST("/notifications", request -> request.bodyToMono(Notification.class)
                                                .flatMap(notificationController::createNotification))
                                .GET("/notifications/{id}", request -> notificationController
                                                .getNotificationById(request.pathVariable("id")))
                                .GET("/notifications", request -> notificationController.getAllNotifications())
                                .PUT("/notifications/{id}", request -> request.bodyToMono(Notification.class)
                                                .flatMap(notification -> notificationController.updateNotification(
                                                                request.pathVariable("id"), notification)))
                                .DELETE("/notifications/{id}", request -> notificationController
                                                .deleteNotification(request.pathVariable("id"))
                                                .then(ServerResponse.noContent().build()))

                                // User routes
                                .POST("/users", request -> request.bodyToMono(User.class)
                                                .flatMap(userController::createUser)
                                                .flatMap(user -> ServerResponse.ok().bodyValue(user)))
                                .GET("/users/{id}", request -> userController.getUserById(request.pathVariable("id"))
                                                .flatMap(user -> ServerResponse.ok().bodyValue(user))
                                                .switchIfEmpty(ServerResponse.notFound().build()))
                                .GET("/users", request -> ServerResponse.ok().body(userController.getAllUsers(),
                                                User.class))
                                .PUT("/users/{id}", request -> request.bodyToMono(User.class)
                                                .flatMap(user -> userController.updateUser(request.pathVariable("id"),
                                                                user))
                                                .flatMap(user -> ServerResponse.ok().bodyValue(user))
                                                .switchIfEmpty(ServerResponse.notFound().build()))
                                .DELETE("/users/{id}", request -> userController.deleteUser(request.pathVariable("id"))
                                                .then(ServerResponse.noContent().build()))

                                // Post routes
                                .POST("/posts", request -> request.bodyToMono(Post.class)
                                                .flatMap(postController::createPost))
                                .GET("/posts/{id}", request -> postController.getPostById(request.pathVariable("id")))
                                .GET("/posts", request -> postController.getAllPosts())

                                // Comment routes
                                .POST("/comments", request -> request.bodyToMono(Comment.class)
                                                .flatMap(commentController::createComment))
                                .GET("/comments/post/{postId}", request -> commentController
                                                .getCommentsByPostId(request.pathVariable("postId")))

                                .build();
        }
}
