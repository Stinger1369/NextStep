package com.example.websocket.repository;

import com.example.websocket.model.Conversation;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface ConversationRepository extends ReactiveMongoRepository<Conversation, ObjectId> {
}
