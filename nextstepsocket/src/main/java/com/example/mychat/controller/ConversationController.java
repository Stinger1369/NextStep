package com.example.mychat.controller;

import com.example.mychat.dto.ConversationDTO;
import com.example.mychat.model.Conversation;
import com.example.mychat.model.Notification;
import com.example.mychat.service.ConversationService;
import com.example.mychat.service.NotificationService;
import com.example.mychat.service.UserService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.server.ServerResponse;

@RestController
@RequestMapping("/conversations")
public class ConversationController {

    private final ConversationService conversationService;
    private final NotificationService notificationService;
    private final UserService userService;

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
                            .flatMap(notif -> {
                                return userService.getUserById(conversationDTO.getSenderId())
                                        .flatMap(sender -> {
                                            sender.addConversation(conversation);
                                            return userService.updateUser(sender.getId().toHexString(), sender)
                                                    .thenReturn(conversation);
                                        })
                                        .flatMap(updatedConversation -> {
                                            return userService.getUserById(conversationDTO.getReceiverId())
                                                    .flatMap(receiver -> {
                                                        receiver.addConversation(updatedConversation);
                                                        receiver.addNotification(notif);
                                                        return userService.updateUser(receiver.getId().toHexString(),
                                                                receiver);
                                                    });
                                        });
                            })
                            .then(ServerResponse.ok().bodyValue(conversation));
                });
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
}
