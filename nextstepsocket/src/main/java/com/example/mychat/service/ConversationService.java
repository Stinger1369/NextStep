package com.example.mychat.service;

import com.example.mychat.model.Conversation;
import com.example.mychat.model.Message;
import com.example.mychat.repository.ConversationRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;

    public ConversationService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public Mono<Conversation> addMessageToConversation(String senderId, String receiverId, Message message) {
        return conversationRepository.findBySenderIdAndReceiverId(senderId, receiverId)
                .switchIfEmpty(conversationRepository.save(new Conversation(senderId, receiverId)))
                .flatMap(conversation -> {
                    conversation.addMessage(message);
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
