package com.example.websocket.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import com.example.websocket.model.Post;

public interface PostRepository extends ReactiveMongoRepository<Post, String> {
}
