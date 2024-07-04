package com.example.mychat.controller;

import com.example.mychat.dto.ConversationDTO;
import com.example.mychat.model.Conversation;
import com.example.mychat.model.Notification;
import com.example.mychat.service.ConversationService;
import com.example.mychat.service.NotificationService;
import com.example.mychat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.server.ServerResponse;

@RestController
@RequestMapping("/conversations")
public class ConversationController {

    private final ConversationService conversationService;
    private final NotificationService notificationService;
    private final UserService userService;

    @Autowired
    public ConversationController(ConversationService conversationService, NotificationService notificationService,
            UserService userService) {
        this.conversationService = conversationService;
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @PostMapping
    public Mono<ServerResponse> addMessageToConversation(@RequestBody ConversationDTO conversationDTO) {
        return conversationService
                .addMessageToConversation(conversationDTO.getSenderId(), conversationDTO.getReceiverId(),
                        conversationDTO.getContent())
                .flatMap(conversation -> {
                    Notification notification = new Notification(conversationDTO.getReceiverId(),
                            "New message from " + conversationDTO.getSenderId());
                    return notificationService.createNotification(notification)
                            .flatMap(notif -> userService.getUserById(conversationDTO.getReceiverId())
                                    .flatMap(receiver -> {
                                        receiver.addNotification(notif);
                                        receiver.addConversation(conversation);
                                        return userService.updateUser(receiver.getId().toHexString(), receiver);
                                    })
                                    .thenReturn(conversation));
                })
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
        return conversationService.getAllConversations()
                .collectList()
                .flatMap(conversations -> ServerResponse.ok().bodyValue(conversations));
    }

    @PutMapping("/{id}")
    public Mono<ServerResponse> updateConversation(@PathVariable String id,
            @RequestBody ConversationDTO conversationDTO) {
        return conversationService.updateConversation(id, conversationDTO)
                .flatMap(updatedConversation -> ServerResponse.ok().bodyValue(updatedConversation))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    @DeleteMapping("/{id}")
    public Mono<ServerResponse> deleteConversation(@PathVariable String id) {
        return conversationService.deleteConversation(id)
                .then(ServerResponse.noContent().build());
    }
}
