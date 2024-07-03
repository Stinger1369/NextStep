package com.example.mychat.service;

import com.example.mychat.model.Conversation;
import com.example.mychat.repository.ConversationRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;

    @Autowired
    public ConversationService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public Mono<Conversation> addMessageToConversation(String senderId, String receiverId, String content) {
        return conversationRepository.findBySenderIdAndReceiverId(senderId, receiverId)
                .defaultIfEmpty(new Conversation(senderId, senderId, receiverId))
                .flatMap(conversation -> {
                    conversation.addMessage(senderId, receiverId, content);
                    return conversationRepository.save(conversation);
                });
    }

    public Mono<Conversation> getConversationById(String id) {
        return conversationRepository.findById(new ObjectId(id));
    }

    public Flux<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }
}
