package com.example.websocket.service.message;

import com.example.websocket.repository.MessageRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class MessageDeleteService {
    private final MessageRepository messageRepository;

    public MessageDeleteService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
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
}
