package com.example.websocket.service.comment;

import com.example.websocket.model.Comment;
import com.example.websocket.model.Notification;
import com.example.websocket.repository.CommentRepository;
import com.example.websocket.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Date;

@Service
public class CommentUpdateService {

    private static final Logger logger = LoggerFactory.getLogger(CommentUpdateService.class);
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    public CommentUpdateService(CommentRepository commentRepository,
            NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.notificationService = notificationService;
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
}
