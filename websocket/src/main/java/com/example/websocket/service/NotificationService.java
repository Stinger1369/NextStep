package com.example.websocket.service;

import com.example.websocket.model.Notification;
import com.example.websocket.repository.NotificationRepository;
import com.example.websocket.repository.UserRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
            UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Mono<Notification> createNotification(Notification notification) {
        return userRepository.findById(notification.getUserId()).flatMap(user -> {
            notification.setFirstName(user.getFirstName());
            notification.setLastName(user.getLastName());
            notification.setCreatedAt(new Date());
            notification.setUpdatedAt(new Date());
            return notificationRepository.save(notification).flatMap(savedNotification -> {
                user.addNotification(savedNotification);
                return userRepository.save(user).thenReturn(savedNotification);
            });
        });
    }

    public Mono<Void> deleteNotificationByContentAndType(String userId, String content,
            String type) {
        return notificationRepository.findByUserIdAndContentAndType(userId, content, type)
                .flatMap(notification -> notificationRepository.delete(notification));
    }

    public Mono<Notification> getNotificationById(String id) {
        return notificationRepository.findById(id);
    }

    public Flux<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Mono<Notification> updateNotification(String id, Notification notification) {
        return notificationRepository.findById(id).flatMap(existingNotification -> {
            existingNotification.setMessage(notification.getMessage());
            existingNotification.setUpdatedAt(new Date());
            existingNotification.setType(notification.getType());
            return notificationRepository.save(existingNotification);
        });
    }

    public Mono<Void> deleteNotification(String id) {
        return notificationRepository.deleteById(id);
    }
}
