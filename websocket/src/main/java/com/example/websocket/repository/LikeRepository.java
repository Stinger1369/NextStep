package com.example.websocket.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import com.example.websocket.model.Like;
import reactor.core.publisher.Mono;

public interface LikeRepository extends ReactiveMongoRepository<Like, String> {
    Mono<Like> findByUserIdAndEntityIdAndEntityType(String userId, String entityId,
            String entityType);
}
