package com.example.mychat.controller;

import com.example.mychat.model.Comment;
import com.example.mychat.service.CommentService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.server.ServerResponse;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public Mono<ServerResponse> createComment(@RequestBody Comment comment) {
        return commentService.createComment(comment)
                .flatMap(savedComment -> ServerResponse.ok().bodyValue(savedComment));
    }

    @GetMapping("/post/{postId}")
    public Mono<ServerResponse> getCommentsByPostId(@PathVariable String postId) {
        return ServerResponse.ok().body(commentService.getCommentsByPostId(new ObjectId(postId)), Comment.class);
    }
}
