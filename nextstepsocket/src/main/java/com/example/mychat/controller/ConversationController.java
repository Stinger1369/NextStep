package com.example.mychat.controller;

import com.example.mychat.model.Conversation;
import com.example.mychat.model.Message;
import com.example.mychat.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.server.ServerResponse;

@RestController
@RequestMapping("/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    @Autowired
    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @PostMapping
    public Mono<ServerResponse> addMessageToConversation(@RequestBody Message message) {
        return conversationService.addMessageToConversation(message.getSenderId(), message.getReceiverId(), message)
                .flatMap(conversation -> ServerResponse.ok().bodyValue(conversation));
    }

    @GetMapping("/{id}")
    public Mono<ServerResponse> getConversationById(@PathVariable String id) {
        return conversationService.getConversationById(id)
                .flatMap(conversation -> ServerResponse.ok().bodyValue(conversation))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    @GetMapping
    public Mono<ServerResponse> getAllConversations() {
        return ServerResponse.ok().body(conversationService.getAllConversations(), Conversation.class);
    }
}
