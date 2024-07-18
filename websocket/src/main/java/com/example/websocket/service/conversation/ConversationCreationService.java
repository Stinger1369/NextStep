package com.example.websocket.service.conversation;

import com.example.websocket.model.Conversation;
import com.example.websocket.model.Notification;
import com.example.websocket.model.User;
import com.example.websocket.repository.ConversationRepository;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.NotificationService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class ConversationCreationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ConversationCreationService(ConversationRepository conversationRepository,
            UserRepository userRepository, NotificationService notificationService) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Mono<Conversation> createConversation(Conversation conversation, String initialMessage) {
        conversation.addMessage(conversation.getSenderId(), conversation.getSenderFirstName(),
                conversation.getSenderLastName(), initialMessage);
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
                                receiver.getFirstName(), receiver.getLastName(),
                                "New conversation started by: " + savedConversation.getSenderId(),
                                initialMessage);
                        return notificationService.createNotification(notification)
                                .flatMap(savedNotification -> {
                                    receiver.addNotification(savedNotification);
                                    return userRepository.save(receiver);
                                });
                    });

            return Mono.when(senderUpdate, receiverUpdate).thenReturn(savedConversation);
        });
    }
}
