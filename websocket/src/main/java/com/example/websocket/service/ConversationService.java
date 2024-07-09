package com.example.websocket.service;

import com.example.websocket.model.Conversation;
import com.example.websocket.repository.ConversationRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;

    public ConversationService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public Mono<Conversation> createConversation(Conversation conversation) {
        conversation.setCreatedAt(new Date());
        conversation.setUpdatedAt(new Date());
        return conversationRepository.save(conversation);
    }

    public Mono<Conversation> getConversationById(String id) {
        return conversationRepository.findById(new ObjectId(id));
    }

    public Flux<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    public Mono<Conversation> updateConversation(String id, Conversation conversation) {
        return conversationRepository.findById(new ObjectId(id)).flatMap(existingConversation -> {
            existingConversation.setSenderId(conversation.getSenderId());
            existingConversation.setReceiverId(conversation.getReceiverId());
            existingConversation.setUpdatedAt(new Date());
            return conversationRepository.save(existingConversation);
        });
    }

    public Mono<Void> deleteConversation(String id) {
        return conversationRepository.deleteById(new ObjectId(id));
    }
}
