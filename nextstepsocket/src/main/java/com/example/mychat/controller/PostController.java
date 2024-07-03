package com.example.mychat.controller;

import com.example.mychat.model.Post;
import com.example.mychat.service.PostService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.server.ServerResponse;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public Mono<ServerResponse> createPost(@RequestBody Post post) {
        return postService.createPost(post)
                .flatMap(savedPost -> ServerResponse.ok().bodyValue(savedPost));
    }

    @GetMapping("/{id}")
    public Mono<ServerResponse> getPostById(@PathVariable String id) {
        return postService.getPostById(new ObjectId(id))
                .flatMap(post -> ServerResponse.ok().bodyValue(post))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    @GetMapping
    public Mono<ServerResponse> getAllPosts() {
        return ServerResponse.ok().body(postService.getAllPosts(), Post.class);
    }
}
