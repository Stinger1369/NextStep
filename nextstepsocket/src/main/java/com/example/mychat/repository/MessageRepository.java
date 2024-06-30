package com.example.mychat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.mychat.model.Message;

import org.bson.types.ObjectId;

@Repository
public interface MessageRepository extends MongoRepository<Message, ObjectId> {
}
