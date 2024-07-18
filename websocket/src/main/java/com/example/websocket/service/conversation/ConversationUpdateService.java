package com.example.websocket.service.conversation;

import com.example.websocket.model.Conversation;
import com.example.websocket.repository.ConversationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Date;

@Service
public class ConversationUpdateService {
    private final ConversationRepository conversationRepository;

    public ConversationUpdateService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public Mono<Conversation> updateConversation(String id, JsonNode payload) {
        return conversationRepository.findById(id).flatMap(existingConversation -> {
            if (payload.hasNonNull("senderId"))
                existingConversation.setSenderId(payload.get("senderId").asText());
            if (payload.hasNonNull("receiverId"))
                existingConversation.setReceiverId(payload.get("receiverId").asText());
            existingConversation.setUpdatedAt(new Date());
            return conversationRepository.save(existingConversation);
        });
    }
}
