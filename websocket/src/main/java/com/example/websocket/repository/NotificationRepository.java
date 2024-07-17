package com.example.websocket.repository;

import com.example.websocket.model.Notification;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface NotificationRepository extends ReactiveMongoRepository<Notification, String> {
    Mono<Notification> findByUserIdAndContentAndType(String userId, String content, String type);
}
