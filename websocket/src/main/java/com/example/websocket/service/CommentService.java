package com.example.websocket.service;

import com.example.websocket.model.Comment;
import com.example.websocket.model.Post;
import com.example.websocket.model.User;
import com.example.websocket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);
    private final UserRepository userRepository;
    private final PostService postService;

    public CommentService(UserRepository userRepository, PostService postService) {
        this.userRepository = userRepository;
        this.postService = postService;
    }

    public Mono<Comment> createComment(Comment comment) {
        return userRepository.findById(comment.getUserId()).flatMap(user -> {
            Post post = user.getPosts().stream().filter(p -> p.getId().equals(comment.getPostId()))
                    .findFirst().orElseThrow(() -> new IllegalArgumentException("Post not found"));
            post.addComment(comment);
            return userRepository.save(user).thenReturn(comment);
        }).doOnSuccess(savedComment -> {
            postService.addCommentToPost(savedComment.getPostId(), savedComment).subscribe();
            logger.info("Comment saved: {}", comment);
        }).doOnError(error -> logger.error("Error creating comment: {}", error.getMessage()));
    }

    public Mono<User> updateComment(String commentId, Comment newCommentData) {
        return userRepository.findById(newCommentData.getUserId()).flatMap(user -> {
            Post post = user.getPosts().stream()
                    .filter(p -> p.getId().equals(newCommentData.getPostId())).findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Post not found"));
            Comment comment =
                    post.getComments().stream().filter(c -> c.getId().equals(commentId)).findFirst()
                            .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
            comment.setContent(newCommentData.getContent());
            return userRepository.save(user);
        }).doOnSuccess(savedUser -> logger.info("Comment updated: {}", newCommentData))
                .doOnError(error -> logger.error("Error updating comment: {}", error.getMessage()));
    }

    public Mono<User> deleteComment(String commentId) {
        return userRepository.findAll()
                .filter(user -> user.getPosts().stream()
                        .anyMatch(post -> post.getComments().stream()
                                .anyMatch(comment -> comment.getId().equals(commentId))))
                .next().flatMap(user -> {
                    Post post = user.getPosts().stream()
                            .filter(p -> p.getComments().stream()
                                    .anyMatch(c -> c.getId().equals(commentId)))
                            .findFirst()
                            .orElseThrow(() -> new IllegalArgumentException("Post not found"));
                    post.getComments().removeIf(comment -> comment.getId().equals(commentId));
                    return userRepository.save(user);
                }).doOnSuccess(savedUser -> logger.info("Comment deleted: {}", commentId))
                .doOnError(error -> logger.error("Error deleting comment: {}", error.getMessage()));
    }

    public Mono<Comment> getCommentById(String commentId) {
        return userRepository.findAll()
                .flatMap(user -> user.getPosts().stream()
                        .flatMap(post -> post.getComments().stream())
                        .filter(comment -> comment.getId().equals(commentId)).findFirst()
                        .map(Mono::just).orElseGet(Mono::empty))
                .next().doOnSuccess(comment -> {
                    if (comment != null) {
                        logger.info("Comment fetched: {}", comment);
                    } else {
                        logger.warn("No comment found with ID: {}", commentId);
                    }
                })
                .doOnError(error -> logger.error("Error fetching comment: {}", error.getMessage()));
    }

    public Flux<Comment> getAllComments() {
        return userRepository.findAll().flatMap(user -> Flux.fromIterable(user.getPosts()))
                .flatMap(post -> Flux.fromIterable(post.getComments()))
                .doOnComplete(() -> logger.info("All comments fetched")).doOnError(
                        error -> logger.error("Error fetching comments: {}", error.getMessage()));
    }
}
