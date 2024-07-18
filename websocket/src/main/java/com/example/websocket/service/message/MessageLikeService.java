package com.example.websocket.service.message;

import com.example.websocket.model.Like;
import com.example.websocket.model.Message;
import com.example.websocket.model.Notification;
import com.example.websocket.repository.LikeRepository;
import com.example.websocket.repository.MessageRepository;
import com.example.websocket.service.NotificationService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class MessageLikeService {
    private static final String SYSTEM = "System";
    private final MessageRepository messageRepository;
    private final LikeRepository likeRepository;
    private final NotificationService notificationService;

    public MessageLikeService(MessageRepository messageRepository, LikeRepository likeRepository,
            NotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.likeRepository = likeRepository;
        this.notificationService = notificationService;
    }

    public Mono<Message> likeMessage(String messageId, String userId, String userFirstName,
            String userLastName) {
        return messageRepository.findById(messageId).flatMap(message -> {
            Like like = new Like(userId, messageId, "message", userFirstName, userLastName);
            message.addLike(like);
            return likeRepository.save(like).then(messageRepository.save(message))
                    .flatMap(savedMessage -> {
                        Notification notification = new Notification(messageId, SYSTEM, SYSTEM,
                                "Your message was liked by " + userFirstName + " " + userLastName,
                                message.getContent());
                        return notificationService.createNotification(notification)
                                .thenReturn(savedMessage);
                    });
        });
    }
}
