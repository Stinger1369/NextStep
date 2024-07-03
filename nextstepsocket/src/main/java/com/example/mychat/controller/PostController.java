package com.example.mychat.controller;

import com.example.mychat.model.Post;
import com.example.mychat.model.Notification;
import com.example.mychat.service.PostService;
import com.example.mychat.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.server.ServerResponse;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;
    private final NotificationService notificationService;

    @Autowired
    public PostController(PostService postService, NotificationService notificationService) {
        this.postService = postService;
        this.notificationService = notificationService;
    }

    @PostMapping
    public Mono<ServerResponse> createPost(@RequestBody Post post) {
        return postService.createPost(post)
                .flatMap(savedPost -> {
                    Notification notification = new Notification(savedPost.getUserId(), "New post created");
                    return notificationService.createNotification(notification)
                            .then(ServerResponse.ok().bodyValue(savedPost));
                });
    }

    @GetMapping("/{id}")
    public Mono<ServerResponse> getPostById(@PathVariable String id) {
        return postService.getPostById(id)
                .flatMap(post -> ServerResponse.ok().bodyValue(post))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    @GetMapping
    public Mono<ServerResponse> getAllPosts() {
        return postService.getAllPosts()
                .collectList()
                .flatMap(posts -> ServerResponse.ok().bodyValue(posts));
    }

    @PutMapping("/{id}")
    public Mono<ServerResponse> updatePost(@PathVariable String id, @RequestBody Post post) {
        return postService.updatePost(id, post)
                .flatMap(updatedPost -> ServerResponse.ok().bodyValue(updatedPost))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    @DeleteMapping("/{id}")
    public Mono<ServerResponse> deletePost(@PathVariable String id) {
        return postService.deletePost(id)
                .then(ServerResponse.noContent().build());
    }
}
