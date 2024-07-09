package com.example.mychat.service;

import com.example.mychat.dto.ConversationDTO;
import com.example.mychat.model.Conversation;
import com.example.mychat.model.User;
import com.example.mychat.repository.ConversationRepository;
import com.example.mychat.repository.UserRepository;
import com.example.mychat.util.EncryptionUtil;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final SecretKey key;

    @Autowired
    public ConversationService(ConversationRepository conversationRepository, UserRepository userRepository)
            throws Exception {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.key = EncryptionUtil.generateKey();
    }

    public Mono<Conversation> addMessageToConversation(String senderId, String receiverId, String content) {
        return findConversationBetweenUsers(senderId, receiverId)
                .switchIfEmpty(Mono.defer(() -> {
                    Conversation newConversation = new Conversation(senderId, senderId, receiverId);
                    return conversationRepository.save(newConversation);
                }))
                .flatMap(conversation -> {
                    try {
                        String encryptedContent = EncryptionUtil.encrypt(content, key);
                        conversation.addMessage(senderId, receiverId, encryptedContent);
                        // Update updatedAt date
                        conversation.setUpdatedAt(new Date());
                    } catch (Exception e) {
                        e.printStackTrace();
                        return Mono.error(e);
                    }
                    return conversationRepository.save(conversation)
                            .flatMap(savedConversation -> updateUsersWithConversation(senderId, receiverId,
                                    savedConversation));
                });
    }

    private Mono<Conversation> findConversationBetweenUsers(String userId1, String userId2) {
        return conversationRepository.findBySenderIdAndReceiverId(userId1, userId2)
                .switchIfEmpty(conversationRepository.findBySenderIdAndReceiverId(userId2, userId1));
    }

    private Mono<Conversation> updateUsersWithConversation(String senderId, String receiverId,
            Conversation conversation) {
        return userRepository.findById(new ObjectId(senderId))
                .flatMap(sender -> {
                    addOrUpdateConversation(sender, conversation);
                    return userRepository.save(sender);
                })
                .then(userRepository.findById(new ObjectId(receiverId))
                        .flatMap(receiver -> {
                            addOrUpdateConversation(receiver, conversation);
                            return userRepository.save(receiver);
                        }))
                .thenReturn(conversation);
    }

    private void addOrUpdateConversation(User user, Conversation conversation) {
        user.getConversations().removeIf(conv -> conv.getId().equals(conversation.getId()));
        user.addConversation(conversation);
    }

    public Mono<Conversation> getConversationById(String id) {
        return conversationRepository.findById(new ObjectId(id))
                .flatMap(conversation -> {
                    conversation.getMessages().forEach(message -> {
                        try {
                            String decryptedContent = EncryptionUtil.decrypt(message.getContent(), key);
                            message.setContent(decryptedContent);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                    return Mono.just(conversation);
                });
    }

    public Flux<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    public Mono<Conversation> updateConversation(String id, ConversationDTO conversationDTO) {
        return conversationRepository.findById(new ObjectId(id))
                .flatMap(existingConversation -> {
                    existingConversation.setMessages(conversationDTO.getMessages());
                    existingConversation.setUpdatedAt(new Date()); // Update updatedAt date
                    return conversationRepository.save(existingConversation);
                });
    }

    public Mono<Void> deleteConversation(String id) {
        return conversationRepository.deleteById(new ObjectId(id));
    }
}
