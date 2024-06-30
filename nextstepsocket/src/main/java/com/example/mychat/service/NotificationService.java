package com.example.mychat.service;

import com.example.mychat.model.Notification;
import com.example.mychat.repository.NotificationRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Mono<Notification> createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Mono<Notification> getNotificationById(String id) {
        return notificationRepository.findById(new ObjectId(id));
    }

    public Flux<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Mono<Notification> updateNotification(String id, Notification notification) {
        return notificationRepository.findById(new ObjectId(id))
                .flatMap(existingNotification -> {
                    notification.setId(new ObjectId(id));
                    return notificationRepository.save(notification);
                });
    }

    public Mono<Void> deleteNotification(String id) {
        return notificationRepository.deleteById(new ObjectId(id));
    }
}
