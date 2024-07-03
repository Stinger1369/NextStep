package com.example.mychat.controller;

import com.example.mychat.model.Notification;
import com.example.mychat.service.NotificationService;
import com.example.mychat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.server.ServerResponse;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @Autowired
    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @PostMapping
    public Mono<ServerResponse> createNotification(@RequestBody Notification notification) {
        return notificationService.createNotification(notification)
                .flatMap(savedNotification -> userService.getUserById(notification.getUserId())
                        .flatMap(user -> {
                            user.addNotification(savedNotification);
                            return userService.updateUser(user.getId().toHexString(), user)
                                    .then(ServerResponse.ok().bodyValue(savedNotification));
                        }));
    }

    @GetMapping("/{id}")
    public Mono<ServerResponse> getNotificationById(@PathVariable String id) {
        return notificationService.getNotificationById(id)
                .flatMap(notification -> ServerResponse.ok().bodyValue(notification))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    @GetMapping
    public Mono<ServerResponse> getAllNotifications() {
        return ServerResponse.ok().body(notificationService.getAllNotifications(), Notification.class);
    }

    @PutMapping("/{id}")
    public Mono<ServerResponse> updateNotification(@PathVariable String id, @RequestBody Notification notification) {
        return notificationService.updateNotification(id, notification)
                .flatMap(updatedNotification -> ServerResponse.ok().bodyValue(updatedNotification));
    }

    @DeleteMapping("/{id}")
    public Mono<ServerResponse> deleteNotification(@PathVariable String id) {
        return notificationService.deleteNotification(id).then(ServerResponse.noContent().build());
    }
}
