package com.example.mychat.controller;

import com.example.mychat.model.Notification;
import com.example.mychat.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.server.ServerResponse;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public Mono<ServerResponse> createNotification(Notification notification) {
        return notificationService.createNotification(notification)
                .flatMap(createdNotification -> ServerResponse.ok().bodyValue(createdNotification));
    }

    public Mono<ServerResponse> getNotificationById(String id) {
        return notificationService.getNotificationById(id)
                .flatMap(notification -> ServerResponse.ok().bodyValue(notification))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getAllNotifications() {
        return ServerResponse.ok().body(notificationService.getAllNotifications(), Notification.class);
    }

    public Mono<ServerResponse> updateNotification(String id, Notification notification) {
        return notificationService.updateNotification(id, notification)
                .flatMap(updatedNotification -> ServerResponse.ok().bodyValue(updatedNotification));
    }

    public Mono<ServerResponse> deleteNotification(String id) {
        return notificationService.deleteNotification(id).then(ServerResponse.noContent().build());
    }
}
