package com.example.websocket.service.comment;

import com.example.websocket.model.Comment;
import com.example.websocket.model.Notification;
import com.example.websocket.repository.CommentRepository;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CommentCreationService {

    private static final Logger logger = LoggerFactory.getLogger(CommentCreationService.class);
    private static final String POST_NOT_FOUND = "Post not found";
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CommentCreationService(CommentRepository commentRepository,
            PostRepository postRepository, UserRepository userRepository,
            NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Mono<Comment> createComment(Comment comment) {
        return postRepository.findById(comment.getPostId()).flatMap(post -> {
            comment.setCreatedAt(new Date());
            comment.setUpdatedAt(new Date());
            return commentRepository.save(comment).flatMap(savedComment -> {
                if (post.getComments().stream()
                        .noneMatch(c -> c.getId().equals(savedComment.getId()))) {
                    post.addComment(savedComment);
                    post.setUpdatedAt(new Date());
                    return postRepository.save(post).thenReturn(savedComment);
                }
                return Mono.just(savedComment);
            }).flatMap(savedComment -> userRepository.findById(post.getUserId()).flatMap(user -> {
                if (user.getPosts().stream().noneMatch(p -> p.getComments().stream()
                        .anyMatch(c -> c.getId().equals(savedComment.getId())))) {
                    user.getPosts().stream().filter(p -> p.getId().equals(post.getId()))
                            .forEach(p -> p.addComment(savedComment));
                }
                return userRepository.save(user).thenReturn(savedComment);
            })).flatMap(savedComment -> {
                Set<String> participantIds = new HashSet<>();
                participantIds.add(post.getUserId());
                participantIds.addAll(post.getComments().stream().map(Comment::getUserId)
                        .collect(Collectors.toSet()));

                Flux<Notification> notifications =
                        Flux.fromIterable(participantIds).flatMap(participantId -> userRepository
                                .findById(participantId).flatMap(participant -> {
                                    if (!participantId.equals(comment.getUserId())) {
                                        Notification notification = new Notification(
                                                participant.getId(), participant.getFirstName(),
                                                participant.getLastName(),
                                                "New comment on post: " + post.getTitle(),
                                                comment.getContent());
                                        return notificationService.createNotification(notification)
                                                .flatMap(savedNotification -> {
                                                    participant.addNotification(savedNotification);
                                                    return userRepository.save(participant)
                                                            .thenReturn(savedNotification);
                                                });
                                    }
                                    return Mono.empty();
                                }));

                return notifications.then(Mono.just(savedComment));
            }).doOnSuccess(savedComment -> logger.info("Comment saved: {}", comment)).doOnError(
                    error -> logger.error("Error creating comment: {}", error.getMessage()));
        }).switchIfEmpty(Mono.error(new Exception(POST_NOT_FOUND)));
    }

    public Mono<Comment> getCommentById(String commentId) {
        return commentRepository.findById(commentId).doOnSuccess(comment -> {
            if (comment != null) {
                logger.info("Comment fetched: {}", comment);
            } else {
                logger.warn("No comment found with ID: {}", commentId);
            }
        }).doOnError(error -> logger.error("Error fetching comment: {}", error.getMessage()));
    }

    public Flux<Comment> getAllComments() {
        return commentRepository.findAll().doOnComplete(() -> logger.info("All comments fetched"))
                .doOnError(
                        error -> logger.error("Error fetching comments: {}", error.getMessage()));
    }
}
