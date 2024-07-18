package com.example.websocket.service.message;

import com.example.websocket.model.Message;
import com.example.websocket.repository.MessageRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class MessageFetchService {
    private final MessageRepository messageRepository;

    public MessageFetchService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
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
}
