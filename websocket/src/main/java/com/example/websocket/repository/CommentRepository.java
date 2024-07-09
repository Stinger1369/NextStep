package com.example.websocket.repository;

import com.example.websocket.model.Comment;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface CommentRepository extends ReactiveMongoRepository<Comment, ObjectId> {
}
