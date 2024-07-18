package com.example.websocket.service.message;

import com.example.websocket.model.Message;
import com.example.websocket.model.Notification;
import com.example.websocket.repository.MessageRepository;
import com.example.websocket.service.NotificationService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class MessageUnlikeService {
    private static final String SYSTEM = "System";
    private final MessageRepository messageRepository;
    private final NotificationService notificationService;

    public MessageUnlikeService(MessageRepository messageRepository,
            NotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.notificationService = notificationService;
    }

    public Mono<Message> unlikeMessage(String messageId, String userId, String userFirstName,
            String userLastName) {
        return messageRepository.findById(messageId).flatMap(message -> {
            message.removeLike(userId);
            return messageRepository.save(message).flatMap(savedMessage -> {
                Notification notification = new Notification(messageId, SYSTEM, SYSTEM,
                        "Your message was unliked by " + userFirstName + " " + userLastName,
                        message.getContent());
                return notificationService.createNotification(notification)
                        .thenReturn(savedMessage);
            });
        });
    }
}
