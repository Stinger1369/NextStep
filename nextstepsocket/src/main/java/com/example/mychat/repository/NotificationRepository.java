package com.example.mychat.repository;

import com.example.mychat.model.Notification;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface NotificationRepository extends ReactiveMongoRepository<Notification, ObjectId> {
}
