package com.example.websocket.service;

import com.example.websocket.model.Conversation;
import com.example.websocket.model.Notification;
import com.example.websocket.model.User;
import com.example.websocket.repository.ConversationRepository;
import com.example.websocket.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ConversationService(ConversationRepository conversationRepository,
            UserRepository userRepository, NotificationService notificationService) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Mono<Conversation> createConversation(Conversation conversation, String initialMessage) {
        conversation.addMessage(conversation.getSenderId(), initialMessage);
        return conversationRepository.save(conversation).flatMap(savedConversation -> {
            Mono<User> senderUpdate =
                    userRepository.findById(savedConversation.getSenderId()).flatMap(sender -> {
                        sender.addConversation(savedConversation);
                        return userRepository.save(sender);
                    });

            Mono<User> receiverUpdate =
                    userRepository.findById(savedConversation.getReceiverId()).flatMap(receiver -> {
                        receiver.addConversation(savedConversation);
                        Notification notification = new Notification(receiver.getId(),
                                "New conversation started by: " + savedConversation.getSenderId());
                        return notificationService.createNotification(notification)
                                .flatMap(savedNotification -> {
                                    receiver.addNotification(savedNotification);
                                    return userRepository.save(receiver);
                                });
                    });

            return Mono.when(senderUpdate, receiverUpdate).thenReturn(savedConversation);
        });
    }

    public Mono<Conversation> getConversationById(String id) {
        return conversationRepository.findById(id);
    }

    public Flux<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    public Mono<Conversation> updateConversation(String id, JsonNode payload) {
        return conversationRepository.findById(id).flatMap(existingConversation -> {
            if (payload.hasNonNull("senderId")) {
                existingConversation.setSenderId(payload.get("senderId").asText());
            }
            if (payload.hasNonNull("receiverId")) {
                existingConversation.setReceiverId(payload.get("receiverId").asText());
            }
            existingConversation.setUpdatedAt(new Date());
            return conversationRepository.save(existingConversation);
        });
    }

    public Mono<Void> deleteConversation(String id) {
        return conversationRepository.deleteById(id);
    }
}
