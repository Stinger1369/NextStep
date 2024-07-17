package com.example.websocket.service;

import com.example.websocket.model.Like;
import com.example.websocket.model.Message;
import com.example.websocket.model.Notification;
import com.example.websocket.repository.MessageRepository;
import com.example.websocket.repository.LikeRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;

@Service
public class MessageService {

    private static final String SYSTEM = "System";

    private final MessageRepository messageRepository;
    private final NotificationService notificationService;
    private final LikeRepository likeRepository;

    public MessageService(MessageRepository messageRepository,
            NotificationService notificationService, LikeRepository likeRepository) {
        this.messageRepository = messageRepository;
        this.notificationService = notificationService;
        this.likeRepository = likeRepository;
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

    public Mono<Message> getMessageById(String messageId) {
        return messageRepository.findById(messageId);
    }

    public Flux<Message> getMessagesByConversationId(String conversationId) {
        return messageRepository.findByConversationId(conversationId);
    }

    public Flux<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public Mono<Message> updateMessage(String messageId, Message newMessageData) {
        return messageRepository.findById(messageId).flatMap(existingMessage -> {
            existingMessage.setContent(newMessageData.getContent());
            existingMessage.setTimestamp(new Date());
            return messageRepository.save(existingMessage);
        });
    }

    public Mono<Void> deleteMessage(String messageId, String userId) {
        return messageRepository.findById(messageId).flatMap(message -> {
            if (message.getSenderId().equals(userId)) {
                return messageRepository.delete(message);
            } else {
                return Mono.error(new Exception("User is not authorized to delete this message"));
            }
        });
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
