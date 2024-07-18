package com.example.websocket.service.message;

import com.example.websocket.model.Message;
import com.example.websocket.model.Notification;
import com.example.websocket.repository.MessageRepository;
import com.example.websocket.service.NotificationService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class MessageCreationService {
    private final MessageRepository messageRepository;
    private final NotificationService notificationService;

    public MessageCreationService(MessageRepository messageRepository,
            NotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.notificationService = notificationService;
    }

    public Mono<Message> createMessage(Message message) {
        return messageRepository.save(message).flatMap(savedMessage -> {
            Notification notification = new Notification(savedMessage.getConversationId(),
                    savedMessage.getSenderFirstName(), savedMessage.getSenderLastName(),
                    "New message from " + savedMessage.getSenderFirstName() + " "
                            + savedMessage.getSenderLastName(),
                    savedMessage.getContent());
            return notificationService.createNotification(notification).thenReturn(savedMessage);
        });
    }
}
