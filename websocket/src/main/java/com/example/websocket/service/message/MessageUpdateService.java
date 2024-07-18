package com.example.websocket.service.message;

import com.example.websocket.model.Message;
import com.example.websocket.repository.MessageRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Date;

@Service
public class MessageUpdateService {
    private final MessageRepository messageRepository;

    public MessageUpdateService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Mono<Message> updateMessage(String messageId, Message newMessageData) {
        return messageRepository.findById(messageId).flatMap(existingMessage -> {
            existingMessage.setContent(newMessageData.getContent());
            existingMessage.setTimestamp(new Date());
            return messageRepository.save(existingMessage);
        });
    }
}
