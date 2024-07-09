package com.example.mychat.repository;

import com.example.mychat.model.Comment;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface CommentRepository extends ReactiveMongoRepository<Comment, ObjectId> {
    Flux<Comment> findByPostId(ObjectId postId);
}
