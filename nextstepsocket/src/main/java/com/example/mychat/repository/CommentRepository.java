package com.example.mychat.repository;

import com.example.mychat.model.Comment;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface CommentRepository extends ReactiveMongoRepository<Comment, ObjectId> {
    Flux<Comment> findByPostId(ObjectId postId);
}
