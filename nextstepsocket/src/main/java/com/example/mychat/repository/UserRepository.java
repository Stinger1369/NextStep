package com.example.mychat.repository;

import com.example.mychat.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface UserRepository extends ReactiveMongoRepository<User, ObjectId> {
}
