package com.example.websocket.service;

import com.example.websocket.model.Comment;
import com.example.websocket.service.comment.CommentCreationService;
import com.example.websocket.service.comment.CommentDeleteService;
import com.example.websocket.service.comment.CommentLikeService;
import com.example.websocket.service.comment.CommentUnlikeService;
import com.example.websocket.service.comment.CommentUpdateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);
    private final CommentCreationService commentCreationService;
    private final CommentUpdateService commentUpdateService;
    private final CommentDeleteService commentDeleteService;
    private final CommentLikeService commentLikeService;
    private final CommentUnlikeService commentUnlikeService;

    public CommentService(CommentCreationService commentCreationService,
            CommentUpdateService commentUpdateService, CommentDeleteService commentDeleteService,
            CommentLikeService commentLikeService, CommentUnlikeService commentUnlikeService) {
        this.commentCreationService = commentCreationService;
        this.commentUpdateService = commentUpdateService;
        this.commentDeleteService = commentDeleteService;
        this.commentLikeService = commentLikeService;
        this.commentUnlikeService = commentUnlikeService;
    }

    public Mono<Comment> createComment(Comment comment) {
        logger.info("Service: Creating comment");
        return commentCreationService.createComment(comment);
    }

    public Mono<Comment> updateComment(String commentId, Comment newCommentData) {
        logger.info("Service: Updating comment {}", commentId);
        return commentUpdateService.updateComment(commentId, newCommentData);
    }

    public Mono<Void> deleteComment(String commentId) {
        logger.info("Service: Deleting comment {}", commentId);
        return commentDeleteService.deleteComment(commentId);
    }

    public Mono<Comment> likeComment(String commentId, String userId) {
        logger.info("Service: Liking comment {}", commentId);
        return commentLikeService.likeComment(commentId, userId);
    }

    public Mono<Comment> unlikeComment(String commentId, String userId) {
        logger.info("Service: Unliking comment {}", commentId);
        return commentUnlikeService.unlikeComment(commentId, userId);
    }

    public Mono<Comment> getCommentById(String commentId) {
        logger.info("Service: Fetching comment by id {}", commentId);
        return commentCreationService.getCommentById(commentId);
    }

    public Flux<Comment> getAllComments() {
        logger.info("Service: Fetching all comments");
        return commentCreationService.getAllComments();
    }
}
