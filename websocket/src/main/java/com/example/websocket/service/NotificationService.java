package com.example.websocket.service;

import com.example.websocket.model.Notification;
import com.example.websocket.repository.NotificationRepository;
import com.example.websocket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository,
            UserRepository userRepository, EmailService emailService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
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
            }).doOnSuccess(savedNotification -> {
                logger.info("Notification created: {}", savedNotification);
                // sendEmailNotification(user.getEmail(), savedNotification);
            });
        }).doOnError(error -> {
            logger.error("Error creating notification: {}", error.getMessage());
        });
    }

    // private void sendEmailNotification(String to, Notification notification) {
    // String subject = "New Notification: " + notification.getType();
    // String body = "Dear " + notification.getFirstName() + " " + notification.getLastName()
    // + ",\n\n" + "You have a new notification:\n\n" + notification.getMessage() + "\n\n"
    // + "Best regards,\nYour WebSocket App Team";

    // try {
    // emailService.sendEmail(to, subject, body);
    // logger.info("Email sent to: {}", to);
    // } catch (Exception e) {
    // logger.error("Error sending email: {}", e.getMessage());
    // }
    // }

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

    public Flux<Notification> getNotificationsByUserId(String userId) {
        return notificationRepository.findByUserId(userId);
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
