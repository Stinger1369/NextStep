package com.example.mychat.service;

import com.example.mychat.model.Message;
import com.example.mychat.repository.MessageRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Mono<Message> createMessage(Message message) {
        return Mono.just(messageRepository.save(message));
    }

    public Mono<Message> getMessageById(String id) {
        return Mono.justOrEmpty(messageRepository.findById(new ObjectId(id)));
    }

    public Flux<Message> getAllMessages() {
        return Flux.fromIterable(messageRepository.findAll());
    }

    public Mono<Message> updateMessage(String id, Message message) {
        return Mono.justOrEmpty(messageRepository.findById(new ObjectId(id)))
                .flatMap(existingMessage -> {
                    message.setId(new ObjectId(id));
                    return Mono.just(messageRepository.save(message));
                });
    }

    public Mono<Void> deleteMessage(String id) {
        return Mono.justOrEmpty(messageRepository.findById(new ObjectId(id)))
                .flatMap(existingMessage -> {
                    messageRepository.deleteById(new ObjectId(id));
                    return Mono.empty();
                });
    }
}
