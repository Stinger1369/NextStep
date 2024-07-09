package com.example.mychat.repository;

import com.example.mychat.model.Post;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface PostRepository extends ReactiveMongoRepository<Post, ObjectId> {
}
