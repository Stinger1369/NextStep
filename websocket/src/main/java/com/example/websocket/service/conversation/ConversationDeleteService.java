package com.example.websocket.service.conversation;

import com.example.websocket.repository.ConversationRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class ConversationDeleteService {
    private final ConversationRepository conversationRepository;

    public ConversationDeleteService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public Mono<Void> deleteConversation(String id) {
        return conversationRepository.deleteById(id);
    }
}
