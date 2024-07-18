package com.example.websocket.service;

import com.example.websocket.model.Conversation;
import com.example.websocket.service.conversation.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ConversationService {

    private final ConversationCreationService conversationCreationService;
    private final ConversationFetchService conversationFetchService;
    private final ConversationUpdateService conversationUpdateService;
    private final ConversationDeleteService conversationDeleteService;
    private final ConversationLikeService conversationLikeService;
    private final ConversationUnlikeService conversationUnlikeService;

    private static final Logger logger = LoggerFactory.getLogger(ConversationService.class);

    public ConversationService(ConversationCreationService conversationCreationService,
            ConversationFetchService conversationFetchService,
            ConversationUpdateService conversationUpdateService,
            ConversationDeleteService conversationDeleteService,
            ConversationLikeService conversationLikeService,
            ConversationUnlikeService conversationUnlikeService) {
        this.conversationCreationService = conversationCreationService;
        this.conversationFetchService = conversationFetchService;
        this.conversationUpdateService = conversationUpdateService;
        this.conversationDeleteService = conversationDeleteService;
        this.conversationLikeService = conversationLikeService;
        this.conversationUnlikeService = conversationUnlikeService;
    }

    public Mono<Conversation> createConversation(Conversation conversation, String initialMessage) {
        logger.info("Service: Creating conversation");
        return conversationCreationService.createConversation(conversation, initialMessage);
    }

    public Mono<Conversation> getConversationById(String id) {
        logger.info("Service: Fetching conversation by id {}", id);
        return conversationFetchService.getConversationById(id);
    }

    public Flux<Conversation> getAllConversations() {
        logger.info("Service: Fetching all conversations");
        return conversationFetchService.getAllConversations();
    }

    public Mono<Conversation> updateConversation(String id, JsonNode payload) {
        logger.info("Service: Updating conversation {}", id);
        return conversationUpdateService.updateConversation(id, payload);
    }

    public Mono<Void> deleteConversation(String id) {
        logger.info("Service: Deleting conversation {}", id);
        return conversationDeleteService.deleteConversation(id);
    }

    public Mono<Conversation> likeConversation(String conversationId, String userId) {
        logger.info("Service: Liking conversation {}", conversationId);
        return conversationLikeService.likeConversation(conversationId, userId);
    }

    public Mono<Conversation> unlikeConversation(String conversationId, String userId) {
        logger.info("Service: Unliking conversation {}", conversationId);
        return conversationUnlikeService.unlikeConversation(conversationId, userId);
    }
}
