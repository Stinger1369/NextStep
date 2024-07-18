package com.example.websocket.service;

import com.example.websocket.model.Message;
import com.example.websocket.service.message.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class MessageService {
    private final MessageCreationService messageCreationService;
    private final MessageFetchService messageFetchService;
    private final MessageUpdateService messageUpdateService;
    private final MessageDeleteService messageDeleteService;
    private final MessageLikeService messageLikeService;
    private final MessageUnlikeService messageUnlikeService;

    private static final Logger logger = LoggerFactory.getLogger(MessageService.class);

    public MessageService(MessageCreationService messageCreationService,
            MessageFetchService messageFetchService, MessageUpdateService messageUpdateService,
            MessageDeleteService messageDeleteService, MessageLikeService messageLikeService,
            MessageUnlikeService messageUnlikeService) {
        this.messageCreationService = messageCreationService;
        this.messageFetchService = messageFetchService;
        this.messageUpdateService = messageUpdateService;
        this.messageDeleteService = messageDeleteService;
        this.messageLikeService = messageLikeService;
        this.messageUnlikeService = messageUnlikeService;
    }

    public Mono<Message> createMessage(Message message) {
        logger.info("Service: Creating message");
        return messageCreationService.createMessage(message);
    }

    public Mono<Message> getMessageById(String messageId) {
        logger.info("Service: Fetching message by id {}", messageId);
        return messageFetchService.getMessageById(messageId);
    }

    public Flux<Message> getMessagesByConversationId(String conversationId) {
        logger.info("Service: Fetching messages by conversation id {}", conversationId);
        return messageFetchService.getMessagesByConversationId(conversationId);
    }

    public Flux<Message> getAllMessages() {
        logger.info("Service: Fetching all messages");
        return messageFetchService.getAllMessages();
    }

    public Mono<Message> updateMessage(String messageId, Message newMessageData) {
        logger.info("Service: Updating message {}", messageId);
        return messageUpdateService.updateMessage(messageId, newMessageData);
    }

    public Mono<Void> deleteMessage(String messageId, String userId) {
        logger.info("Service: Deleting message {}", messageId);
        return messageDeleteService.deleteMessage(messageId, userId);
    }

    public Mono<Message> likeMessage(String messageId, String userId, String userFirstName,
            String userLastName) {
        logger.info("Service: Liking message {}", messageId);
        return messageLikeService.likeMessage(messageId, userId, userFirstName, userLastName);
    }

    public Mono<Message> unlikeMessage(String messageId, String userId, String userFirstName,
            String userLastName) {
        logger.info("Service: Unliking message {}", messageId);
        return messageUnlikeService.unlikeMessage(messageId, userId, userFirstName, userLastName);
    }
}
