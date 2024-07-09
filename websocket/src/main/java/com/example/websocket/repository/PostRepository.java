package com.example.websocket.repository;

import com.example.websocket.model.Post;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface PostRepository extends ReactiveMongoRepository<Post, ObjectId> {
}
