package com.example.websocket.repository;

import com.example.websocket.model.Comment;
import reactor.core.publisher.Flux;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface CommentRepository extends ReactiveMongoRepository<Comment, String> {
    Flux<Comment> findByPostId(String postId);
}
