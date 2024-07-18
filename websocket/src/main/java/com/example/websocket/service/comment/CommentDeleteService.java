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
import reactor.core.publisher.Mono;

import java.util.Date;

@Service
public class CommentDeleteService {

    private static final Logger logger = LoggerFactory.getLogger(CommentDeleteService.class);
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CommentDeleteService(CommentRepository commentRepository, PostRepository postRepository,
            UserRepository userRepository, NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
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
}
