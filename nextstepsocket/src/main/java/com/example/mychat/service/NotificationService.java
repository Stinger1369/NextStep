package com.example.mychat.service;

import com.example.mychat.model.Notification;
import com.example.mychat.repository.NotificationRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Mono<Notification> createNotification(Notification notification) {
        return Mono.just(notificationRepository.save(notification));
    }

    public Mono<Notification> getNotificationById(String id) {
        return Mono.justOrEmpty(notificationRepository.findById(new ObjectId(id)));
    }

    public Flux<Notification> getAllNotifications() {
        return Flux.fromIterable(notificationRepository.findAll());
    }

    public Mono<Notification> updateNotification(String id, Notification notification) {
        return Mono.justOrEmpty(notificationRepository.findById(new ObjectId(id)))
                .flatMap(existingNotification -> {
                    notification.setId(new ObjectId(id));
                    return Mono.just(notificationRepository.save(notification));
                });
    }

    public Mono<Void> deleteNotification(String id) {
        return Mono.justOrEmpty(notificationRepository.findById(new ObjectId(id)))
                .flatMap(existingNotification -> {
                    notificationRepository.deleteById(new ObjectId(id));
                    return Mono.empty();
                });
    }
}
