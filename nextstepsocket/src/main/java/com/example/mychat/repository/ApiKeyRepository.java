package com.example.mychat.repository;

import com.example.mychat.model.ApiKey;
import org.bson.types.ObjectId; // Add this import
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface ApiKeyRepository extends ReactiveMongoRepository<ApiKey, ObjectId> { // Change the type of ID to ObjectId
    Mono<ApiKey> findByKey(String key);
}
