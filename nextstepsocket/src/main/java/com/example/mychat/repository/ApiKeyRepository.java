package com.example.mychat.repository;

import com.example.mychat.model.ApiKey;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface ApiKeyRepository extends ReactiveMongoRepository<ApiKey, String> {
    Mono<ApiKey> findByKey(String key);
}
