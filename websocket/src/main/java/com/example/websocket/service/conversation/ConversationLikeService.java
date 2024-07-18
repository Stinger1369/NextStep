package com.example.websocket.service.conversation;

import com.example.websocket.model.Conversation;
import com.example.websocket.model.Like;
import com.example.websocket.model.Notification;
import com.example.websocket.model.Unlike;
import com.example.websocket.repository.ConversationRepository;
import com.example.websocket.repository.LikeRepository;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.NotificationService;
import com.example.websocket.service.LikeService;
import com.example.websocket.service.UnlikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class ConversationLikeService {

    private static final Logger logger = LoggerFactory.getLogger(ConversationLikeService.class);
    private static final String ENTITY_TYPE = "conversation";
    private final ConversationRepository conversationRepository;
    private final LikeService likeService;
    private final UnlikeService unlikeService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public ConversationLikeService(ConversationRepository conversationRepository,
            LikeService likeService, UnlikeService unlikeService,
            NotificationService notificationService, UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.likeService = likeService;
        this.unlikeService = unlikeService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public Mono<Conversation> likeConversation(String conversationId, String userId) {
        logger.info("User {} liking conversation {}", userId, conversationId);

        return conversationRepository.findById(conversationId).flatMap(conversation -> {
            return likeService.hasLikedEntity(userId, conversationId, ENTITY_TYPE)
                    .flatMap(hasLiked -> {
                        if (Boolean.TRUE.equals(hasLiked)) {
                            return Mono.error(
                                    new Exception("User has already liked this conversation."));
                        } else {
                            return userRepository.findById(userId).flatMap(user -> {
                                Like like = new Like(userId, conversationId, ENTITY_TYPE,
                                        user.getFirstName(), user.getLastName());
                                return unlikeService
                                        .removeUnlike(userId, conversationId, ENTITY_TYPE) // Remove
                                                                                           // existing
                                                                                           // unlike
                                                                                           // if
                                                                                           // present
                                        .then(likeService.likeEntity(like)).flatMap(savedLike -> {
                                            conversation.removeUnlike(new Unlike(userId,
                                                    conversationId, ENTITY_TYPE,
                                                    user.getFirstName(), user.getLastName())); // Ensure
                                                                                               // unlike
                                                                                               // is
                                                                                               // removed
                                            conversation.addLike(savedLike); // Add the like to the
                                                                             // conversation
                                            return conversationRepository.save(conversation);
                                        }).flatMap(savedConversation -> {
                                            Notification notification = new Notification(
                                                    conversation.getReceiverId(), "System",
                                                    "System",
                                                    "Your conversation was liked by "
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
        }).doOnError(error -> logger.error("Error liking conversation: {}", error.getMessage()));
    }
}
