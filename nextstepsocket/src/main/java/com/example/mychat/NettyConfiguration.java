package com.example.mychat;

import com.example.mychat.controller.*;
import com.example.mychat.dto.CommentDTO;
import com.example.mychat.dto.ConversationDTO;
import com.example.mychat.model.Notification;
import com.example.mychat.model.Post;
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

@Configuration
@EnableWebFlux
public class NettyConfiguration {

    private static final String CONVERSATIONS_ID = "/conversations/{id}";
    private static final String NOTIFICATIONS_ID = "/notifications/{id}";
    private static final String USERS_ID = "/users/{id}";
    private static final String POSTS_ID = "/posts/{id}";
    private static final String COMMENTS_POST_ID = "/comments/post/{postId}";
    private static final String COMMENTS_ID = "/comments/{commentId}";

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
                                                CommentController commentController,
                                                ApiKeyController apiKeyController) {
        return RouterFunctions.route()
                // Conversation routes
                .POST("/conversations", request -> request.bodyToMono(ConversationDTO.class)
                        .flatMap(conversationController::addMessageToConversation))
                .GET(CONVERSATIONS_ID, request -> conversationController
                        .getConversationById(request.pathVariable("id")))
                .GET("/conversations", request -> conversationController.getAllConversations())
                .PUT(CONVERSATIONS_ID, request -> request.bodyToMono(ConversationDTO.class)
                        .flatMap(conversation -> conversationController.updateConversation(
                                request.pathVariable("id"), conversation)))
                .DELETE(CONVERSATIONS_ID,
                        request -> conversationController
                                .deleteConversation(request.pathVariable("id"))
                                .then(ServerResponse.noContent().build()))

                // Notification routes
                .POST("/notifications", request -> request.bodyToMono(Notification.class)
                        .flatMap(notificationController::createNotification))
                .GET(NOTIFICATIONS_ID, request -> notificationController
                        .getNotificationById(request.pathVariable("id")))
                .GET("/notifications", request -> notificationController.getAllNotifications())
                .PUT(NOTIFICATIONS_ID, request -> request.bodyToMono(Notification.class)
                        .flatMap(notification -> notificationController.updateNotification(
                                request.pathVariable("id"), notification)))
                .DELETE(NOTIFICATIONS_ID,
                        request -> notificationController
                                .deleteNotification(request.pathVariable("id"))
                                .then(ServerResponse.noContent().build()))

                // User routes
                .POST("/users", request -> request.bodyToMono(User.class)
                        .flatMap(userController::createUser)
                        .flatMap(user -> ServerResponse.ok().bodyValue(user)))
                .GET(USERS_ID, request -> userController.getUserById(request.pathVariable("id"))
                        .flatMap(user -> ServerResponse.ok().bodyValue(user))
                        .switchIfEmpty(ServerResponse.notFound().build()))
                .GET("/users", request -> userController.getAllUsers()
                        .collectList()
                        .flatMap(users -> ServerResponse.ok().bodyValue(users)))
                .PUT(USERS_ID, request -> request.bodyToMono(User.class)
                        .flatMap(user -> userController
                                .updateUser(request.pathVariable("id"), user)
                                .flatMap(updatedUser -> ServerResponse.ok()
                                        .bodyValue(updatedUser))
                                .switchIfEmpty(ServerResponse.notFound().build())))
                .DELETE(USERS_ID, request -> userController.deleteUser(request.pathVariable("id"))
                        .then(ServerResponse.noContent().build()))

                // Post routes
                .POST("/posts", request -> request.bodyToMono(Post.class)
                        .flatMap(postController::createPost))
                .GET(POSTS_ID, request -> postController.getPostById(request.pathVariable("id")))
                .GET("/posts", request -> postController.getAllPosts())
                .PUT(POSTS_ID, request -> request.bodyToMono(Post.class)
                        .flatMap(post -> postController.updatePost(
                                request.pathVariable("id"), post)))
                .DELETE(POSTS_ID,
                        request -> postController
                                .deletePost(request.pathVariable("id"))
                                .then(ServerResponse.noContent().build()))

                // Comment routes
                .POST(COMMENTS_POST_ID, request -> request.bodyToMono(CommentDTO.class)
                        .flatMap(comment -> commentController.createComment(
                                request.pathVariable("postId"), comment)))
                .PUT(COMMENTS_ID, request -> request.bodyToMono(CommentDTO.class)
                        .flatMap(comment -> commentController.updateComment(
                                request.pathVariable("commentId"), comment)))
                .DELETE(COMMENTS_ID,
                        request -> commentController
                                .deleteComment(request.pathVariable("commentId")))
                .GET(COMMENTS_POST_ID, request -> commentController
                        .getCommentsByPostId(request.pathVariable("postId")))

                // API Key route
                .POST("/api-keys", request -> {
                    String owner = request.queryParam("owner").orElse("defaultOwner");
                    return apiKeyController.createApiKey(owner);
                })

                .build();
    }
}
