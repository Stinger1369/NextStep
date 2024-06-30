package com.example.mychat.controller;

import com.example.mychat.model.Message;
import com.example.mychat.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.server.ServerResponse;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    public Mono<ServerResponse> createMessage(Message message) {
        return messageService.createMessage(message)
                .flatMap(createdMessage -> ServerResponse.ok().bodyValue(createdMessage));
    }

    public Mono<ServerResponse> getMessageById(String id) {
        return messageService.getMessageById(id)
                .flatMap(message -> ServerResponse.ok().bodyValue(message))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getAllMessages() {
        return ServerResponse.ok().body(messageService.getAllMessages(), Message.class);
    }

    public Mono<ServerResponse> updateMessage(String id, Message message) {
        return messageService.updateMessage(id, message)
                .flatMap(updatedMessage -> ServerResponse.ok().bodyValue(updatedMessage));
    }

    public Mono<ServerResponse> deleteMessage(String id) {
        return messageService.deleteMessage(id).then(ServerResponse.noContent().build());
    }
}
