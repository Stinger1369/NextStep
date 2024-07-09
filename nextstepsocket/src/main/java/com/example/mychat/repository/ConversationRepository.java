package com.example.mychat.repository;

import com.example.mychat.model.Conversation;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface ConversationRepository extends ReactiveMongoRepository<Conversation, ObjectId> {
    Mono<Conversation> findBySenderIdAndReceiverId(String senderId, String receiverId);
}
