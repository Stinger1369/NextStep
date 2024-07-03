package com.example.mychat.service;

import com.example.mychat.model.Comment;
import com.example.mychat.repository.CommentRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Mono<Comment> createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public Flux<Comment> getCommentsByPostId(ObjectId postId) {
        return commentRepository.findByPostId(postId);
    }
}
