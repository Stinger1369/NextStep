package com.example.mychat.service;

import com.example.mychat.model.Comment;
import com.example.mychat.repository.CommentRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.Date;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Mono<Comment> createComment(Comment comment) {
        comment.setCreatedAt(new Date());
        comment.setUpdatedAt(new Date());
        return commentRepository.save(comment);
    }

    public Mono<Comment> updateComment(String id, Comment comment) {
        return commentRepository.findById(new ObjectId(id))
                .flatMap(existingComment -> {
                    existingComment.setContent(comment.getContent());
                    existingComment.setUpdatedAt(new Date());
                    return commentRepository.save(existingComment);
                });
    }

    public Mono<Void> deleteComment(String id) {
        return commentRepository.deleteById(new ObjectId(id));
    }

    public Mono<Comment> getCommentById(String id) {
        return commentRepository.findById(new ObjectId(id));
    }

    public Flux<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(new ObjectId(postId));
    }
}
