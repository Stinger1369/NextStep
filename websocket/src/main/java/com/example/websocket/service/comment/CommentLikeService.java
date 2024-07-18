package com.example.websocket.service.comment;

import com.example.websocket.model.Comment;
import com.example.websocket.model.Like;
import com.example.websocket.model.Notification;
import com.example.websocket.model.Unlike;
import com.example.websocket.repository.CommentRepository;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.LikeService;
import com.example.websocket.service.NotificationService;
import com.example.websocket.service.UnlikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class CommentLikeService {

    private static final Logger logger = LoggerFactory.getLogger(CommentLikeService.class);
    private static final String ENTITY_TYPE = "comment";
    private final CommentRepository commentRepository;
    private final LikeService likeService;
    private final UnlikeService unlikeService;
    private final NotificationService notificationService;
    private final PostRepository postRepository;

    public CommentLikeService(CommentRepository commentRepository, LikeService likeService,
            UnlikeService unlikeService, NotificationService notificationService,
            PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.likeService = likeService;
        this.unlikeService = unlikeService;
        this.notificationService = notificationService;
        this.postRepository = postRepository;
    }

    public Mono<Comment> likeComment(String commentId, String userId) {
        logger.info("User {} liking comment {}", userId, commentId);

        return commentRepository.findById(commentId).flatMap(comment -> {
            return likeService.hasLikedEntity(userId, commentId, ENTITY_TYPE).flatMap(hasLiked -> {
                if (Boolean.TRUE.equals(hasLiked)) {
                    return Mono.error(new Exception("User has already liked this comment."));
                } else {
                    Like like = new Like(userId, commentId, ENTITY_TYPE, comment.getFirstName(),
                            comment.getLastName());
                    return unlikeService.removeUnlike(userId, commentId, ENTITY_TYPE) // Remove
                                                                                      // existing
                                                                                      // unlike if
                                                                                      // present
                            .then(likeService.likeEntity(like)).flatMap(savedLike -> {
                                comment.removeUnlike(new Unlike(userId, commentId, ENTITY_TYPE,
                                        comment.getFirstName(), comment.getLastName())); // Ensure
                                                                                         // unlike
                                                                                         // is
                                                                                         // removed
                                comment.addLike(savedLike); // Add the like to the comment
                                return commentRepository.save(comment);
                            }).flatMap(savedComment -> postRepository
                                    .findById(savedComment.getPostId()).flatMap(post -> {
                                        post.getComments().stream()
                                                .filter(c -> c.getId().equals(commentId))
                                                .forEach(c -> c.setLikes(savedComment.getLikes()));
                                        return postRepository.save(post).thenReturn(savedComment);
                                    }))
                            .flatMap(savedComment -> {
                                Notification notification =
                                        new Notification(comment.getUserId(), "System", "System",
                                                "Your comment was liked by "
                                                        + comment.getFirstName() + " "
                                                        + comment.getLastName(),
                                                commentId);
                                return notificationService.createNotification(notification)
                                        .thenReturn(savedComment);
                            });
                }
            });
        }).doOnError(error -> logger.error("Error liking comment: {}", error.getMessage()));
    }
}
