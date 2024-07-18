package com.example.websocket.service.conversation;

import com.example.websocket.model.Conversation;
import com.example.websocket.model.Notification;
import com.example.websocket.model.Unlike;
import com.example.websocket.model.Like;
import com.example.websocket.repository.ConversationRepository;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.NotificationService;
import com.example.websocket.service.UnlikeService;
import com.example.websocket.service.LikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class ConversationUnlikeService {

    private static final Logger logger = LoggerFactory.getLogger(ConversationUnlikeService.class);
    private static final String ENTITY_TYPE = "conversation";
    private final ConversationRepository conversationRepository;
    private final LikeService likeService;
    private final UnlikeService unlikeService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public ConversationUnlikeService(ConversationRepository conversationRepository,
            LikeService likeService, UnlikeService unlikeService,
            NotificationService notificationService, UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.likeService = likeService;
        this.unlikeService = unlikeService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public Mono<Conversation> unlikeConversation(String conversationId, String userId) {
        logger.info("User {} unliking conversation {}", userId, conversationId);

        return conversationRepository.findById(conversationId).flatMap(conversation -> {
            return unlikeService.hasUnlikedEntity(userId, conversationId, ENTITY_TYPE)
                    .flatMap(hasUnliked -> {
                        if (Boolean.TRUE.equals(hasUnliked)) {
                            return Mono.error(
                                    new Exception("User has already unliked this conversation."));
                        } else {
                            return userRepository.findById(userId).flatMap(user -> {
                                Unlike unlike = new Unlike(userId, conversationId, ENTITY_TYPE,
                                        user.getFirstName(), user.getLastName());
                                return likeService.unlikeEntity(userId, conversationId, ENTITY_TYPE) // Remove
                                                                                                     // existing
                                                                                                     // like
                                                                                                     // if
                                                                                                     // present
                                        .then(unlikeService.unlikeEntity(unlike))
                                        .flatMap(savedUnlike -> {
                                            conversation.removeLike(new Like(userId, conversationId,
                                                    ENTITY_TYPE, user.getFirstName(),
                                                    user.getLastName())); // Ensure like is removed
                                            conversation.addUnlike(savedUnlike); // Add the unlike
                                                                                 // to the
                                                                                 // conversation
                                            return conversationRepository.save(conversation);
                                        }).flatMap(savedConversation -> {
                                            Notification notification = new Notification(
                                                    conversation.getReceiverId(), "System",
                                                    "System",
                                                    "Your conversation was unliked by "
                                                            + user.getFirstName() + " "
                                                            + user.getLastName(),
                                                    conversationId);
                                            return notificationService
                                                    .createNotification(notification)
                                                    .thenReturn(savedConversation);
                                        });
                            });
                        }
                    });
        }).doOnError(error -> logger.error("Error unliking conversation: {}", error.getMessage()));
    }
}
