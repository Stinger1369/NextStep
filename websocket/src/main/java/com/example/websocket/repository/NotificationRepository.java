package com.example.websocket.repository;

import com.example.websocket.model.Notification;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface NotificationRepository extends ReactiveMongoRepository<Notification, String> {
}
