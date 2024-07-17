package com.example.websocket.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import com.example.websocket.model.Unlike;
import reactor.core.publisher.Mono;

public interface UnlikeRepository extends ReactiveMongoRepository<Unlike, String> {
    Mono<Unlike> findByUserIdAndEntityIdAndEntityType(String userId, String entityId,
            String entityType);
}
