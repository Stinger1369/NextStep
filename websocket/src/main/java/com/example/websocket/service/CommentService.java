package com.example.websocket.service;

import com.example.websocket.model.Comment;
import com.example.websocket.model.Like;
import com.example.websocket.model.Notification;
import com.example.websocket.model.Post;
import com.example.websocket.repository.CommentRepository;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);
    private static final String POST_NOT_FOUND = "Post not found";
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final LikeService likeService;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository,
            UserRepository userRepository, NotificationService notificationService,
            LikeService likeService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.likeService = likeService;
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

    public Mono<Comment> likeComment(String commentId, String userId) {
        return userRepository.findById(userId).flatMap(user -> {
            Like like =
                    new Like(userId, commentId, "comment", user.getFirstName(), user.getLastName());
            return likeService.likeEntity(like)
                    .flatMap(savedLike -> commentRepository.findById(commentId).flatMap(comment -> {
                        comment.addLike(savedLike);
                        return commentRepository.save(comment);
                    }).flatMap(savedComment -> {
                        return userRepository.findById(userId).flatMap(likeUser -> {
                            likeUser.addLike(savedLike);
                            return userRepository.save(likeUser).thenReturn(savedComment);
                        });
                    }).flatMap(savedComment -> {
                        return postRepository.findById(savedComment.getPostId()).flatMap(post -> {
                            post.getComments().stream().filter(c -> c.getId().equals(commentId))
                                    .forEach(c -> c.setLikes(savedComment.getLikes()));
                            return postRepository.save(post).thenReturn(savedComment);
                        });
                    }).flatMap(savedComment -> {
                        Notification notification = new Notification(
                                commentId, "System", "System", "Your comment was liked by "
                                        + user.getFirstName() + " " + user.getLastName(),
                                commentId);
                        return notificationService.createNotification(notification)
                                .thenReturn(savedComment);
                    }));
        });
    }

    public Mono<Comment> unlikeComment(String commentId, String userId) {
        return userRepository.findById(userId).flatMap(user -> {
            Like like =
                    new Like(userId, commentId, "comment", user.getFirstName(), user.getLastName());
            return likeService.unlikeEntity(userId, commentId, "comment")
                    .flatMap(unused -> commentRepository.findById(commentId).flatMap(comment -> {
                        comment.removeLike(like);
                        return commentRepository.save(comment);
                    }).flatMap(savedComment -> {
                        return userRepository.findById(userId).flatMap(likeUser -> {
                            likeUser.removeLike(like);
                            return userRepository.save(likeUser).thenReturn(savedComment);
                        });
                    }).flatMap(savedComment -> {
                        return postRepository.findById(savedComment.getPostId()).flatMap(post -> {
                            post.getComments().stream().filter(c -> c.getId().equals(commentId))
                                    .forEach(c -> c.setLikes(savedComment.getLikes()));
                            return postRepository.save(post).thenReturn(savedComment);
                        });
                    }).flatMap(savedComment -> {
                        Notification notification = new Notification(
                                commentId, "System", "System", "Your comment was unliked by "
                                        + user.getFirstName() + " " + user.getLastName(),
                                commentId);
                        return notificationService.createNotification(notification)
                                .thenReturn(savedComment);
                    }));
        });
    }

    public Mono<Comment> updateComment(String commentId, Comment newCommentData) {
        return commentRepository.findById(commentId).flatMap(existingComment -> {
            existingComment.setContent(newCommentData.getContent());
            existingComment.setUpdatedAt(new Date());
            return commentRepository.save(existingComment).flatMap(updatedComment -> {
                Notification notification = new Notification(commentId, "System", "System",
                        "Your comment was updated", newCommentData.getContent());
                return notificationService.createNotification(notification)
                        .thenReturn(updatedComment);
            });
        }).doOnSuccess(updatedComment -> logger.info("Comment updated: {}", newCommentData))
                .doOnError(error -> logger.error("Error updating comment: {}", error.getMessage()));
    }

    public Mono<Void> deleteComment(String commentId) {
        return commentRepository.findById(commentId)
                .flatMap(comment -> postRepository.findById(comment.getPostId()).flatMap(post -> {
                    post.getComments().removeIf(c -> c.getId().equals(commentId));
                    post.setUpdatedAt(new Date());
                    return postRepository.save(post).flatMap(updatedPost -> userRepository
                            .findById(post.getUserId()).flatMap(user -> {
                                user.getPosts().stream().filter(p -> p.getId().equals(post.getId()))
                                        .forEach(p -> p.getComments()
                                                .removeIf(c -> c.getId().equals(commentId)));
                                return userRepository.save(user)
                                        .then(commentRepository.deleteById(commentId))
                                        .then(Mono.defer(() -> {
                                            Notification notification = new Notification(
                                                    comment.getId(), "System", "System",
                                                    "Your comment was deleted", commentId);
                                            return notificationService
                                                    .createNotification(notification).then();
                                        }));
                            }));
                })).doOnSuccess(deletedComment -> logger.info("Comment deleted: {}", commentId))
                .doOnError(error -> logger.error("Error deleting comment: {}", error.getMessage()));
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
