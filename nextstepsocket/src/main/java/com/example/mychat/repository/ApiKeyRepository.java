package com.example.mychat.repository;

import com.example.mychat.model.ApiKey;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface ApiKeyRepository extends ReactiveMongoRepository<ApiKey, ObjectId> {
    Mono<ApiKey> findByKey(String key);

    Mono<ApiKey> findByOwner(String owner);
}
