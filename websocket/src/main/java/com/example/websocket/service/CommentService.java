package com.example.websocket.service;

import com.example.websocket.model.Comment;
import com.example.websocket.model.Notification;
import com.example.websocket.model.Post;
import com.example.websocket.model.User;
import com.example.websocket.repository.CommentRepository;
import com.example.websocket.repository.UserRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;

@Service
public class CommentService {
    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository,
            NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Mono<User> createComment(Comment comment) {
        logger.info("Creating comment: {}", comment);
        comment.setCreatedAt(new Date());
        comment.setUpdatedAt(new Date());

        return commentRepository.save(comment).flatMap(savedComment -> {
            logger.info("Comment saved: {}", savedComment);
            return userRepository.findById(new ObjectId(comment.getUserId())).flatMap(user -> {
                user.getPosts().stream()
                        .filter(post -> post.getId().toString().equals(comment.getPostId()))
                        .findFirst().ifPresent(post -> post.addComment(savedComment));
                return userRepository.save(user).flatMap(updatedUser -> {
                    Notification notification = new Notification(user.getId().toString(),
                            "New comment added to post: " + savedComment.getContent());
                    return notificationService.createNotification(notification)
                            .flatMap(savedNotification -> {
                                user.addNotification(savedNotification);
                                return userRepository.save(user).thenReturn(updatedUser);
                            });
                });
            });
        }).doOnError(error -> logger.error("Error creating comment: {}", error.getMessage()));
    }

    public Mono<Comment> getCommentById(String id) {
        return commentRepository.findById(new ObjectId(id));
    }

    public Flux<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Mono<Comment> updateComment(String id, Comment comment) {
        return commentRepository.findById(new ObjectId(id)).flatMap(existingComment -> {
            existingComment.setContent(comment.getContent());
            existingComment.setUpdatedAt(new Date());
            return commentRepository.save(existingComment);
        });
    }

    public Mono<Void> deleteComment(String id) {
        return commentRepository.deleteById(new ObjectId(id));
    }
}
