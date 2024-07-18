package com.example.websocket.service.conversation;

import com.example.websocket.model.Conversation;
import com.example.websocket.repository.ConversationRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ConversationFetchService {
    private final ConversationRepository conversationRepository;

    public ConversationFetchService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public Mono<Conversation> getConversationById(String id) {
        return conversationRepository.findById(id);
    }

    public Flux<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }
}
