package com.example.websocket.service;

import com.example.websocket.model.Notification;
import com.example.websocket.repository.NotificationRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Mono<Notification> createNotification(Notification notification) {
        notification.setCreatedAt(new Date());
        notification.setUpdatedAt(new Date());
        return notificationRepository.save(notification);
    }

    public Mono<Notification> getNotificationById(String id) {
        return notificationRepository.findById(new ObjectId(id));
    }

    public Flux<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Mono<Notification> updateNotification(String id, Notification notification) {
        return notificationRepository.findById(new ObjectId(id)).flatMap(existingNotification -> {
            existingNotification.setMessage(notification.getMessage());
            existingNotification.setUpdatedAt(new Date());
            return notificationRepository.save(existingNotification);
        });
    }

    public Mono<Void> deleteNotification(String id) {
        return notificationRepository.deleteById(new ObjectId(id));
    }
}
